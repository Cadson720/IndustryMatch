import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../components/projectSearch.jsx'
import '../styles/projectSearch.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import AddUserForm from '../components/AddUserForm.jsx';
import EditUserForm from '../components/EditUserForm.jsx';
import Header from '../components/header.jsx';
//import App from './App';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />
    <h1>Project Search</h1>
    <App />
  </StrictMode>,
)