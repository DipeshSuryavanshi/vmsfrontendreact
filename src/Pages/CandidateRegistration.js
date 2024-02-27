import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from 'flatpickr';
import logo from "../img/logo1.png"


function CandidateRegistration() {
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({
    candidateName: '',
    contactNo: '',
    address: '',
    experience: '',
    dateOfBirth: '',
    email: '',
    terms: false,
    selectedSkills: []
  });

  useEffect(() => {
    fetchSkills();
    
    flatpickr("#dateOfBirth", {
      dateFormat: "Y-m-d"
    });
  }, []);
  const fetchSkills = async () => {
    try {
      const response = await fetch('http://localhost:8081/skill/getAllSkills');
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

  // const fetchSkills = () => {
  //   fetch('http://localhost:8081/skill/getAllSkills')
  //     .then(response => response.json())
  //     .then(data => setSkills(data))
  //     .catch(error => console.error('Error fetching skills:', error));
  // };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleSkillsChange = (event) => {
    const { value } = event.target;
    const selectedSkills = [...formData.selectedSkills];
    if (selectedSkills.includes(value)) {
      const index = selectedSkills.indexOf(value);
      selectedSkills.splice(index, 1);
    } else {
      selectedSkills.push(value);
    }
    setFormData({ ...formData, selectedSkills });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted');

    const form = event.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (formData.selectedSkills.length === 0) {
      alert('Please select at least one skill!');
      return;
    }

    const jsonBody = JSON.stringify(formData);

    fetch('http://localhost:8081/candidate/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonBody
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Registration failed');
        }
      })
      .then(data => {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'Thank you for registering as a candidate!',
          confirmButtonText: 'OK'
        }).then(() => {
          window.location.href = `pages-login-candidate.html?id=${data.id}`;
        });
      })
      .catch(error => {
        console.error('Error registering candidate:', error);
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: 'Oops! Something went wrong. Please try again later.',
          confirmButtonText: 'OK'
        });
      });
  };

  const handleAddSkill = () => {
    const newSkillName = prompt("Enter the name of the new skill:");
    if (!newSkillName) {
      return;
    }
    fetch('http://localhost:8081/skill/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ skillsName: newSkillName })
    })
      .then(response => {
        if (response.ok) {
          alert('New skill added successfully!');
          fetchSkills();
        } else {
          alert('Failed to add new skill. Please try again.');
        }
      })
      .catch(error => console.error('Error adding new skill:', error));
  };

  return (
    <main>
    <div class="content-section">
      <div class="dashboard"></div>
      <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-8 col-md-6 d-flex flex-column align-items-center justify-content-center">

              <div class="d-flex justify-content-center py-4">
                {/* <a href="index.html" class="logo d-flex align-items-center w-auto">
                  <img src={logo} alt=""/>
                  <span class="d-none d-lg-block">Candidate Registration</span>
                </a> */}
              </div>

              <div class="card mb-3">

                <div class="card-body">

                  <div class="pt-4 pb-2 row justify-content-center">
                  <a href="index.html" class="logo d-flex align-items-center w-auto">
                  <img src={logo} alt=""/>
                  <span class="d-none d-lg-block">Candidate Registration</span>
                </a>
                
                    {/* <h5 class="card-title text-center pb-0 fs-4">Register as Candidate</h5>
                    <p class="text-center small">Enter your details to register as a candidate</p> */}
                  </div>
                  <hr></hr>

                  <form class="row g-3 needs-validation" novalidate>
                    <div class="col-6">
                      <label for="candidateName" class="form-label">Candidate Name</label>
                      <input type="text" name="candidateName" class="form-control" id="candidateName" required/>
                      <div class="invalid-feedback">Please enter candidate name!</div>
                    </div>

                    <div class="col-6">
                      <label for="contactNo" class="form-label">Contact Number</label>
                      <input type="text" name="contactNo" class="form-control" id="contactNo" required/>
                      <div class="invalid-feedback">Please enter a valid contact number!</div>
                    </div>

                    <div class="col-6">
                      <label for="address" class="form-label">Address</label>
                      <input type="text" name="address" class="form-control" id="address" required/>
                      <div class="invalid-feedback">Please enter address.</div>
                    </div>

                    <div class="col-6">
                      <label for="experience" class="form-label">Experience</label>
                      <input type="text" name="experience" class="form-control" id="experience" required/>
                      <div class="invalid-feedback">Please enter candidate experience!</div>
                    </div>

                    <div className="col-6">
                        <label htmlFor="skills" className="form-label">Skills</label>
                        <select multiple className="form-select" id="skills" required onChange={handleSkillsChange}>
                          {skills.map(skill => (
                            <option key={skill.id} value={skill.id}>{skill.name}</option>
                          ))}
                        </select>
                        <div className="invalid-feedback">Please select at least one skill!</div>
                      </div>
                      {/* Add New Skill button */}
                      <div className="col-6 mt-3">
                        <button type="button" className="btn btn-primary" onClick={handleAddSkill}>Add New Skill</button>
                      </div>

                    {/* <div class="col-6">
                      <label for="skills" class="form-label">Skills</label>
                      <div class="dropdown">
                          <button class="btn btn-secondary dropdown-toggle" type="button" id="skillsDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                              Select Skills
                          </button>
                          <ul class="dropdown-menu" aria-labelledby="skillsDropdown" id="skillsDropdownMenu">
                          </ul>
                      </div>
                      <div class="invalid-feedback">Please select at least one skill!</div>
                  </div>
                  
                  <div class="col-6 mt-3">
                      <button id="addSkillsBtn" class="btn btn-primary">Add New Skill</button>
                  </div> */}

                    <div class="col-6">
                      <label for="dateOfBirth" class="form-label">Date of Birth</label>
                      <input type="date" name="dateOfBirth" class="form-control" id="dateOfBirth" required/>
                      <div class="invalid-feedback">Please choose date of birth!</div>
                    </div>

                    <div class="col-6">
                      <label for="email" class="form-label">Email</label>
                      <input type="email" name="email" class="form-control" id="email" required/>
                      <div class="invalid-feedback">Please enter a valid email address!</div>
                    </div>
                    
                    

                    <div class="col-12 d-flex justify-content-center">
                      <button class="btn btn-primary w-25" id="registerButton" type="submit">Register</button>
                  </div>
              
                  </form>

                </div>
              </div>

              <div class="credits">
                               <a href="https://bootstrapmade.com/"></a>
              </div>

            </div>
          </div>
        </div>

      </section>

    </div>
  </main>
  
  );
}

export default CandidateRegistration;
