import React from 'react';
import "../styles/header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="inner_header">
        <img src="/efi_logo_simple.png" href="main.jsx" alt="Logo" className="logo" />
        <nav className="nav">
          <a href="../projectSearch.html" className="nav-link">Project Search</a>
          <a href="../savedProjects.html" className="nav-link">Saved Projects</a>
          <a href="../matchMaker.html" className="nav-link">MatchMaker</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;