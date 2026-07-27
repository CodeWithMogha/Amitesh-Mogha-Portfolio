import React from 'react';
import './MentorshipSection.css';
import { FaHandshake, FaEnvelope } from 'react-icons/fa';
import { slowSmoothScrollToCenter } from '../utils/smoothScroll';

const MentorshipSection: React.FC = () => {
  const scrollToContact = () => {
    slowSmoothScrollToCenter('contact-me');
  };

  const openLinkedIn = () => {
    window.open('https://www.linkedin.com/in/amiteshmogha/', '_blank');
  };

  return (
    <section className="ms-section">
      {/* Constellation background on the right */}
      <div className="ms-constellation" aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
          {/* Lines */}
          <line x1="80" y1="60" x2="220" y2="30" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"/>
          <line x1="220" y1="30" x2="380" y2="90" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
          <line x1="380" y1="90" x2="520" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>
          <line x1="520" y1="50" x2="570" y2="150" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"/>
          <line x1="60" y1="180" x2="200" y2="150" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>
          <line x1="200" y1="150" x2="320" y2="200" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
          <line x1="320" y1="200" x2="460" y2="170" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>
          <line x1="460" y1="170" x2="570" y2="150" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"/>
          <line x1="100" y1="310" x2="250" y2="280" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>
          <line x1="250" y1="280" x2="400" y2="340" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
          <line x1="400" y1="340" x2="540" y2="300" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>
          {/* Vertical connections */}
          <line x1="220" y1="30" x2="200" y2="150" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8"/>
          <line x1="380" y1="90" x2="320" y2="200" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8"/>
          <line x1="460" y1="170" x2="400" y2="340" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8"/>
          <line x1="200" y1="150" x2="250" y2="280" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8"/>
          {/* Dots/nodes */}
          <circle cx="80" cy="60" r="2.5" fill="rgba(255,255,255,0.25)"/>
          <circle cx="220" cy="30" r="2.5" fill="rgba(255,255,255,0.25)"/>
          <circle cx="380" cy="90" r="4" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
          <circle cx="520" cy="50" r="2.5" fill="rgba(255,255,255,0.2)"/>
          <circle cx="570" cy="150" r="3" fill="rgba(255,255,255,0.2)"/>
          <circle cx="60" cy="180" r="2" fill="rgba(255,255,255,0.15)"/>
          <circle cx="200" cy="150" r="2.5" fill="rgba(255,255,255,0.2)"/>
          <circle cx="320" cy="200" r="3.5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
          <circle cx="460" cy="170" r="2.5" fill="rgba(255,255,255,0.2)"/>
          <circle cx="100" cy="310" r="2" fill="rgba(255,255,255,0.15)"/>
          <circle cx="250" cy="280" r="2.5" fill="rgba(255,255,255,0.2)"/>
          <circle cx="400" cy="340" r="3" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
          <circle cx="540" cy="300" r="2.5" fill="rgba(255,255,255,0.2)"/>
        </svg>
      </div>

      <div className="ms-wrapper">
        {/* Main left card */}
        <div className="ms-main-card">
          <p className="ms-label">A MESSAGE FROM ME</p>
          <h2 className="ms-heading">
            HEY, BEGINNERS —<br />
            <span className="ms-accent">I'VE GOT YOUR BACK.</span>
          </h2>
          <p className="ms-body">
            Starting out in tech is hard. Between the endless frameworks, confusing errors, and
            imposter syndrome — it's easy to feel lost. I've been exactly there.
          </p>
          <p className="ms-body">
            Whether you need career advice, project help, or just someone to talk to
            about code — <span className="ms-inline-accent">I'm always open to connect.</span> Don't hesitate. Reach out below.
          </p>
        </div>

        {/* Action card — floated to the right, overlapping the main card */}
        <div className="ms-action-card">
          <p className="ms-action-label">READY TO CONNECT?</p>
          <div className="ms-actions">
            <button className="ms-btn-primary" onClick={openLinkedIn}>
              <FaHandshake /> LET'S CONNECT
            </button>
            <button className="ms-btn-ghost" onClick={scrollToContact}>
              <FaEnvelope /> CONTACT FORM ↓
            </button>
          </div>
        </div>
      </div>

    </section>
  );
};

export default MentorshipSection;
