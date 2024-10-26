import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Project_Detail from '../components/projectDetail.jsx'
import '../styles/projectDetail.css'
import React from 'react';
import Header from '../components/header.jsx';
//import App from './App';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />
    <Project_Detail />
  </StrictMode>,
)