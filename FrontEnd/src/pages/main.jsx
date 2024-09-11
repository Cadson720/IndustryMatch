import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../components/App.jsx'
import '../styles/index.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import '../components/AddUserForm.jsx'
import '../components/EditUserForm.jsx'
import AddUserForm from '../components/AddUserForm.jsx';
import EditUserForm from '../components/EditUserForm.jsx';
//import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <AddUserForm/>
    <EditUserForm/>
  </StrictMode>,
)


