import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';


const API_URL = process.env.REACT_APP_API_URL;
const CandidateForm = () => {
  const [formData, setFormData] = useState({
    id: '',
    totalExperience: '',
    userSkillMap: [{ selectedSkill: '', points: '' }],
    multipart: ''
  });

  const [candidates, setCandidates] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    // Fetch candidates
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
        const response = await fetch(`${API_URL}candidate/getAll`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // Assuming your API expects JSON data
          }
        });
        if (response.ok) {
          const data = await response.json();
          setCandidates(data);
        } else {
          console.error('Error fetching candidates:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };
  
    // Fetch skills
    const fetchSkills = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
        const response = await fetch(`${API_URL}skill/getAllSkills`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // Assuming your API expects JSON data
          }
        });
        if (response.ok) {
          const data = await response.json();
          setSkills(data);
        } else {
          console.error('Error fetching skills:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };
  
    fetchCandidates();
    fetchSkills();
  }, []);
  

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const newFormData = { ...formData };
    if (name === 'selectedSkill' || name === 'points') {
      newFormData.userSkillMap[index][name] = value;
    } else {
      newFormData[name] = value;
    }
    setFormData(newFormData);
  };

  const handleAddSkill = () => {
    setFormData({
      ...formData,
      userSkillMap: [...formData.userSkillMap, { selectedSkill: '', points: '' }]
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
   // Transforming userSkillMap array to object
   const skillMapObject = formData.userSkillMap.reduce((acc, curr) => {
    acc[curr.selectedSkill] = curr.points;
    return acc;
  }, {});

  // Constructing the payload
  const payload = {
    id: candidates.id,
    totalExperience: formData.totalExperience,
    userSkillMap: skillMapObject,
    multipart: formData.multipart
  };

  console.log('Payload:', payload);
    // Perform form submission logic here
    const formDataToSubmit = new FormData(); // Create FormData object
  
    // Append form data fields to FormData object
    formDataToSubmit.append('id', formData.id);
    formDataToSubmit.append('totalExperience', formData.totalExperience);
    formDataToSubmit.append('userSkillMap',JSON.stringify(skillMapObject));
    formDataToSubmit.append('multipart', formData.multipart);
  
    try {
      const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
      const response = await fetch(`${API_URL}candidate/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
       
        body: formDataToSubmit, // Pass FormData object as body
        
      });
      
      if (response.ok) {
        console.log('Form submitted successfully');

       
            await Swal.fire({
              icon: 'success',
              title: 'Registration Successful',
              text: 'Your registration has been completed successfully!',
            });
           
            window.location.reload();
        // Handle success, reset form, show success message, etc.
      } else {
        console.error('Error submitting form:', response.statusText);
        await Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred while submitting the form. Please try again later.',
          });
        
        // Handle error, show error message, etc.
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error, show error message, etc.
      await Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'An error occurred while submitting the form. Please try again later.',
      });
    }
  };
  

  return (
    
    <Form onSubmit={handleSubmit} className='content-section mt-4 p-4 margin-top-80 profile-container'>
      {/* Candidate Name */}
    
      <Form.Group className="mb-3 row row" controlId="candidateName">
      
      <div className="col-3">
        <Form.Label className='text-left' >Candidate Name</Form.Label>
</div>
<div className="col-6">

{/* <Form.Control
  as="select"
  value={formData.id} // Change to candidateId
  onChange={(e) => setFormData({ ...formData, id: e.target.value })} // Change to candidateId
>
  <option value="">Select candidate</option>
  {candidates.map(candidate => (
    <option key={candidate.id} value={candidate.id}>{candidate.candidateName}</option> // Change to candidate.id
  ))}
</Form.Control> */}
        <Form.Control
          as="select"
          value={formData.candidateName}
          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
        >
          <option value="">Select candidate</option>
          {candidates.map(candidate => (
            <option key={candidate.id} value={candidate.id}>{`${candidate.firstName} ${candidate.lastName}`}</option>
          ))}
        </Form.Control>
        </div>
        
      </Form.Group>
      

      {/* Total Experience */}
      <Form.Group className="mb-3 row" controlId="TotalExperience">
      <div className="col-3">
        <Form.Label className='text-left' >Total Experience</Form.Label>
      </div>

      <div className="col-6">
        <Form.Control
          type="number"
          placeholder="Enter total experience"
          name="totalExperience"
          value={formData.totalExperience}
          onChange={handleChange}
        />
        </div>
      </Form.Group>

      {/* Skill Map */}
     
     {/* Skill Map */}
     {formData.userSkillMap.map((skill, index) => (
        <div key={index}>
             <hr/>
             <Form.Group className="mb-3 row" controlId={`selectedSkill-${index}`}>
             <div className="col-3">
            <Form.Label className='text-left'>Skill</Form.Label>
</div>
<div className="col-6">
            <Form.Control
              as="select"
              name="selectedSkill"
              value={skill.selectedSkill}
              onChange={(e) => handleChange(e, index)}
            >
              <option value="">Select skill</option>
              {skills.map(skill => (
                <option key={skill.id} value={skill.skillsName}>{skill.skillsName}</option>
              ))}
            </Form.Control>
            </div>
          </Form.Group>

          <Form.Group className="mb-3 row" controlId={`points-${index}`}>
          <div className="col-3">
            <Form.Label className='text-left'>Experience</Form.Label>
            </div>
            <div className="col-6">
            <Form.Control
              type="number"
              placeholder="Enter points"
              name="points"
              value={skill.points}
              onChange={(e) => handleChange(e, index)}
            />
            </div>
          </Form.Group>
        </div>
      ))}
 <div className="col-12 flex-end">

      {/* Add Skill Button */}
      <Button variant="primary" onClick={handleAddSkill} className="mb-3 ms-auto  d-flex" >
        Add Skill
      </Button>
        </div>
        <hr></hr>

      {/* Multipart */}
      <Form.Group className="mb-3 row" controlId="multipart">
      <div className="col-3">
        
        <Form.Label className='text-left'>Resume Upload</Form.Label>
        </div>
        <div className="col-6">

        <Form.Control
          type="file"
          name="multipart"
          onChange={(e) => setFormData({ ...formData, multipart: e.target.files[0] })}
        />
        </div>
      </Form.Group>

      <Button variant="primary" type="submit" className="d-block mx-auto">
        Submit
      </Button>
    </Form>
  );
};

export default CandidateForm;
