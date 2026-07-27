import React, { useEffect, useState, useRef } from 'react';
import './Recommendations.css';
import { getRecommendations } from '../queries/getRecommendations';
import { Recommendation } from '../types';
import { FaLinkedin, FaQuoteLeft, FaLink } from 'react-icons/fa';

const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getRecommendations();
        setRecommendations(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 600;
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading || recommendations.length === 0) return null;

  return (
    <section className="home-cert-section">
      <h2 className="row-title">Recommendations</h2>

      <div className="row-container-relative">
        {recommendations.length > 1 && (
          <>
            <button className="row-arrow left" onClick={() => scroll('left')}>❮</button>
            <button className="row-arrow right" onClick={() => scroll('right')}>❯</button>
          </>
        )}

        <div className="recommendations-row" ref={scrollRef}>
          {recommendations.map((rec, index) => (
            <div 
              key={index} 
              className="recommendation-card-integrated"
              onClick={() => rec.link && window.open(rec.link, '_blank')}
              style={{ cursor: rec.link ? 'pointer' : 'default' }}
            >
              <div className="rec-quote-icon"><FaQuoteLeft /></div>

              <div className="rec-header">
                {rec.photo?.url ? (
                  <img src={rec.photo.url} alt={rec.name} className="rec-photo" />
                ) : (
                  <div className="rec-photo-placeholder">
                    {rec.name.charAt(0)}
                  </div>
                )}
                <div className="rec-meta">
                  <h4 className="rec-name">{rec.name}</h4>
                  <p className="rec-title">{rec.designation}</p>
                  <p className="rec-org">{rec.organization}</p>
                </div>
              </div>

              <div className="rec-body">
                <p>{rec.message}</p>
              </div>

              <div className="rec-footer">
                {rec.linkedin && (
                  <a href={rec.linkedin} target="_blank" rel="noopener noreferrer" className="rec-icon" onClick={(e) => e.stopPropagation()}>
                    <FaLinkedin />
                  </a>
                )}
                {rec.link && (
                  <a href={rec.link} target="_blank" rel="noopener noreferrer" className="rec-icon" onClick={(e) => e.stopPropagation()}>
                    <FaLink />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Recommendations;
