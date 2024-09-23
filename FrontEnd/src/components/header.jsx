import React from 'react';
import "../styles/header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="inner_header">
        <img src="/efi_logo_simple.png" href="main.jsx" alt="Logo" className="logo" />
        <nav className="nav">
          <a href="/src/html-pages/projectSearch.html" className="nav-link">Project Search</a>
          <a href="/src/html-pages/savedProject.html" className="nav-link">Saved Projects</a>
          </nav>
      </div>
    </header>
  );
};

export default Header;