import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopPicksRow.css';
import { getSkills } from '../queries/getSkills';
import { getCertifications } from '../queries/getCertifications';
import WorkExperience from '../pages/WorkExperience';
import Projects from '../pages/Projects';
import { FaUniversity, FaExternalLinkAlt } from 'react-icons/fa';
import ContactSection from '../components/ContactSection';
import GithubSection from '../components/GithubSection';
import Learning from '../pages/Learning';
import MentorshipSection from '../components/MentorshipSection';
import Recommendations from '../pages/Recommendations';
import TechUsed from '../pages/TechUsed';

// ── Music album images ──────────────────────────────────────────────
import album21Pilots from '../images/music/21 Pilots Album Cover.jpg';
import acdcAlbum from '../images/music/ACDC Album Cover.jpg';
import acdcBackInBlack from '../images/music/ACDC Back in Black Cover.png';
import acdcHighVoltage from '../images/music/ACDC High Voltage Album Cover.jpg';
import afterHours from '../images/music/After Hours.png';
import areYouMine from '../images/music/Are You Mine.png';
import beautyBehindMadness from '../images/music/Beauty Behing the madnes.jpg';
import blurryface from '../images/music/Blurryface Album Cover 21 Pilots.png';
import darkSideOfMoon from '../images/music/Dark Side of the Moon.png';
import drake1 from '../images/music/drake1.jpg';
import drake2 from '../images/music/drake2.jpeg';
import joji1 from '../images/music/Joji Album Cover (1).jpeg';
import joji2 from '../images/music/Joji Album Cover.jpeg';
import starboy from '../images/music/Starboy.png';
import weekndTrilogy from '../images/music/The Weeknd Trilogy .png';

// ── Book cover images ────────────────────────────────────────────────
import atomicHabits from '../images/atomic_habits.jpg';
import richDadPoorDad from '../images/rich_dad_poor_dad.jpg';
import alchemist from '../images/alchemist.jpg';
import eatThatFrog from '../images/eat_that_frog.jpg';
import neverFinished from '../images/d1.jpg';
import cantHurtMe from '../images/d2.jpg';
import psychOfMoney from '../images/p1.jpeg';
import lawsHumanNature from '../images/L.jpg';




/* ================= PROFILE TYPE ================= */

type ProfileType = 'recruiter' | 'developer' | 'stalker' | 'adventurer';

interface TopPicksRowProps {
  profile: ProfileType;
}

/* ================= TYPES ================= */

interface Skill {
  title: string;
  image?: { url: string } | null;
}

interface Certification {
  title: string;
  issuer: string;
  year: string;
  credentialUrl: string;
  logo?: { url: string } | null;
}

/* ================= STATIC DATA ================= */

const albums = [
  { title: 'Blurryface', artist: 'Twenty One Pilots', imgSrc: blurryface },
  { title: '21 Pilots', artist: 'Twenty One Pilots', imgSrc: album21Pilots },
  { title: 'ACDC', artist: 'AC/DC', imgSrc: acdcAlbum },
  { title: 'Back in Black', artist: 'AC/DC', imgSrc: acdcBackInBlack },
  { title: 'High Voltage', artist: 'AC/DC', imgSrc: acdcHighVoltage },
  { title: 'After Hours', artist: 'The Weeknd', imgSrc: afterHours },
  { title: 'Are You Mine', artist: 'Arctic Monkeys', imgSrc: areYouMine },
  { title: 'Beauty Behind the Madness', artist: 'The Weeknd', imgSrc: beautyBehindMadness },
  { title: 'Dark Side of the Moon', artist: 'Pink Floyd', imgSrc: darkSideOfMoon },
  { title: 'Drake Collection 1', artist: 'Drake', imgSrc: drake1 },
  { title: 'Drake Collection 2', artist: 'Drake', imgSrc: drake2 },
  { title: 'Joji Album 1', artist: 'Joji', imgSrc: joji1 },
  { title: 'Joji Album 2', artist: 'Joji', imgSrc: joji2 },
  { title: 'Starboy', artist: 'The Weeknd', imgSrc: starboy },
  { title: 'The Weeknd Trilogy', artist: 'The Weeknd', imgSrc: weekndTrilogy },
];

