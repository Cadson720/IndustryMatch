import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../components/userDisplay.jsx'
import '../styles/userDisplay.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import AddUserForm from '../components/AddUserForm.jsx';
//import App from './App';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <AddUserForm/>
  </StrictMode>,
)


