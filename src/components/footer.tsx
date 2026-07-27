import React from "react";
import "./footer.css";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="nf-footer">
      <div className="nf-footer-inner">

        {/* Social */}
        <div className="nf-social">
          <a href="https://www.linkedin.com/in/amiteshmogha/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
          <a href="https://github.com/CodeWithMogha" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
        </div>

        {/* Links */}
        <div className="nf-links">
          <ul>
            <li>Audio Description</li>
            <li>Investor Relations</li>
            <li>Legal Notices</li>
          </ul>

          <ul>
            <li>Help Center</li>
            <li>Jobs</li>
            <li>Cookie Preferences</li>
          </ul>

          <ul>
            <li>Gift Cards</li>
            <li>Terms of Use</li>
            <li>Corporate Information</li>
          </ul>

          <ul>
            <li>Media Center</li>
            <li>Privacy</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* Service Code */}
        <button className="nf-service">Service Code</button>

        {/* Copyright */}
        <p className="nf-copy">
          © 2026 Amitesh Productions. Portfolio Cinematic Experience.
        </p>

      </div>
    </footer>
  );
};

export default Footer;