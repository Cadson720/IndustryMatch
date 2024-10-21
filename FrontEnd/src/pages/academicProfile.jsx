import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../components/savedProject.jsx'
import '../styles/savedProject.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import AddUserForm from '../components/AddUserForm.jsx';
import EditUserForm from '../components/EditUserForm.jsx';
import Header from '../components/header.jsx';
import Academic_Profile from '../components/academicProfile.jsx';
//import App from './App';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />
    <Academic_Profile />
    <App />
  </StrictMode>,
)