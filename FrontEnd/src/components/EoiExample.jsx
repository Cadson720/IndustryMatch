import React, { useState } from 'react';

const EOIDisplay = () => {
  const [eois, setEois] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [academicId, setAcademicId] = useState('');
  const [industryId, setIndustryId] = useState('');
  const [error, setError] = useState(null);

  // Fetch all EOIs
const fetchAllEOIs = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/eoi');
      console.log('Response Status:', response.status); // Log status
  
      if (!response.ok) {
        throw new Error('Error fetching all EOIs');
      }
  
      const data = await response.json();
      console.log('Data received:', data); // Log the data received
  
      setEois(data); // Update state with fetched EOIs
      setError(null); // Clear any errors
    } catch (err) {
      console.error('Fetch Error:', err);
      setError('Error fetching all EOIs');
    }
  };

  // Fetch EOIs by project ID
  const fetchEOIsByProject = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/eoi/project/${projectId}`);
      if (!response.ok) {
        throw new Error(`Error fetching EOIs for project ID: ${projectId}`);
      }
      const data = await response.json();
      setEois(data);
      setError(null);
    } catch (err) {
      setError(`Error fetching EOIs for project ID: ${projectId}`);
    }
  };

  // Fetch EOIs by academic ID
  const fetchEOIsByAcademic = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/eoi/academic/${academicId}`);
      if (!response.ok) {
        throw new Error(`Error fetching EOIs for academic ID: ${academicId}`);
      }
      const data = await response.json();
      setEois(data);
      setError(null);
    } catch (err) {
      setError(`Error fetching EOIs for academic ID: ${academicId}`);
    }
  };

  // Fetch EOIs by industry ID
  const fetchEOIsByIndustry = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/eoi/industry/${industryId}`);
      if (!response.ok) {
        throw new Error(`Error fetching EOIs for industry ID: ${industryId}`);
      }
      const data = await response.json();
      setEois(data);
      setError(null);
    } catch (err) {
      setError(`Error fetching EOIs for industry ID: ${industryId}`);
    }
  };

  return (
    <div>
      <h1>EOI Fetcher</h1>

      {/* Fetch All EOIs */}
      <button onClick={fetchAllEOIs}>Fetch All EOIs</button>

      {/* Fetch EOIs by Project ID */}
      <div>
        <h3>Fetch EOIs by Project ID</h3>
        <input
          type="text"
          placeholder="Enter Project ID"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        />
        <button onClick={fetchEOIsByProject}>Fetch EOIs by Project</button>
      </div>

      {/* Fetch EOIs by Academic ID */}
      <div>
        <h3>Fetch EOIs by Academic ID</h3>
        <input
          type="text"
          placeholder="Enter Academic ID"
          value={academicId}
          onChange={(e) => setAcademicId(e.target.value)}
        />
        <button onClick={fetchEOIsByAcademic}>Fetch EOIs by Academic</button>
      </div>

      {/* Fetch EOIs by Industry ID */}
      <div>
        <h3>Fetch EOIs by Industry ID</h3>
        <input
          type="text"
          placeholder="Enter Industry ID"
          value={industryId}
          onChange={(e) => setIndustryId(e.target.value)}
        />
        <button onClick={fetchEOIsByIndustry}>Fetch EOIs by Industry</button>
      </div>

      {/* Display Error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display Results */}
      <div>
        <h3>EOIs Results</h3>
        {eois.length > 0 ? (
          <ul>
            {eois.map((eoi) => (
              <li key={eoi.eoi_id}>
                <strong>ID:</strong> {eoi.eoi_id} | <strong>Class Size:</strong>{' '}
                {eoi.class_size} | <strong>Status:</strong> {eoi.eoi_status}
              </li>
            ))}
          </ul>
        ) : (
          <p>No EOIs found</p>
        )}
      </div>
    </div>
  );
};

export default EOIDisplay;
