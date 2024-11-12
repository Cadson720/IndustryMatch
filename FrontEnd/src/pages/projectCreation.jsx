import React, { useState, useEffect } from 'react';
import '../styles/projectCreation.css';

function CreateProject() {
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

  // State to store form inputs, initialize with today's date
  const [formData, setFormData] = useState({
    title: '',
    publish_date: getTodayDate(),
    industry: '',
    discipline: '',
    duration: '',
    size: '', // Update to match your DB field
    location_type: '',
    address: '',
    description: `Project Objectives:\n\n\nTechnical Knowledge:\n\n\nStudent Year Recommendation:\n\n`,
    status: '', // Update to match your DB field
    image_path: ''
  });

  // State to handle disciplines based on the selected industry
  const [disciplines, setDisciplines] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Update discipline options when industry is selected
  useEffect(() => {
    if (formData.industry) {
      setDisciplines(industryOptions[formData.industry] || []);
      setFormData((prevData) => ({
        ...prevData,
        discipline: '' // Reset discipline when industry changes
      }));
    }
  }, [formData.industry]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
        !formData.publish_date.trim() || 
        !formData.discipline.trim() || 
        !formData.duration.trim() || 
        !formData.size.trim() || 
        !formData.location_type.trim() || 
        !formData.address.trim() || 
        !formData.description.trim() || 
        !formData.status.trim() || 
        !formData.image_path.trim()
    ) {
        setError('Please fill all required fields');
        return;
    }

    const requiredHeadings = ["Project Objectives:", "Technical Knowledge:", "Student Year Recommendation:"];
    const missingHeadings = requiredHeadings.filter(heading => !formData.description.includes(heading));

    if (missingHeadings.length > 0) {
        setError(`Please do not remove the following headings: ${missingHeadings.join(', ')}`);
        return;
    }

    try {
        const token = localStorage.getItem('jwtToken'); // Retrieve token from local storage
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/project/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the request
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            setSuccess(true);
            setError(null);
            setFormData({
                title: '',
                publish_date: getTodayDate(),
                industry: '',
                discipline: '',
                duration: '',
                size: '',
                location_type: '',
                address: '',
                description: `Project Objectives:\n\n\nTechnical Knowledge:\n\n\nStudent Year Recommendation:\n\n`,
                status: '',
                image_path: ''
            });
        } else {
            const errorData = await response.json();
            setError(errorData.error || 'Failed to create project');
        }
    } catch (err) {
        setError('Something went wrong while creating the project');
    }
};
  return (
    <div className="create_body">
    <div className="comp">
        <h1>Create a New Project</h1>

        {success && <p>Project created successfully!</p>}
        {error && <p>Error: {error}</p>}

        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="label">Title:</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label className="label">Publish Date:</label>
                <input type="date" name="publish_date" value={formData.publish_date} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label className="label">Industry:</label>
                <select name="industry" value={formData.industry} onChange={handleChange} required>
                    <option value="">Select Industry</option>
                    {Object.keys(industryOptions).map((industry) => (
                        <option key={industry} value={industry}>{industry}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label className="label">Discipline:</label>
                <select name="discipline" value={formData.discipline} onChange={handleChange} required>
                    <option value="">Select Discipline</option>
                    {disciplines.map((discipline) => (
                        <option key={discipline} value={discipline}>{discipline}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label className="label">Duration:</label>
                <select name="duration" value={formData.duration} onChange={handleChange} required>
                    <option value="Any length">Any length</option>
                    <option value="4 weeks">4 weeks</option>
                    <option value="6 weeks">6 weeks</option>
                    <option value="8 weeks">8 weeks</option>
                    <option value="12 weeks">12 weeks</option>
                    <option value="24 weeks">24 weeks</option>
                </select>
            </div>
            <div className="form-group">
                <label className="label">Size:</label>
                <select name="size" value={formData.size} onChange={handleChange} required>
                    <option value="">Select Size</option>
                    <option value="Small">Small (1-3 students)</option>
                    <option value="Medium">Medium (4-8 students)</option>
                    <option value="Large">Large (8+ students)</option>
                </select>
            </div>
            <div className="form-group">
                <label className="label">Location:</label>
                <select name="location_type" value={formData.location_type} onChange={handleChange} required>
                    <option value="On-site">On-site</option>
                    <option value="Online">Online</option>
                    <option value="Flexible">Flexible</option>
                </select>
            </div>
            <div className="form-group">
                <label className="label">Address:</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <div className="form-group">
          <label className="label">Description:</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            rows="10"
            required 
          />
        </div>
            <div className="form-group">
                <label className="label">Project Status:</label>
                <select name="status" value={formData.status} onChange={handleChange} required>
                    <option value="">Select Status</option>
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                    <option value="Archived">Archived</option>
                </select>
            </div>
            <button type="submit">Create Project</button>
        </form>
        <div className="behind"></div>
    </div>
    </div>
);

}

export default CreateProject;