import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for navigation
import "../styles/header.css"

const Header = () => {
  return (
    <header className="header">
      <img src="/efi_logo.png" alt="Logo" className="logo" />
      <nav className="nav">
        <p>Project Search</p>
      </nav>
    </header>
  );
};

export default Header;
