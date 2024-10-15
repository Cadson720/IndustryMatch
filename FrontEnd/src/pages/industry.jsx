import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react';
import Header from '../components/header.jsx'
import Industry from '../components/industry.jsx'


createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Header />
      <Industry/>
    </StrictMode>,
  )