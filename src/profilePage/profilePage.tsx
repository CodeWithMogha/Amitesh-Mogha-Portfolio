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

  // isMuted drives the button icon.
  // Default: false (user preference = audio ON).
  const [isMuted, setIsMuted] = useState(false);

  // A ref that always mirrors isMuted without creating stale closures.
  // Effects and callbacks read this ref instead of the isMuted state value
  // to avoid the "2-click" bug caused by reading a captured stale value.
  const isMutedRef = useRef(false);

  // Keep the ref in sync on every render.
  isMutedRef.current = isMuted;

  // ── Helpers ──────────────────────────────────────────────────────────────

  // Apply a mute value to both the DOM element and React state atomically.
  // This is the ONLY function that should ever call setIsMuted.
  const applyMute = useCallback((muted: boolean) => {
    if (videoRef.current) videoRef.current.muted = muted;
    isMutedRef.current = muted;
    setIsMuted(muted);
  }, []);

  // Button click handler — toggles from whatever state we're currently in.
  const toggleMute = useCallback(() => {
    applyMute(!isMutedRef.current);
  }, [applyMute]);

  // ── Profile / video resolution ────────────────────────────────────────────
  const profile: ProfileType =
    profileName === 'developer'
      ? 'developer'
      : profileName === 'stalker'
        ? 'stalker'
        : profileName === 'adventurer'
          ? 'adventurer'
          : 'recruiter';

  const backgroundVideo = location.state?.backgroundVideo || VIDEO_MAP[profile];

  // ── IntersectionObserver: play / pause as video enters / leaves view ──────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Sync DOM with current user preference whenever the video element
    // is (re-)created (the key prop changes when backgroundVideo changes).
    video.muted = isMutedRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Try playing with the user's current preference.
          video.play().catch(() => {
            // Browser blocked unmuted autoplay (typical on hard refresh before
            // any user gesture — this is an enforced browser-level policy).
            // ► Mute the DOM element so the browser allows playback.
            // ► Also update React state so the button accurately shows MUTED,
            //   meaning the user needs only ONE click to restore audio.
            video.muted = true;
            isMutedRef.current = true;
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
    // backgroundVideo is the only dep we want — isMutedRef is a ref (stable).
  }, [backgroundVideo]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Render ────────────────────────────────────────────────────────────────
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
          <button
            onClick={toggleMute}
            className="netflix-mute-btn"
            style={{ zIndex: 200, pointerEvents: 'auto' }}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
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