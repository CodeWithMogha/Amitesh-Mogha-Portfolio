import React, { useEffect, useState } from 'react';
import './Skills.css';
import { getSkills } from '../queries/getSkills';

import { FaReact } from 'react-icons/fa';
import { Skill } from '../types';

const Skills: React.FC = () => {

  const [skillsData, setSkillsData] = useState<Skill[]>([]);

  useEffect(() => {
    async function fetchSkills() {
      const data = await getSkills();
      setSkillsData(data);
    }

    fetchSkills()
  }, []);

  if (skillsData.length === 0) return <div>Loading...</div>;

  const skillsByCategory = skillsData.reduce((acc: any, skill: any) => {
    const categoryName = skill.category || 'Other Skills';
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(skill);
    return acc;
  }, {});


  return (
    <div className="skills-container">
      {Object.keys(skillsByCategory).map((category, index) => (
        <div key={index} className="skill-category">
          <h3 className="category-title">{category}</h3>
          <div className="skills-grid">
            {skillsByCategory[category].map((skill: any, idx: number) => (
              <div key={idx} className="skill-card">
                <div className="icon">
                  {skill.image?.url ? (
                    <img src={skill.image.url} alt={skill.title} className="skill-grid-logo" />
                  ) : (
                    <FaReact />
                  )}
                </div>
                <h3 className="skill-name">
                  {skill.title.split('').map((letter: string, i: number) => (
                    <span
                      key={i}
                      className="letter"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      {letter}
                    </span>
                  ))}
                </h3>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skills;
