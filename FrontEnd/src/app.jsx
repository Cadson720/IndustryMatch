import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/landing.jsx';
//import Header from './pages/header.jsx'; // Import the Header component
import About from './pages/about.jsx';
import ProjectSearch from './pages/projectSearch.jsx';
import AcademicProfile from './pages/academicProfile.jsx';
import ProjectDetail from './pages/projectDetail.jsx';
import CreateProject from './pages/projectCreation.jsx'; 
import IndustryProfile from './pages/industryProfile.jsx';
import Industry from './pages/industry.jsx';
import MatchMaker from './pages/matchMaker.jsx';
import ManageProject from './pages/manageProject.jsx';
import SavedProject from './pages/savedProject.jsx';
import EditProject from './pages/editProject.jsx';
import ManageEOI from './pages/manageEOI.jsx';

// import EOIs from './pages/EOIs';
// import EditProject from './pages/EditProject';

// import '../src/styles/about.css';
import '../src/styles/header.css';
import '../src/styles/landing.css';
import Layout from './pages/layout.jsx';
// import '../src/styles/projectSearch.css';
// import '../src/styles/industryProfile.css';

// import About from './pages/about.jsx';
// import AcademicProfile from './pages/academicProfile.jsx';
// import AdminRedirect from './pages/adminRedirect.jsx';
// import IndustryProfile from './pages/industryProfile.jsx';
// import IndustryRedirect from './pages/industryRedirect.jsx';
// import MatchMaker from './pages/matchMaker.jsx';
// import ProjectCreation from './pages/projectCreation.jsx';
// import ProjectDetail from './pages/projectDetail.jsx';
// import ProjectSearch from './pages/projectSearch.jsx';
// import SavedProject from './pages/savedProject.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Landing /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/academicProfile" element={<Layout><AcademicProfile /></Layout>} />
        <Route path="/projectDetail" element={<Layout><ProjectDetail /></Layout>} />
        <Route path="/industryProfile" element={<Layout><IndustryProfile /></Layout>} />
        <Route path="/projectCreation" element={<Layout><CreateProject /></Layout>} />
        <Route path="/matchMaker" element={<Layout><MatchMaker /></Layout>} />
        
        {/* <Route path="/project/:projectId/eois" element={<EOIs />} />
        <Route path="/edit-project/:projectId" element={<EditProject />} /> */}


        {/* ProjectSearch loads without Layout */}
        <Route path="/industry" element={<Industry />} />
        <Route path="/manageEOI/:projectId" element={<ManageEOI />} />
        <Route path="/editProject/:id" element={<EditProject />} />
        <Route path="/projectSearch" element={<ProjectSearch />} />
        <Route path="/savedProject" element={<SavedProject />} />
        <Route path="/manageProject" element={<ManageProject />} />

        {/* Uncomment and add more routes as needed */}
        {/*
        <Route path="/admin-redirect" element={<AdminRedirect />} />
        <Route path="/matchmaker" element={<MatchMaker />} />
        */}
      </Routes>
    </Router>
  );
}

export default App;