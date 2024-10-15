import React from 'react';
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="inner_footer">
        <div className="left-column">
          <p>
            Reach out via <i>example.email@engineeringfuturesinitiative.org</i>
          </p>
        </div>
        <div className="middle-column">
          <p>Sponsored by:</p>
        </div>
        <div className="right-column">
          <img src="/ACED_Logo.png" alt="Logo" className="ACED_logo" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
