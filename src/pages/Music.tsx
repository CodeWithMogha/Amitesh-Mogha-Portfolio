import React from 'react';
import './Music.css';

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


const favoriteAlbums = [
  { title: "Blurryface", artist: "Twenty One Pilots", imgSrc: blurryface },
  { title: "21 Pilots", artist: "Twenty One Pilots", imgSrc: album21Pilots },
  { title: "ACDC", artist: "AC/DC", imgSrc: acdcAlbum },
  { title: "Back in Black", artist: "AC/DC", imgSrc: acdcBackInBlack },
  { title: "High Voltage", artist: "AC/DC", imgSrc: acdcHighVoltage },
  { title: "After Hours", artist: "The Weeknd", imgSrc: afterHours },
  { title: "Are You Mine", artist: "Arctic Monkeys", imgSrc: areYouMine },
  { title: "Beauty Behind the Madness", artist: "The Weeknd", imgSrc: beautyBehindMadness },
  { title: "Dark Side of the Moon", artist: "Pink Floyd", imgSrc: darkSideOfMoon },
  { title: "Drake Collection 1", artist: "Drake", imgSrc: drake1 },
  { title: "Drake Collection 2", artist: "Drake", imgSrc: drake2 },
  { title: "Joji Album 1", artist: "Joji", imgSrc: joji1 },
  { title: "Joji Album 2", artist: "Joji", imgSrc: joji2 },
  { title: "Starboy", artist: "The Weeknd", imgSrc: starboy },
  { title: "The Weeknd Trilogy", artist: "The Weeknd", imgSrc: weekndTrilogy },
];

const Music: React.FC = () => {
  return (
    <div className="music-page">
      <div className="albums-section">
        <h3>Favorite Albums</h3>
        <div className="albums">
          {favoriteAlbums.map((album, index) => (
            <div
              key={index}
              className="album-card"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <img
                src={album.imgSrc}
                alt={album.title}
                className="album-image"
              />
              <div className="album-details">
                <h4>{album.title}</h4>
                <p>by {album.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Music;