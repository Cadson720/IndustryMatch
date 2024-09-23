import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header.jsx';
import ProjectSearch from './html pages/projectSearch.html';
import SavedProjects from './html pages/savedProjects.html';
import MatchMaker from './html pages/matchMaker.html';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<UserDisplay />} />
        <Route path="/project-search" element={<ProjectSearch />} />
        <Route path="/saved-projects" element={<SavedProjects />} />
        <Route path="/matchmaker" element={<MatchMaker />} />
      </Routes>
    </Router>
  );
};

export default App;