import { StrictMode } from 'react'
// import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
// import ProjectSearch from '../components/projectSearch.jsx'
import '../styles/projectCreation.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from '../components/header.jsx';
import CreateProject from '../components/projectCreation.jsx';
import Footer from '../components/footer.jsx';
// import { UserProvider } from '../context/userContext';
// //import App from './App';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />
    <CreateProject />
  </StrictMode>
);
