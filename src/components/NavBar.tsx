import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaBriefcase, FaTools, FaProjectDiagram, FaEnvelope } from 'react-icons/fa'; // Import icons
import './Navbar.css';
import netflixLogo from '../images/amitesh_logo.png';
import recruiterImage from '../images/recruiter.png';
import { slowSmoothScrollToCenter } from '../utils/smoothScroll';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const profileImage = location.state?.profileImage || recruiterImage;

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 80);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleHireMeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact-me');
    if (contactSection) {
      slowSmoothScrollToCenter('contact-me');
    } else {
      // If not on a page with the contact section, navigate to a page that has it
      navigate('/profile/recruiter');
      // Wait for navigation and then scroll
      setTimeout(() => {
        slowSmoothScrollToCenter('contact-me');
      }, 500);
    }
    closeSidebar();
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-left">
          <Link to="/browser" className="navbar-logo">
            <img src={netflixLogo} alt="Netflix" />
          </Link>
          <ul className="navbar-links">
            <li><Link to="/browse">Home</Link></li>
            <li><Link to="/work-experience">Professional</Link></li>
            <li><Link to="/skills">Skills</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><a href="#contact-me" onClick={handleHireMeClick}>Hire Me</a></li>
          </ul>
        </div>
        <div className="navbar-right">
          {/* Hamburger menu for mobile */}
          <div className="hamburger" onClick={toggleSidebar}>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <img src={profileImage} alt="Profile" className="profile-icon" onClick={() => { navigate('/browse') }} />
        </div>
      </nav>

      {/* Sidebar Overlay */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={closeSidebar}></div>

      {/* Sidebar (only visible on mobile) */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <img src={netflixLogo} alt="Netflix Logo" />
        </div>
        <ul>
          <li><Link to="/browse" onClick={closeSidebar}><FaHome /> Home</Link></li>
          <li><Link to="/work-experience" onClick={closeSidebar}><FaBriefcase /> Professional</Link></li>
          <li><Link to="/skills" onClick={closeSidebar}><FaTools /> Skills</Link></li>
          <li><Link to="/projects" onClick={closeSidebar}><FaProjectDiagram /> Projects</Link></li>
          <li><a href="#contact-me" onClick={handleHireMeClick}><FaEnvelope /> Hire Me</a></li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
