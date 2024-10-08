import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react';
// import Landing from '../components/landing.jsx'
import Industry from '../components/industry.jsx'


createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Industry/>
    </StrictMode>,
  )