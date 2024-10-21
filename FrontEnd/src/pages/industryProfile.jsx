import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../components/savedProject.jsx'
import '../styles/savedProject.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from '../components/header.jsx';
import Industry_Profile from '../components/industryProfile.jsx';
//import App from './App';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />
    <Industry_Profile />
  </StrictMode>,
)