import React, { useState, useEffect } from 'react';

function EditProjectList() {
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  };

  // Define industry and corresponding disciplines
  const industryOptions = {
    "Business": [
      "Economics", "Human Resources", "Management", "Accounting, Commerce & Finance",
      "Hospitality, Tourism & Retail", "Marketing, Advertising & Public Relations"
    ],
    "Design & Arts": [
      "Animation, Visual Effects & Post Production", "Creative Arts", "Media Studies", 
      "Fashion Design", "Film & TV", "Graphic Design & Visual Arts", "Journalism & Writing", 
      "Music & Performing Arts"
    ],
    "Engineering": [
      "Aerospace", "Software", "Automotive & Transport", "Biomedical", "Civil & Construction",
      "Mechanical", "Mechatronic", "Electrical", "Chemical", "Industrial", "Robotics",
      "Environmental", "Marine", "Manufacturing", "Mining"
    ],
    "IT & Computer Science": [
      "Artificial Intelligence", "Computer Graphics & Animations", "Computer Systems & Networks",
      "Cyber Security", "Data Science", "Design & User Experience", "Video Game Development"
    ],
    "Law": [
      "Criminal Justice", "Corporate Law", "Law Enforcement"
    ],
    "Health": [
      "Nursing", "Pharmacist", "Dentistry & Orthopediatrics", "Exercise & Sports Science", 
      "Midwifery", "Occupational", "Paramedics", "Physiotherapy", "Psychology"
    ],
    "Education": [
      "Primary Teaching", "Secondary Teaching", "Special Education", "Tertiary Education"
    ],
    "Science": [
      "Astronomy", "Biochemistry", "Biology", "Chemistry", "Geology", "Genetics",
      "Food Science", "Forensic Science", "Environmental Science", "Physics", 
      "Marine Science", "Veterinary Science"
    ],
    "Social Sciences & Communication": [
      "Criminology", "International Studies", "Languages & Linguistics", "Literature", 
      "Philosophy", "Social Work", "Politics"
    ],
    "Food & Hospitality": [
      "Culinary Arts", "Hotel Management", "Carers"
    ],
    "Trades & Services": [
      "Carpentry", "Electrician", "Plumbing", "Flooring, Plastering & Tiling", 
      "Heating, Ventilation & Cooling", "Bricklaying & Stonemasonry", "Surveying"
    ]
  };

  const [projects, setProjects] = useState([]);  // State to hold the list of projects
  const [selectedProject, setSelectedProject] = useState(null);  // State to hold the selected project
  const [formData, setFormData] = useState({
    title: '',
    publish_date: getTodayDate(),
    industry: '',
    discipline: '',
    duration: '',
    size: '',
    location_type: '',
    address: '',
    description: '',
    status: '',
    image_path: ''
  });
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);  // Loading state for fetching projects
  const [error, setError] = useState(null);      // Error state
  const [success, setSuccess] = useState(false); // Success state for form submission

  useEffect(() => {
    // Fetch all projects
    fetch('http://localhost:3000/api/project')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch project data');
        }
        return response.json();
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);   // Stop loading once data is fetched
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);   // Stop loading if there's an error
      });
  }, []);

  useEffect(() => {
    if (formData.industry) {
      setDisciplines(industryOptions[formData.industry] || []);
      setFormData((prevData) => ({
        ...prevData,
        discipline: '' // Reset discipline when industry changes
      }));
    }
  }, [formData.industry]);

  const handleSelectProject = (project) => {
    // When a project is selected, populate the form with its current details
    setSelectedProject(project);
    setFormData({
      title: project.title,
      publish_date: project.publish_date.split('T')[0],  // Extract only the date portion
      industry: project.industry,
      discipline: project.discipline,
      duration: project.duration,
      size: project.size,
      location_type: project.location_type,
      address: project.address,
      description: project.description,
      status: project.status,
      image_path: project.image_path
    });
    setSuccess(false); // Reset success state if a new project is selected
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    // Send updated project data to the backend
    fetch(`http://localhost:3000/api/project/${selectedProject.project_id}`, {  // Updated to use project_id
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update project');
        }
        return response.json();
      })
      .then((updatedProject) => {
        // Update the project list with the edited project data
        setProjects((prevProjects) =>
          prevProjects.map((proj) =>
            proj.project_id === updatedProject.project_id ? updatedProject : proj  // Updated to use project_id
          )
        );
        setSuccess(true); // Set success state
        setSelectedProject(null); // Reset the selected project

        // Clear the form data after update
        setFormData({
          title: '',
          publish_date: getTodayDate(),
          industry: '',
          discipline: '',
          duration: '',
          size: '',
          location_type: '',
          address: '',
          description: '',
          status: '',
          image_path: ''
        });
      })
      .catch((error) => {
        console.error('Error updating project:', error);
      });
  };

  // If loading, show a loading message
  if (loading) return <p>Loading projects...</p>;

  // If there's an error, display the error
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Edit Projects</h1>
      {success && <p>Project updated successfully!</p>}
      <div>
        <h2>Select a project to edit</h2>
        <ul>
          {projects.map((project) => (
            <li
              key={project.project_id}  // Updated to use project_id
              onClick={() => handleSelectProject(project)}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedProject?.project_id === project.project_id ? '#d0f0c0' : 'white',  // Updated to use project_id
                padding: '10px',
                margin: '5px',
                border: '1px solid #ccc',
              }}
            >
              <strong>Project ID:</strong> {project.project_id} <br />  {/* Updated to use project_id */}
              <strong>Title:</strong> {project.title}
            </li>
          ))}
        </ul>
      </div>

      {selectedProject && (
        <div>
          <h2>Edit Project Details</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Publish Date:</label>
              <input
                type="date"
                name="publish_date"
                value={formData.publish_date}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Industry:</label>
              <select name="industry" value={formData.industry} onChange={handleInputChange}>
                <option value="">Select Industry</option>
                {Object.keys(industryOptions).map((industry) => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Discipline:</label>
              <select name="discipline" value={formData.discipline} onChange={handleInputChange}>
                <option value="">Select Discipline</option>
                {disciplines.map((discipline) => (
                  <option key={discipline} value={discipline}>{discipline}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Duration:</label>
              <select name="duration" value={formData.duration} onChange={handleInputChange}>
                <option value="Any length">Any length</option>
                <option value="4 weeks">4 weeks</option>
                <option value="6 weeks">6 weeks</option>
                <option value="8 weeks">8 weeks</option>
                <option value="12 weeks">12 weeks</option>
                <option value="24 weeks">24 weeks</option>
              </select>
            </div>
            <div>
              <label>Size:</label>
              <select name="size" value={formData.size} onChange={handleInputChange}>
                <option value="">Select Size</option>
                <option value="Small">Small (1-3 students)</option>
                <option value="Medium">Medium (4-8 students)</option>
                <option value="Large">Large (8+ students)</option>
              </select>
            </div>
            <div>
              <label>Location:</label>
              <select name="location_type" value={formData.location_type} onChange={handleInputChange}>
                <option value="On-site">On-site</option>
                <option value="Online">Online</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
            <div>
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Project Status:</label>
              <select name="status" value={formData.status} onChange={handleInputChange}>
                <option value="">Select Status</option>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
            <div>
              <label>Image Path:</label>
              <input
                type="text"
                name="image_path"
                value={formData.image_path}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit">Save Changes</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default EditProjectList;
