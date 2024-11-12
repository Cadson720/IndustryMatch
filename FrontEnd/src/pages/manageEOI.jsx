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
    if (!projectId || isNaN(parseInt(projectId, 10))) {
      setError('Invalid Project ID.');
      setLoading(false);
      return;
    }

    const fetchEOIs = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/eoi/project/${projectId}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch EOIs. Status: ${response.status}`);
        }

        const data = await response.json();
        setTimeout(() => {
          setEois(data);
          setLoading(false);
        }, 250);
      } catch (error) {
        setError('Failed to load EOIs. Please try again later.');
        setLoading(false);
      }
    };

    fetchEOIs();
  }, [projectId]);

  const handleStatusChange = async (eoiId, newStatus) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/eoi/${eoiId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eoi_status: newStatus }), // Correct status update
      });
  
      if (!response.ok) throw new Error(`Failed to update EOI status. Status: ${response.status}`);
  
      // Update the local state
      setEois((prevEois) =>
        prevEois.map((eoi) => (eoi.eoi_id === eoiId ? { ...eoi, eoi_status: newStatus } : eoi))
      );
    } catch (error) {
      console.error('Error updating EOI status:', error);
      setError('Failed to update EOI status. Please try again.');
    }
  };
  
  
  
  const handleBackClick = () => {
    navigate('/manageProject', { state: { searchQuery: searchParams } });
  };

  const statusColor = (status) => {
    switch (status) {
      case 'Approved':
        return '#4caf50';
      case 'Rejected':
        return '#f44336';
      case 'Pending':
      default:
        return '#ff9800';
    }
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
                <div
                  className="status-color-band"
                  style={{ backgroundColor: statusColor(eoi.eoi_status) }}
                ></div>
                <div
                  className="proposal-description"
                  dangerouslySetInnerHTML={{
                    __html: eoi.proposal_description.replace(/\n/g, '<br />')
                  }}
                />
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
