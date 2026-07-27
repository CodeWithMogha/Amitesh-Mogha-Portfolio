import React, { useEffect, useState, useRef } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { IoSchool as SchoolIcon } from 'react-icons/io5';
import { IoClose } from 'react-icons/io5';
import './WorkExperience.css';
import { getTimeline } from '../queries/getTimeline';

type ExperienceItem = {
  title: string;
  yearRange: string;
  description: {
    text: string;
  };
  order: number;
};

interface WorkExperienceProps {
  isHorizontal?: boolean;
}

const WorkExperience: React.FC<WorkExperienceProps> = ({ isHorizontal = false }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [timeLineData, setTimeLineData] = useState<ExperienceItem[]>([]);
  const [modalItem, setModalItem] = useState<ExperienceItem | null>(null);

  const scroll = (dir: 'left' | 'right') => {
    rowRef.current?.scrollBy({ left: dir === 'left' ? -600 : 600, behavior: 'smooth' });
  };

  useEffect(() => {
    async function fetchTimelineItem() {
      const data = await getTimeline();
      setTimeLineData(data);
    }
    fetchTimelineItem();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalItem(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (timeLineData.length === 0) {
    return <div style={{ color: 'white', textAlign: 'center' }}>Loading timeline…</div>;
  }

  if (isHorizontal) {
    return (
      <>
        <section className="home-cert-section horizontal-timeline-section">
          <h2 className="row-title">Education &amp; Professional Journey</h2>
          <button className="row-arrow left" onClick={() => scroll('left')}>❮</button>
          <button className="row-arrow right" onClick={() => scroll('right')}>❯</button>

          {/* Scroll row — the original scrollable container */}
          <div className="horizontal-timeline-row" ref={rowRef}>
            {timeLineData
              .sort((a, b) => a.order - b.order)
              .map((item, index) => {
                const isTop = index % 2 === 0;
                const text = item.description?.text || '';
                const preview = text.length > 120 ? text.slice(0, 120) + '…' : text;
                const needsModal = text.length > 120;

                return (
                  <div
                    key={index}
                    className={`horizontal-timeline-item ${isTop ? 'item-top' : 'item-bottom'}`}
                  >
                    {/* Node sitting on the red line */}
                    <div className="timeline-node" />

                    {/* Card — absolutely positioned above or below the line */}
                    <div className="timeline-content">
                      <h3 className="horizontal-timeline-title">{item.title}</h3>
                      <p className="horizontal-timeline-date">{item.yearRange}</p>
                      <p className="horizontal-timeline-desc">{preview}</p>
                      {needsModal && (
                        <button className="expand-btn" onClick={() => setModalItem(item)}>
                          Read More
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

        {/* Netflix modal */}
        {modalItem && (
          <div className="timeline-modal-backdrop" onClick={() => setModalItem(null)}>
            <div className="timeline-modal" onClick={e => e.stopPropagation()}>
              <div className="timeline-modal-header">
                <span className="timeline-modal-badge">Experience</span>
                <button className="timeline-modal-close" onClick={() => setModalItem(null)}>
                  <IoClose size={24} />
                </button>
              </div>
              <div className="timeline-modal-body">
                <h2 className="timeline-modal-title">{modalItem.title}</h2>
                <p className="timeline-modal-date">{modalItem.yearRange}</p>
                <p className="timeline-modal-desc">{modalItem.description?.text}</p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="timeline-container">
        <h2 className="row-title">Education &amp; Professional Journey</h2>
      </div>
      <VerticalTimeline>
        {timeLineData
          .sort((a, b) => a.order - b.order)
          .map((item, index) => {
            const text = item.description?.text || '';
            return (
              <VerticalTimelineElement
                key={index}
                date={item.yearRange}
                dateClassName="vertical-date-text"
                iconStyle={{ background: '#e50914', color: '#fff', boxShadow: '0 0 0 4px #141414, inset 0 2px 0 rgba(0,0,0,.08), 0 3px 0 4px rgba(0,0,0,.05)' }}
                icon={<SchoolIcon />}
                contentStyle={{ color: '#fff', padding: '24px' }}
                contentArrowStyle={{ borderRight: '7px solid transparent' }}
              >
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>{item.title}</h3>
                <div style={{ marginTop: '12px', color: '#b3b3b3', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {text}
                </div>
              </VerticalTimelineElement>
            );
          })}
      </VerticalTimeline>
    </>
  );
};

export default WorkExperience;