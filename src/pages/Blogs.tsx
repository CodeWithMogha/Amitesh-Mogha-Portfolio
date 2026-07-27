import React, { useEffect, useState, useRef } from 'react';
import './Blogs.css';
import { getBlogs } from '../queries/getBlogs';
import { Blog } from '../types';

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    getBlogs()
      .then((data) => {
        setBlogs(data);
        setLoading(false);
        setError(false);
      })
      .catch((err) => {
        console.error("Blogs.tsx: Hygraph Blogs Error:", err);
        setError(true);
        setLoading(false);
      });
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

  if (loading) {
    return <div className="home-cert-section" style={{ textAlign: 'center', color: '#fff', padding: '60px' }}>Loading blogs...</div>;
  }

  if (error) {
    return (
      <div className="home-cert-section" style={{ textAlign: 'center', color: '#e50914', padding: '60px' }}>
        Unable to load blogs.
      </div>
    );
  }

  // If zero blogs, show a helpful message instead of nothing
  if (blogs.length === 0) {
    return (
      <section className="home-cert-section">
        <div className="section-header-flex">
          <h2 className="row-title">Blogs</h2>
        </div>
        <div style={{ padding: '20px', color: '#888', border: '1px dashed #333', borderRadius: '8px', textAlign: 'center' }}>
          No published blogs found in Hygraph.
        </div>
      </section>
    );
  }

  return (
    <section className="home-cert-section">
      <div className="section-header-flex">
        <h2 className="row-title">Blogs</h2>
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
        {blogs.map((blog, index) => (
          <div 
            key={index} 
            className="home-cert-card blog-card-netflix-custom" 
            onClick={() => blog.slug && window.open(`/blog/${blog.slug}`, '_blank')}
            style={{ cursor: 'pointer' }}
          >
            <div className="blog-card-img-container">
              {blog.img?.url ? (
                <img src={blog.img.url} alt={blog.title} className="blog-card-img-fit" />
              ) : (
                <div className="blog-card-img-placeholder">✍️</div>
              )}
            </div>
            <h3>{blog.title || 'Untitled'}</h3>
            <p className="cert-issuer">{blog.description || 'No summary available.'}</p>
            <span className="cert-year">{blog.published ? new Date(blog.published).toLocaleDateString() : 'Recent'}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blogs;
