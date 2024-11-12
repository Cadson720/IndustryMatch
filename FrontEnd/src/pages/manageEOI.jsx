import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Loader from '../pages/loader.jsx';
import Header from '../pages/header.jsx';
import "../styles/manageEOI.css";

const ManageEOI = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [eois, setEois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get search parameters from the state (if any)
  const searchParams = location.state?.searchQuery || '';

  useEffect(() => {
    console.log('Received Project ID from useParams:', projectId);

    // Validate projectId
    if (!projectId || isNaN(parseInt(projectId, 10))) {
      setError('Invalid Project ID.');
      setLoading(false);
      return;
    }

    const fetchEOIs = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/eoi/project/${projectId}`;
        console.log('API URL:', apiUrl);

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch EOIs. Status: ${response.status}`);
        }

        const data = await response.json();
        // Add a 250ms delay for a smoother loading experience
        setTimeout(() => {
          setEois(data);
          setLoading(false);
        }, 250);
      } catch (error) {
        console.error('Error fetching EOIs:', error);
        setError('Failed to load EOIs. Please try again later.');
        setLoading(false);
      }
    };

    fetchEOIs();
  }, [projectId]);

  // Function to handle status change
  const handleStatusChange = async (eoiId, newStatus) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('User not authenticated. Please log in.');
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/eoi/${eoiId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ eoi_status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update EOI status. Status: ${response.status}`);
      }

      // Update status locally
      setEois((prevEois) =>
        prevEois.map((eoi) =>
          eoi.eoi_id === eoiId ? { ...eoi, eoi_status: newStatus } : eoi
        )
      );
    } catch (error) {
      console.error('Error updating EOI status:', error);
      setError('Failed to update EOI status. Please try again.');
    }
  };

  // Navigate back to the Manage Projects page, keeping search parameters
  const handleBackClick = () => {
    navigate('/manageProject', { state: { searchQuery: searchParams } });
  };

  if (loading) return <Loader />;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="manage-eoi-page">
      <Header />
      <div className="manage-eoi-container">
        <h2>Manage Expressions of Interest</h2>
        {eois.length === 0 ? (
          <p>No EOIs found for this project.</p>
        ) : (
          <div className="eoi-list">
            {eois.map((eoi) => (
              <div key={eoi.eoi_id} className="eoi-card">
                <p><strong>Proposal:</strong> {eoi.proposal_description}</p>
                <p><strong>Date Submitted:</strong> {new Date(eoi.eoi_date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {eoi.eoi_status}</p>
                <p>
                  <strong>Academic Email:</strong>{' '}
                  {eoi.Academic ? (
                    <a
                      href={`mailto:${eoi.Academic.academic_email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="email-link"
                    >
                      {eoi.Academic.academic_email}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </p>
                <div className="eoi-actions">
                    <button
                        onClick={() => handleStatusChange(eoi.eoi_id, 'Approved')}
                        className="approve-button"
                    >
                        Approve
                    </button>
                    <button
                        onClick={() => handleStatusChange(eoi.eoi_id, 'Rejected')}
                        className="reject-button"
                    >
                        Reject
                    </button>
                    <button className="back-button" onClick={handleBackClick}>
                        Back
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEOI;
