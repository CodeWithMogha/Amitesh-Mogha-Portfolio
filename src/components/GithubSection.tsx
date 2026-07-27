import React, { useEffect, useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
import './GithubSection.css';

interface GithubSectionProps {
  username: string;
}

interface ContribDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContribWeek {
  days: ContribDay[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const LEVEL_COLORS = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];

function buildWeeks(data: { date: string; count: number; level: number }[]): ContribWeek[] {
  const countMap = new Map<string, number>();
  const levelMap = new Map<string, number>();
  data.forEach(d => {
    countMap.set(d.date, d.count);
    levelMap.set(d.date, d.level);
  });

  const weeks: ContribWeek[] = [];

  // Only show 2026
  const start = new Date('2026-01-01T00:00:00');
  // Align to Sunday
  start.setDate(start.getDate() - start.getDay());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cur = new Date(start);
  // We want to show at least a few months or the whole year up to today
  while (cur <= today) {
    const week: ContribDay[] = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = cur.toISOString().slice(0, 10);
      const is2026 = cur.getFullYear() === 2026;
      const count = is2026 ? (countMap.get(dateStr) ?? 0) : 0;
      const apiLevel = is2026 ? (levelMap.get(dateStr) ?? 0) : 0;
      const level = Math.min(4, Math.max(0, apiLevel)) as 0 | 1 | 2 | 3 | 4;

      week.push({ date: dateStr, count, level });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push({ days: week });
  }
  return weeks;
}

// Responsive Heatmap using viewBox scaling
const ContributionHeatmap: React.FC<{ username: string }> = ({ username }) => {
  const [weeks, setWeeks] = useState<ContribWeek[]>([]);
  const [total, setTotal] = useState(0);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; count: number } | null>(null);

  useEffect(() => {
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}`)
      .then(r => r.json())
      .then((json: { contributions: { date: string; count: number; level: number }[]; total: Record<string, number> }) => {
        const data = json.contributions.map(c => ({ date: c.date, count: c.count, level: c.level }));
        setWeeks(buildWeeks(data));
        const thisYear = new Date().getFullYear().toString();
        const yearTotal = json.total?.[thisYear] ?? json.total?.lastYear ?? data.reduce((s, c) => s + c.count, 0);
        setTotal(yearTotal);
      })
      .catch(() => setWeeks(buildWeeks([])));
  }, [username]);

  if (!weeks.length) {
    return (
      <div className="heatmap-loading">
        <div className="heatmap-spinner" />
        <span>Fetching live contributions…</span>
      </div>
    );
  }

  // Fixed logical dimensions; SVG scales via viewBox
  const DAY_LABEL_W = 26;
  const MONTH_LABEL_H = 18;
  const CELL = 10;
  const GAP = 2;
  const STEP = CELL + GAP;
  const numWeeks = weeks.length;
  const VB_W = DAY_LABEL_W + numWeeks * STEP;
  const VB_H = MONTH_LABEL_H + 7 * STEP;

  // Month labels
  const monthLabels: { label: string; x: number }[] = [];
  weeks.forEach((week, wi) => {
    if (!week.days[0]) return;
    const date = new Date(week.days[0].date + 'T00:00:00');
    if (date.getDate() <= 7) {
      monthLabels.push({ label: MONTHS[date.getMonth()], x: DAY_LABEL_W + wi * STEP });
    }
  });

  return (
    <div className="heatmap-wrapper">
      {/* Header */}
      <div className="heatmap-header">
        <span className="heatmap-total">
          <span className="heatmap-count">{total}</span> contributions in 2026
        </span>
        <span className="heatmap-live-badge">● LIVE</span>
      </div>

      {/* SVG Grid — fully responsive via viewBox */}
      <div className="heatmap-svg-container">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          {/* Month labels */}
          {monthLabels.map((m, i) => (
            <text key={i} x={m.x} y={12} fontSize={8} fill="#555" fontFamily="system-ui, sans-serif">
              {m.label}
            </text>
          ))}

          {/* Day labels */}
          {DAYS_LABELS.map((label, di) =>
            label ? (
              <text
                key={di}
                x={DAY_LABEL_W - 4}
                y={MONTH_LABEL_H + di * STEP + CELL - 1}
                fontSize={8}
                fill="#555"
                textAnchor="end"
                fontFamily="system-ui, sans-serif"
              >
                {label}
              </text>
            ) : null
          )}

          {/* Cells */}
          {weeks.map((week, wi) =>
            week.days.map((day, di) => {
              const x = DAY_LABEL_W + wi * STEP;
              const y = MONTH_LABEL_H + di * STEP;
              return (
                <rect
                  key={day.date}
                  x={x} y={y}
                  width={CELL} height={CELL}
                  rx={2} ry={2}
                  fill={LEVEL_COLORS[day.level]}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={e => {
                    const r = (e.target as SVGRectElement).getBoundingClientRect();
                    setTooltip({ x: r.left + r.width / 2, y: r.top, date: day.date, count: day.count });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <title>{day.count} contribution{day.count !== 1 ? 's' : ''} on {day.date}</title>
                </rect>
              );
            })
          )}
        </svg>
      </div>

      {/* Footer: Legend */}
      <div className="heatmap-footer">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="heatmap-link"
        >
          View on GitHub ↗
        </a>
        <div className="heatmap-legend">
          <span>Less</span>
          {LEVEL_COLORS.map((c, i) => (
            <span key={i} className="heatmap-legend-cell" style={{ background: c }} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="heatmap-tooltip"
          style={{ left: tooltip.x, top: tooltip.y - 42 }}
        >
          <strong>{tooltip.count}</strong> contribution{tooltip.count !== 1 ? 's' : ''} on{' '}
          {new Date(tooltip.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      )}
    </div>
  );
};

// ── Main GithubSection ──
const GithubSection: React.FC<GithubSectionProps> = ({ username }) => {
  const activeUsername = username && username !== 'YOUR_USERNAME' ? username : 'CodeWithMogha';

  return (
    <section className="github-section-container darkreader-ignore" data-darkreader-ignore="true">
      <div className="github-section-header">
        <h2 className="row-title" style={{ marginBottom: '12px' }}>GitHub Contributions</h2>
      </div>
      <div className="github-profile-box">
        {/* Left Sidebar */}
        <aside className="github-side-panel">
          <div className="github-avatar-large">
            <img src={`https://github.com/${activeUsername}.png`} alt={activeUsername} />
          </div>
          <div className="github-info-content">
            <h2 className="github-username">{activeUsername}</h2>
            <span className="github-identity">Professional Developer</span>
            <div className="github-bio">
              Passionate about building scalable web applications and exploring innovative solutions.
            </div>
            <a
              href={`https://github.com/${activeUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="github-view-profile"
            >
              View on GitHub
            </a>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="github-main-content">
          <div className="github-graph-container">

            {/* Heatmap Block */}
            <ErrorBoundary>
              <div className="github-feature-block github-graph-wrapper">
                <h3 className="block-heading">Contribution Graph</h3>
                <div className="github-heatmap-block">
                  <ContributionHeatmap username={activeUsername} />
                </div>
              </div>
            </ErrorBoundary>

          </div>
        </main>
      </div>
    </section>
  );
};

export default GithubSection;
