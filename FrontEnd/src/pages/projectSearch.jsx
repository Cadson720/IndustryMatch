import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ProjectSearch from '../components/projectSearch.jsx'
import '../styles/projectSearch.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from '../components/header.jsx';
//import App from './App';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProjectSearch />
  </StrictMode>,
)