import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import React from 'react';
import Landing from '../components/landing.jsx'
import Header from '../components/header.jsx'
import Footer from '../components/footer.jsx'
import About from '../components/about.jsx';


createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Header />
      <About />
      <Footer />
    </BrowserRouter>,
  )