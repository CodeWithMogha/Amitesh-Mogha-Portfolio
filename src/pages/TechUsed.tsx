import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getTechUsed, TechUsedItem } from '../queries/getTechUsed';
import '../styles/Learning.css';

const NODE_R = 55;
const PADDING = NODE_R + 30;

interface NodePhysics {
  x: number;
  y: number;
  vx: number;
  vy: number;
  title: string;
  img: string;
}

const TechUsed: React.FC = () => {
  const [techItems, setTechItems] = useState<TechUsedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number>(0);
  const nodesRef = useRef<NodePhysics[]>([]);
  const nodeGroupRefs = useRef<SVGGElement[]>([]);
  const lineRefs = useRef<SVGLineElement[]>([]);
  const draggedRef = useRef<number | null>(null);
  const mouseOffsetRef = useRef({ x: 0, y: 0 });
  const dimsRef = useRef({ width: 900, height: 650 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getTechUsed().then(data => {
      setTechItems(data);
      setLoading(false);
    });
  }, []);

  // Init nodes once we have data
  useEffect(() => {
    if (loading || !techItems.length) return;
    const w = containerRef.current?.offsetWidth || 900;
    const h = 650;
    dimsRef.current = { width: w, height: h };
    const cx = w / 2;
    const cy = h / 2;

    nodesRef.current = techItems.map((item, i) => {
      const angle = (i / techItems.length) * 2 * Math.PI;
      return {
        x: cx + Math.cos(angle) * 150,
        y: cy + Math.sin(angle) * 150,
        vx: (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random()),
        vy: (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random()),
        title: item.title,
        img: item.image?.url || '',
      };
    });
    setReady(true);
  }, [loading, techItems]);

  // Animation loop — direct DOM updates, no React re-render
  useEffect(() => {
    if (!ready || !nodesRef.current.length) return;

    const TARGET_SPEED = 1.5;
    const REPULSION = 8000;
    const LINK_DIST = 200;
    const SPRING = 0.03;

    const loop = () => {
      const nodes = nodesRef.current;
      const { width, height } = dimsRef.current;
      const dragged = draggedRef.current;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (dragged === i) continue;

        let fx = 0, fy = 0;

        // Repel from other nodes
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const o = nodes[j];
          const dx = n.x - o.x;
          const dy = n.y - o.y;
          const distSq = dx * dx + dy * dy || 1;
          if (distSq < 90000) {
            const dist = Math.sqrt(distSq);
            const force = REPULSION / distSq;
            fx += (dx / dist) * force;
            fy += (dy / dist) * force;
          }
        }

        // Spring link to next node
        const nextIdx = (i + 1) % nodes.length;
        const next = nodes[nextIdx];
        const ldx = next.x - n.x;
        const ldy = next.y - n.y;
        const ldist = Math.sqrt(ldx * ldx + ldy * ldy) || 1;
        const lforce = (ldist - LINK_DIST) * SPRING;
        fx += (ldx / ldist) * lforce;
        fy += (ldy / ldist) * lforce;

        // Apply forces
        n.vx += fx * 0.016;
        n.vy += fy * 0.016;

        // Clamp to target speed
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy) || 1;
        if (speed > TARGET_SPEED) {
          n.vx = (n.vx / speed) * TARGET_SPEED;
          n.vy = (n.vy / speed) * TARGET_SPEED;
        } else if (speed < TARGET_SPEED * 0.4) {
          n.vx *= 1.04;
          n.vy *= 1.04;
        }

        // Smooth DVD wall bounce
        if (n.x + n.vx < PADDING) {
          n.x = PADDING;
          n.vx = Math.abs(n.vx);
        } else if (n.x + n.vx > width - PADDING) {
          n.x = width - PADDING;
          n.vx = -Math.abs(n.vx);
        }

        if (n.y + n.vy < PADDING) {
          n.y = PADDING;
          n.vy = Math.abs(n.vy);
        } else if (n.y + n.vy > height - PADDING) {
          n.y = height - PADDING;
          n.vy = -Math.abs(n.vy);
        }

        n.x += n.vx;
        n.y += n.vy;
      }

      // ── Direct DOM updates (NO React re-render) ──
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const g = nodeGroupRefs.current[i];
        if (g) g.setAttribute('transform', `translate(${n.x}, ${n.y})`);
      }

      // Update link lines
      for (let i = 0; i < nodes.length; i++) {
        const line = lineRefs.current[i];
        if (!line) continue;
        const n = nodes[i];
        const nextIdx = (i + 1) % nodes.length;
        if (nodes.length === 2 && i === 1) continue;
        const next = nodes[nextIdx];
        line.setAttribute('x1', String(n.x));
        line.setAttribute('y1', String(n.y));
        line.setAttribute('x2', String(next.x));
        line.setAttribute('y2', String(next.y));
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ready]);

  // Resize
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        dimsRef.current = { width: containerRef.current.offsetWidth, height: 650 };
      }
    };
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const toSVG = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const r = svg.getBoundingClientRect();
    const { width } = dimsRef.current;
    return {
      x: (e.clientX - r.left) * (width / r.width),
      y: (e.clientY - r.top) * (650 / r.height),
    };
  };

  const handlePointerDown = (e: React.PointerEvent, id: number) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    draggedRef.current = id;
    const pos = toSVG(e);
    const n = nodesRef.current[id];
    mouseOffsetRef.current = { x: pos.x - n.x, y: pos.y - n.y };
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const id = draggedRef.current;
    if (id === null) return;
    const pos = toSVG(e);
    const n = nodesRef.current[id];
    n.x = pos.x - mouseOffsetRef.current.x;
    n.y = pos.y - mouseOffsetRef.current.y;
    n.vx = 0;
    n.vy = 0;
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (draggedRef.current !== null) {
      (e.target as Element).releasePointerCapture(e.pointerId);
      // Give a small flick velocity on release
      draggedRef.current = null;
    }
  }, []);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>Loading Tech Used...</div>;
  if (!techItems.length) return (
    <section className="learning-section">
      <div className="learning-section-header">
        <h2 className="row-title" style={{ marginBottom: '12px' }}>How I Built This</h2>
        <p style={{ color: '#ff4c4c', marginTop: '10px' }}>⚠️ Data not found (Check Hygraph API permissions!)</p>

      </div>
    </section>
  );

  const { width } = dimsRef.current;
  const height = 650;

  return (
    <section className="learning-section">
      <div className="learning-section-header">
        <h2 className="row-title" style={{ marginBottom: '12px' }}>How I Built This</h2>
      </div>


      <div className="learning-graph-container" ref={containerRef}>
        <svg
          ref={svgRef}
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="learning-svg"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ cursor: draggedRef.current !== null ? 'grabbing' : 'default', display: 'block' }}
        >
          <defs>
            <filter id="tu-glow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <radialGradient id="tu-nodeGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(50,50,50,0.95)" />
              <stop offset="100%" stopColor="rgba(12,12,12,0.98)" />
            </radialGradient>
            {/* Static clip paths — at local (0,0) since group handles translation */}
            {techItems.map((_, i) => (
              <clipPath key={`cp-${i}`} id={`tu-cp-${i}`}>
                <circle cx="0" cy="0" r={NODE_R - 14} />
              </clipPath>
            ))}
          </defs>

          {/* Connection lines — positioned by DOM in loop */}
          {techItems.map((_, i) => {
            if (techItems.length === 2 && i === 1) return null;
            return (
              <line
                key={`line-${i}`}
                ref={el => { if (el) lineRefs.current[i] = el; }}
                x1={width / 2} y1={height / 2}
                x2={width / 2} y2={height / 2}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="2"
                style={{ pointerEvents: 'none' }}
              />
            );
          })}

          {/* Node groups — translated by DOM in loop */}
          {techItems.map((item, i) => (
            <g
              key={`node-${i}`}
              ref={el => { if (el) nodeGroupRefs.current[i] = el as SVGGElement; }}
              transform={`translate(${width / 2}, ${height / 2})`}
              onPointerDown={e => handlePointerDown(e, i)}
              style={{ cursor: 'grab', touchAction: 'none' }}
            >
              {/* Outer glow ring */}
              <circle r={NODE_R + 8} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              {/* Main circle */}
              <circle
                r={NODE_R}
                fill="url(#tu-nodeGrad)"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1.5"
                style={{ filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.7))' }}
              />
              {/* Logo image */}
              {item.image?.url && (
                <image
                  href={item.image.url}
                  x={-(NODE_R - 16)}
                  y={-(NODE_R - 16)}
                  width={(NODE_R - 16) * 2}
                  height={(NODE_R - 16) * 2}
                  clipPath={`url(#tu-cp-${i})`}
                  preserveAspectRatio="xMidYMid meet"
                  style={{ pointerEvents: 'none' }}
                />
              )}
              {/* Label pill */}
              <rect x={-42} y={NODE_R + 10} width="84" height="22" rx="11"
                fill="rgba(10,10,10,0.85)" stroke="rgba(255,255,255,0.12)" />
              <text
                x="0" y={NODE_R + 25}
                textAnchor="middle"
                fill="#ccc"
                fontSize="12"
                fontWeight="600"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {item.title}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
};

export default TechUsed;
