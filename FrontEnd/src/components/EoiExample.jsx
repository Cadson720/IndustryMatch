import React, { useState } from 'react';

const EOIDisplay = () => {
  const [eois, setEois] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [academicId, setAcademicId] = useState('');
  const [industryId, setIndustryId] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    industry_id: '',
    academic_id: '',
    project_id: '',
    eoi_date: '',
    class_size: '',
    eoi_status: ''
  });

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

  // Handle form input change for EOI creation
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form to create a new EOI
  const handleCreateEOI = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/eoi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error creating EOI');
      }

      const data = await response.json();
      setSuccess(`EOI created successfully with ID: ${data.eoi_id}`);
      setError(null);
      setEois([...eois, data]); // Append the new EOI to the existing list
    } catch (err) {
      setError('Error creating EOI');
      setSuccess(null);
    }
  };

  return (
    <div>
      <h1>EOI Fetcher and Creator</h1>

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

      {/* Form to Create a New EOI */}
      <div>
        <h2>Create a New EOI</h2>
        <form onSubmit={handleCreateEOI}>
          <div>
            <label>Industry ID: </label>
            <input
              type="number"
              name="industry_id"
              value={formData.industry_id}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Academic ID: </label>
            <input
              type="number"
              name="academic_id"
              value={formData.academic_id}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Project ID: </label>
            <input
              type="number"
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>EOI Date: </label>
            <input
              type="date"
              name="eoi_date"
              value={formData.eoi_date}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Class Size: </label>
            <input
              type="text"
              name="class_size"
              value={formData.class_size}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>EOI Status: </label>
            <input
              type="text"
              name="eoi_status"
              value={formData.eoi_status}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Create EOI</button>
        </form>
      </div>

      {/* Display Success/Error Messages */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

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
