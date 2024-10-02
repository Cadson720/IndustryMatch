import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../components/projectSearch.jsx'
import React from 'react';
import ReactDOM from 'react-dom/client';
import AddUserForm from '../components/AddUserForm.jsx';
import EditUserForm from '../components/EditUserForm.jsx';
import Header from '../components/header.jsx';
import Appp from '../components/userDisplay.jsx'
import ProjectDisplay from '../components/projectDisplay.jsx';
import CreateProject from '../components/projectCreation.jsx';
import DeleteProjectList from '../components/projectDeletion.jsx';
import EditProject from '../components/projectEdit.jsx';
//<Appp/>
//<App />
//<AddUserForm/>
//<EditUserForm/>
//<CreateProject/>
//<ProjectDisplay/>
//import App from './App';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EditProject/>
    <DeleteProjectList/>
  </StrictMode>,
)