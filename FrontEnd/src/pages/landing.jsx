import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import React from 'react';
// import Landing from '../components/landing.jsx'
import Landing from '../components/landing.jsx'
import Header from '../components/header.jsx'


createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Header />
      <Landing/>
    </BrowserRouter>,
  )