import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Formik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from "../img/logo1.png"
import Swal from 'sweetalert2';

const API_URL = process.env.REACT_APP_API_URL;

function VendorRegistration() {
  const initialValues = {
    vendorName: '',
    contactNo: '',
    address: '',
    companyName: '',
    companyType: '',
    email: '',
    companySize: '',
  };

  const navigate = useNavigate();
  const handleSubmit = async (values) => {
    const apiUrl = `${API_URL}vendor/register`;
  
    try {
      const token = localStorage.getItem('token');
  
      const response = await axios.post(apiUrl, values, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'You have successfully registered as a vendor.',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate("/dashboard/vendor-list");
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: 'A vendor with the provided email already exists.',
          confirmButtonText: 'OK'
        });
      } else {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: 'An error occurred during registration. Please try again later.',
          confirmButtonText: 'OK'
        });
      }
    }
  };
  

  return (
    <div className="content-section">
      <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div>
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-6 d-flex flex-column align-items-center justify-content-center">
              <div className="d-flex justify-content-center py-4">
              </div>

              <div className="card mb-3">
                <div className="card-body">
                  <div className="pt-4 pb-2 row justify-content-center">
                    <a href="index.html" className="logo d-flex align-items-center w-auto">
                      <img src={logo} alt="" />
                      <span className="d-none d-lg-block">Vendor Registration</span>
                    </a>
                  </div>
                  <hr />

                  <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validate={(values) => {
                      const errors = {};
                      if (!values.vendorName) {
                        errors.vendorName = 'Vendor name is required';
                      } else if (/\d/.test(values.vendorName)) {
                        errors.vendorName = 'Vendor name cannot contain numeric digits';
                      }
                      if (!values.contactNo) {
                        errors.contactNo = 'Contact number is required';
                      } else if (!/^\d{10}$/.test(values.contactNo)) {
                        errors.contactNo = 'Contact number must be exactly 10 digits';
                      }
                      if (!values.email) { //main changes
                        errors.email = 'Email is required';
                      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || !values.email.endsWith('.com')) {
                        errors.email = 'Invalid email address or email must end with .com';
                      }
                      if (values.companySize && !/^\d+$/.test(values.companySize)) {
                        errors.companySize = 'Company size must be numeric';
                      }
                      return errors;
                    }}
                  >
                    {({ values, handleChange, handleSubmit, errors, touched }) => (
                      <form id="registerForm" className="row g-3 needs-validation" onSubmit={handleSubmit}>
                        <div className="col-6">
                          <label htmlFor="vendorName" className="form-label">
                            Vendor Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="vendorName"
                            className={`form-control ${errors.vendorName && touched.vendorName ? 'is-invalid' : ''}`}
                            id="vendorName"
                            value={values.vendorName}
                            onChange={handleChange}
                            required
                          />
                          {errors.vendorName && touched.vendorName && (
                            <div className="invalid-feedback">{errors.vendorName}</div>
                          )}
                        </div>
                        <div className="col-6">
                          <label htmlFor="contactNo" className="form-label">
                            Contact No <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="contactNo"
                            className={`form-control ${errors.contactNo && touched.contactNo ? 'is-invalid' : ''}`}
                            id="contactNo"
                            value={values.contactNo}
                            onChange={handleChange}
                            maxLength={10} // Added maxLength attribute
                            required
                          />
                          {errors.contactNo && touched.contactNo && (
                            <div className="invalid-feedback">{errors.contactNo}</div>
                          )}
                        </div>
                        <div className="col-6">
                          <label htmlFor="email" className="form-label">
                            Email <span className="text-danger">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                            id="email"
                            value={values.email}
                            onChange={handleChange}
                            required
                          />
                          {errors.email && touched.email && (
                            <div className="invalid-feedback">{errors.email}</div>
                          )}
                        </div>
                        <div className="col-6">
                          <label htmlFor="address" className="form-label">Address</label>
                          <input type="text" name="address" className={`form-control`} id="address" value={values.address} onChange={handleChange} />
                        </div>
                        <div className="col-6">
                          <label htmlFor="companyName" className="form-label">Company Name</label>
                          <input type="text" name="companyName" className={`form-control`} id="companyName" value={values.companyName} onChange={handleChange} />
                        </div>
                        <div className="col-6">
                          <label htmlFor="companyType" className="form-label">Company Type</label>
                          <input type="text" name="companyType" className={`form-control`} id="companyType" value={values.companyType} onChange={handleChange} />
                        </div>
                        <div className="col-6">
                          <label htmlFor="companySize" className="form-label">Company Size </label>
                          <input type="text" name="companySize" className={`form-control ${errors.companySize && touched.companySize ? 'is-invalid' : ''}`} id="companySize" value={values.companySize} onChange={handleChange} />
                          {errors.companySize && touched.companySize && (
                            <div className="invalid-feedback">{errors.companySize}</div>
                          )}
                        </div>
                        <div className="col-12 d-flex justify-content-center">
                          <button id="registerBtn" className="btn btn-primary w-25" type="submit">Register</button>
                        </div>
                      </form>
                    )}
                  </Formik>
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
  );
}

export default VendorRegistration;
