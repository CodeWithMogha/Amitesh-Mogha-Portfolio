import React, { useEffect, useState } from 'react';
import './Certifications.css';
import { FaExternalLinkAlt, FaUniversity } from 'react-icons/fa';
import { Certification } from '../types';
import { getCertifications } from '../queries/getCertifications';

const Certifications: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    async function fetchCertifications() {
      const data = await getCertifications();
      setCertifications(data);
    }
    fetchCertifications();
  }, []);

  if (certifications.length === 0) {
    return <div style={{ color: '#fff', textAlign: 'center' }}>Loading certifications…</div>;
  }

  // 🔹 GROUP BY CATEGORY
  const grouped = certifications.reduce<Record<string, Certification[]>>(
    (acc, cert) => {
      acc[cert.category] = acc[cert.category] || [];
      acc[cert.category].push(cert);
      return acc;
    },
    {}
  );

  return (
    <div className="certifications-container">
      {Object.entries(grouped).map(([category, certs]) => (
        <section key={category} className="certification-category-section">
          <h2 className="certification-category-title">{category}</h2>

          <div className="certifications-grid">
            {certs
              .sort((a, b) => a.number - b.number)
              .map((cert, index) => (
                <a
                  key={index}
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="certification-card"
                >
                  <div className="certification-content">
                    <div className="certification-icon">
                      {cert.logo?.url ? (
                        <img
                          src={cert.logo.url}
                          alt={cert.title}
                          className="certification-logo"
                        />
                      ) : (
                        <FaUniversity />
                      )}
                    </div>

                    <h3>{cert.title}</h3>
                    <p className="cert-issuer">{cert.issuer}</p>
                    <span className="issued-date">Issued: {cert.year}</span>
                  </div>

                  <div className="certification-link">
                    <FaExternalLinkAlt />
                  </div>
                </a>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Certifications;