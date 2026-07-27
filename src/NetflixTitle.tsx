import React, { useEffect, useState } from 'react';
import './NetflixTitle.css';
import netflixSound from './netflix-sound.mp3';
import { useNavigate } from 'react-router-dom';
import logoImage from './images/amitesh_logo.png';

const NetflixTitle = () => {
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();

  const handlePlaySound = () => {
    const audio = new Audio(netflixSound);
    audio.play().catch(error => console.error("Audio play error:", error));
    setIsClicked(true); // Starts animation after clicking
  };

  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => {
        navigate('/browse');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isClicked, navigate]);

  return (
    <div className="netflix-container" onClick={handlePlaySound}>
      <div className="logo-wrapper">
        <img 
          src={logoImage} 
          alt="Custom Logo" 
          className={`netflix-logo ${isClicked ? 'animate' : ''}`} 
        />
        {!isClicked && (
          <p className="tap-text">Tap To Enter Portfolio</p>
        )}
      </div>
      <div className="logo-wrapper"></div>
    </div>
  );
};

export default NetflixTitle;