const books = [
  { title: 'Atomic Habits', author: 'James Clear', imgSrc: atomicHabits, description: 'A practical guide to building good habits.' },
  { title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', imgSrc: richDadPoorDad, description: 'An eye-opener on wealth and financial literacy.' },
  { title: 'The Alchemist', author: 'Paulo Coelho', imgSrc: alchemist, description: "A magical journey of following one's dreams." },
  { title: 'Eat That Frog', author: 'Brian Tracy', imgSrc: eatThatFrog, description: 'A motivational book on overcoming procrastination.' },
  { title: 'Never Finished', author: 'David Goggins', imgSrc: neverFinished, description: 'Unshackle Your Mind and Win the War Within.' },

  { title: "Can't Hurt Me", author: 'David Goggins', imgSrc: cantHurtMe, description: 'Master Your Mind and Defy the Odds.' },
  { title: 'The Psychology of Money', author: 'Morgan Housel', imgSrc: psychOfMoney, description: 'Timeless lessons on wealth, greed, and happiness.' },
  { title: 'The Laws of Human Nature', author: 'Robert Greene', imgSrc: lawsHumanNature, description: "Understand people's drives and motivations." },
];

/* ================= COMPONENT ================= */

const TopPicksRow: React.FC<TopPicksRowProps> = ({ profile }) => {
  const navigate = useNavigate();

  const certRef = useRef<HTMLDivElement>(null);
  const skillRef = useRef<HTMLDivElement>(null);
  const musicRef = useRef<HTMLDivElement>(null);
  const readRef = useRef<HTMLDivElement>(null);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [certs, setCerts] = useState<Certification[]>([]);
  const [isSkillsExpanded, setIsSkillsExpanded] = useState(false);
  const [isCertsExpanded, setIsCertsExpanded] = useState(false);
  const [isMusicExpanded, setIsMusicExpanded] = useState(false);
  const [isBooksExpanded, setIsBooksExpanded] = useState(false);

  useEffect(() => {
    getSkills().then(setSkills).catch(console.error);
    getCertifications().then(setCerts).catch(console.error);
  }, []);

  const scroll = (ref: React.RefObject<HTMLDivElement>, dir: 'left' | 'right') => {
    ref.current?.scrollBy({ left: dir === 'left' ? -600 : 600, behavior: 'smooth' });
  };

  return (
    <>

      {/* ================= HOW I BUILT THIS (ADVENTURER ONLY - TOP) ================= */}
      {profile === 'adventurer' && <TechUsed />}


      {/* ================= SKILLS (RECRUITER, DEVELOPER ONLY - NOT ADVENTURER) ================= */}
      {(profile === 'recruiter' || profile === 'developer') && (
        <section className="top10-section">
          <div className="section-header-flex">
            <h2 className="row-title">Skills</h2>
            <button
              className="expand-section-btn"
              onClick={() => setIsSkillsExpanded(!isSkillsExpanded)}
            >
              {isSkillsExpanded ? 'Collapse ⌃' : 'View All ⌄'}
            </button>
          </div>

          {!isSkillsExpanded && (
            <>
              <button className="row-arrow left" onClick={() => scroll(skillRef, 'left')}>❮</button>
              <button className="row-arrow right" onClick={() => scroll(skillRef, 'right')}>❯</button>
            </>
          )}

          <div className={`top10-row ${isSkillsExpanded ? 'expanded-grid' : ''}`} ref={skillRef}>
            {skills.map((skill, i) => (
              <div key={i} className="top10-item">
                <div className="rank-number">{i + 1}</div>
                <div className="top10-card" onClick={() => navigate('/skills')}>
                  {skill.image?.url ? (
                    <img src={skill.image.url} className="skill-logo" alt={skill.title} />
                  ) : (
                    <div className="skill-fallback-logo">{skill.title[0]}</div>
                  )}
                  <span className="skill-title">{skill.title}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= CERTIFICATIONS (RECRUITER ONLY - NOT ADVENTURER) ================= */}
      {profile === 'recruiter' && (
        <section className="home-cert-section">
          <div className="section-header-flex">
            <h2 className="row-title">Certifications</h2>
            <button
              className="expand-section-btn"
              onClick={() => setIsCertsExpanded(!isCertsExpanded)}
            >
              {isCertsExpanded ? 'Collapse ⌃' : 'View All ⌄'}
            </button>
          </div>

          {!isCertsExpanded && (
            <>
              <button className="row-arrow left" onClick={() => scroll(certRef, 'left')}>❮</button>
              <button className="row-arrow right" onClick={() => scroll(certRef, 'right')}>❯</button>
            </>
          )}

          <div className={`home-cert-row ${isCertsExpanded ? 'expanded-grid' : ''}`} ref={certRef}>
            {certs.map((cert, i) => (
              <a key={i} href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="home-cert-card">
                <div className="cert-icon">
                  {cert.logo?.url ? <img src={cert.logo.url} alt={cert.title} /> : <FaUniversity />}
                </div>
                <h3>{cert.title}</h3>
                <p className="cert-issuer">{cert.issuer}</p>
                <span className="cert-year">Issued: {cert.year}</span>
                <div className="cert-link-icon">
                  <FaExternalLinkAlt />
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ================= PROJECTS ================= */}
      {(profile === 'developer' || profile === 'recruiter') && (
        <>
          <Projects />
          
          {/* ================= GITHUB ACTIVITY (DEVELOPER ONLY) ================= */}
          {profile === 'developer' && <GithubSection username="CodeWithMogha" />}
        </>
      )}

      {/* ================= EXPERIENCE ================= */}
      {/* Removed from recruiter profile per user request */}

      {/* ================= MUSIC (STALKER ONLY) ================= */}
      {profile === 'stalker' && (
        <section className="home-cert-section">
          <div className="section-header-flex">
            <h2 className="row-title">Music I Love</h2>
            <button
              className="expand-section-btn"
              onClick={() => setIsMusicExpanded(!isMusicExpanded)}
            >
              {isMusicExpanded ? 'Collapse ⌃' : 'View All ⌄'}
            </button>
          </div>

          {!isMusicExpanded && (
            <>
              <button className="row-arrow left" onClick={() => scroll(musicRef, 'left')}>❮</button>
              <button className="row-arrow right" onClick={() => scroll(musicRef, 'right')}>❯</button>
            </>
          )}

          <div className={`home-cert-row ${isMusicExpanded ? 'expanded-grid' : ''}`} ref={musicRef}>
            {albums.map((album, i) => (
              <div key={i} className="album-row-card">
                <img src={album.imgSrc} alt={album.title} className="album-row-art" />
                <div className="album-row-info">
                  <h4>{album.title}</h4>
                  <p>{album.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= READING (STALKER ONLY) ================= */}
      {profile === 'stalker' && (
        <section className="home-cert-section">
          <div className="section-header-flex">
            <h2 className="row-title">Books I've Read</h2>
            <button
              className="expand-section-btn"
              onClick={() => setIsBooksExpanded(!isBooksExpanded)}
            >
              {isBooksExpanded ? 'Collapse ⌃' : 'View All ⌄'}
            </button>
          </div>

          {!isBooksExpanded && (
            <>
              <button className="row-arrow left" onClick={() => scroll(readRef, 'left')}>❮</button>
              <button className="row-arrow right" onClick={() => scroll(readRef, 'right')}>❯</button>
            </>
          )}

          <div className={`home-cert-row ${isBooksExpanded ? 'expanded-grid' : ''}`} ref={readRef}>
            {books.map((book, i) => (
              <div key={i} className="stalker-media-card">
                <img src={book.imgSrc} alt={book.title} className="stalker-media-thumb stalker-book-thumb" />
                <div className="stalker-media-body">
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                  <span>{book.description}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}


      {/* ================= CURRENTLY LEARNING (DEVELOPER ONLY) ================= */}
      {profile === 'developer' && <Learning />}
      {/* ================= RECOMMENDATIONS (RECRUITER ONLY) ================= */}
      {profile === 'recruiter' && <Recommendations />}

      {/* ================= EXPERIENCE (STALKER, RECRUITER, DEVELOPER - NOT ADVENTURER) ================= */}
      {(profile === 'stalker' || profile === 'recruiter' || profile === 'developer') && (
        <WorkExperience isHorizontal={true} />
      )}

      {/* ================= MENTORSHIP (ADVENTURER ONLY) ================= */}
      {profile === 'adventurer' && <MentorshipSection />}

      {/* ================= CONTACT (ALL PROFILES) ================= */}
      <ContactSection />
    </>
  );
};

export default TopPicksRow;