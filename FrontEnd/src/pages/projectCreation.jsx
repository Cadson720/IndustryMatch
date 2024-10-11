// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import ProjectSearch from '../components/projectSearch.jsx'
// import '../styles/projectSearch.css'
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import Header from '../components/header.jsx';
// import CreateProject from '../components/projectCreation.jsx';
// import Landing from '../components/landing.jsx';
// //import App from './App';
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <Header />
//     <Landing />
//     <CreateProject />
//   </StrictMode>,
// )

import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import React from 'react';
import Landing from '../components/landing.jsx';
import Header from '../components/header.jsx';
import CreateProject from '../components/projectCreation.jsx';
import { UserProvider } from '../context/userContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />
    <CreateProject />
  </StrictMode>
);
