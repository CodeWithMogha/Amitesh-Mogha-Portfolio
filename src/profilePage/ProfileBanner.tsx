import React, { useEffect, useState } from 'react';
import './ProfileBanner.css';
import PlayButton from '../components/PlayButton';
import MoreInfoButton from '../components/MoreInfoButton';
import { getProfileBanner } from '../queries/getProfileBanner';

type BannerData = {
  headline: string;
  profileSummary: string;
  resumeLink: string;
  linkedinLink: string;
};

const ProfileBanner: React.FC = () => {
  const [bannerData, setBannerData] = useState<BannerData | null>(null);

  useEffect(() => {
    getProfileBanner().then((data) => {
      if (data && !data.resumeLink) {
        console.error("Resume link is missing from Hygraph data");
      }
      setBannerData(data);
    });
  }, []);

  if (!bannerData) return null;

  return (
    <div className="profile-banner">
      <div className="banner-content">
        <h1 className="banner-headline">{bannerData.headline}</h1>

        <p className="banner-description">
          {bannerData.profileSummary}
        </p>

        <div className="banner-buttons">
          {bannerData.resumeLink && (
            <a
              href={bannerData.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <PlayButton
                label="Resume"
                onClick={() => {}}
              />
            </a>
          )}

          {bannerData.linkedinLink && (
            <a
              href={bannerData.linkedinLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <MoreInfoButton
                label="LinkedIn"
                onClick={() => {}}
              />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileBanner;