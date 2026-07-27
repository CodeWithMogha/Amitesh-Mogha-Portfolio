import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './profilePage.css';

import Navbar from '../components/NavBar';
import ProfileBanner from './ProfileBanner';
import TopPicksRow from './TopPicksRow';
import { VscUnmute, VscMute } from 'react-icons/vsc';

type ProfileType = 'recruiter' | 'developer' | 'stalker' | 'adventurer';

// Fallback video map — ensures videos load even on direct URL navigation
const basePath = process.env.PUBLIC_URL || '';
const VIDEO_MAP: Record<ProfileType, string> = {
  recruiter: `${basePath}/videos/recruiter.mp4`,
  developer: `${basePath}/videos/developer.mp4`,
  stalker: `${basePath}/videos/stalker.mp4`,
  adventurer: `${basePath}/videos/adventurer.mp4`,
};

const ProfilePage: React.FC = () => {
  const location = useLocation();
  const { profileName } = useParams();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Safe profile detection
  const profile: ProfileType =
    profileName === 'developer'
      ? 'developer'
      : profileName === 'stalker'
        ? 'stalker'
        : profileName === 'adventurer'
          ? 'adventurer'
          : 'recruiter';

  // Use router state if available, otherwise fall back to local video map
  const backgroundVideo = location.state?.backgroundVideo || VIDEO_MAP[profile];

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  }, []);

  // Pause video when scrolled out of view, resume when visible
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Apply current mute status to video element
    video.muted = isMuted;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch((err) => {
            console.warn("Unmuted autoplay restricted by browser, playing muted:", err);
            video.muted = true;
            setIsMuted(true);
            video.play().catch(() => {});
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [backgroundVideo, isMuted]);

  return (
    <>
      <Navbar />

      <div className="profile-page">
        <video
          ref={videoRef}
          autoPlay
          loop
          playsInline
          muted={isMuted}
          preload="auto"
          className="hero-video"
          key={backgroundVideo}
        >
          {backgroundVideo && <source src={backgroundVideo} type="video/mp4" />}
        </video>

        <div className="hero-overlay" />

        <div className="netflix-controls">
          <button onClick={toggleMute} className="netflix-mute-btn" style={{ zIndex: 200, pointerEvents: 'auto' }}>
            {isMuted ? <VscMute size={20} color="white" /> : <VscUnmute size={20} color="white" />}
          </button>
          <div className="netflix-rating-badge">U/A 13+</div>
        </div>

        <div className="hero-content hero-content-positioned">
          <ProfileBanner />
        </div>
      </div>

      {/* Profile-based content sections */}
      <div className="profile-rows-container">
        <TopPicksRow profile={profile} />
      </div>

    </>
  );
};

export default ProfilePage;