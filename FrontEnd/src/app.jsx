import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/landing.jsx';
import Header from './pages/header.jsx'; // Import the Header component
import '../src/styles/header.css';
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
      <Header /> {/* Header is placed outside of Routes so it will display on every page */}
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* Uncomment and add more routes as needed */}
        {/* <Route path="/about" element={<About />} />
        <Route path="/academic-profile" element={<AcademicProfile />} />
        <Route path="/admin-redirect" element={<AdminRedirect />} />
        <Route path="/industry-profile" element={<IndustryProfile />} />
        <Route path="/industry-redirect" element={<IndustryRedirect />} />
        <Route path="/matchmaker" element={<MatchMaker />} />
        <Route path="/project-creation" element={<ProjectCreation />} />
        <Route path="/project-detail" element={<ProjectDetail />} />
        <Route path="/project-search" element={<ProjectSearch />} />
        <Route path="/saved-project" element={<SavedProject />} /> */}
      </Routes>
    </Router>
  );
}

export default App;