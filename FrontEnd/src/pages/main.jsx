import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../components/App.jsx'
import '../styles/index.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
//import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


