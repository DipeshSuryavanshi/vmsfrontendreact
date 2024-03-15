import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from 'flatpickr';
import logo from "../img/logo1.png";

const API_URL = process.env.REACT_APP_API_URL;

function CandidateRegistration() {
  const [formData, setFormData] = useState({
    candidateName: '',
    contactNo: '',
    address: '',
    overallExperience: '',
    email: '',
    dateOfBirth: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    flatpickr("#dateOfBirth", {
      dateFormat: "Y-m-d",
      
    });
  }, []);

 

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const jsonBody = JSON.stringify(formData);

    // Assuming you have a function to retrieve the auth token
    const token = localStorage.getItem('token');
    fetch(`${API_URL}candidate/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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
        navigate("/dashboard/candidate-list");
        // Redirect to a success page or perform any necessary action
        console.log(data);
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

  return (
    <main>
      <div className="content-section">
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="pt-4 pb-2 row justify-content-center">
                      <a href="index.html" className="logo d-flex align-items-center w-auto">
                        <img src={logo} alt=""/>
                        <span className="d-none d-lg-block">Candidate Registration</span>
                      </a>
                    </div>
                    <hr/>
                    <form className="row g-3 needs-validation" noValidate onSubmit={handleSubmit}>
                      <div className="col-6">
                        <label htmlFor="candidateName" className="form-label">Candidate Name</label>
                        <input type="text" name="candidateName" className="form-control" id="candidateName" required onChange={handleInputChange}/>
                        <div className="invalid-feedback">Please enter candidate name!</div>
                      </div>
                      <div className="col-6">
                        <label htmlFor="contactNo" className="form-label">Contact Number</label>
                        <input type="text" name="contactNo" className="form-control" id="contactNo" required onChange={handleInputChange}/>
                        <div className="invalid-feedback">Please enter a valid contact number!</div>
                      </div>
                      <div className="col-6">
                        <label htmlFor="address" className="form-label">Address</label>
                        <input type="text" name="address" className="form-control" id="address" required onChange={handleInputChange}/>
                        <div className="invalid-feedback">Please enter address.</div>
                      </div>
                      <div className="col-6">
                        <label htmlFor="overallExperience" className="form-label">Overall Experience</label>
                        <input type="text" name="overallExperience" className="form-control" id="overallExperience" required onChange={handleInputChange}/>
                        <div className="invalid-feedback">Please enter candidate's overall experience!</div>
                      </div>
                      <div className="col-6">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" name="email" className="form-control" id="email" required onChange={handleInputChange}/>
                        <div className="invalid-feedback">Please enter a valid email address!</div>
                      </div>
                      <div className="col-6">
                        <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                        <input type="date" name="dateOfBirth" className="form-control" id="dateOfBirth" required/>
                        <div className="invalid-feedback">Please choose date of birth!</div>
                      </div>
                      <div className="col-12 d-flex justify-content-center">
                        <button className="btn btn-primary w-25" id="registerButton" type="submit">Register</button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="credits">
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
