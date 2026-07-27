import React, { useEffect, useRef, useState } from 'react';
import './Projects.css';
import { Project } from '../types';
import { getProjects } from '../queries/getProjects';
import { FaExternalLinkAlt } from 'react-icons/fa';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
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

  if (loading) return <div className="home-cert-section" style={{ textAlign: 'center', color: '#fff', padding: '60px' }}>Loading projects...</div>;
  if (error) return <div className="home-cert-section" style={{ textAlign: 'center', color: '#e50914', padding: '60px' }}>{error}</div>;
  if (projects.length === 0) return null;

  return (
    <section className="home-cert-section">
      <div className="section-header-flex">
        <h2 className="row-title">Projects</h2>
        <button
          className="expand-section-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse ⌃' : 'View All ⌄'}
        </button>
      </div>

      {!isExpanded && (
        <>
          <button className="row-arrow left" onClick={() => scroll('left')}>❮</button>
          <button className="row-arrow right" onClick={() => scroll('right')}>❯</button>
        </>
      )}

      <div className={`home-cert-row ${isExpanded ? 'expanded-grid' : ''}`} ref={scrollRef}>
        {projects.map((project, index) => {
          const CardContent = (
            <>
              <div className="project-thumbnail-container">
                {project.image?.url ? (
                  <img
                    src={project.image.url}
                    alt={project.title}
                    className="project-thumbnail"
                  />
                ) : (
                <div className="project-thumbnail-fallback">🗂️</div>
              )}
            </div>
            <div className="project-body" style={{ position: 'relative' }}>
              <h3>{project.title}</h3>
              {project.link && (
                <div className="project-link-icon">
                  <FaExternalLinkAlt />
                </div>
              )}
            </div>
          </>
        );

        if (project.link) {
            return (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                key={index}
                className="home-cert-card project-card-custom"
              >
                {CardContent}
              </a>
            );
          }

          return (
            <div
              key={index}
              className="home-cert-card project-card-custom"
            >
              {CardContent}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;