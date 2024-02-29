import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Formik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from "../img/logo1.png"
import Swal from 'sweetalert2';
import * as Yup from 'yup';

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
    const apiUrl = 'http://localhost:8081/vendor/register';

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
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'An error occurred during registration. Please try again later.',
        confirmButtonText: 'OK'
      });
    }
  };

  const validationSchema = Yup.object().shape({
    vendorName: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, 'Vendor Name must contain only letters and spaces')
    .required('Vendor Name is required'),
    contactNo: Yup.string()
    .matches(/^[0-9]{10}$/, 'Contact No must be 10 digits')
    .required('Contact No is required'),
    address: Yup.string().required('Address is required'),
    companyName: Yup.string().required('Company Name is required'),
    companyType: Yup.string().required('Company Type is required'),
    email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
    companySize: Yup.string()
    .matches(/^[0-9]+$/, 'Company Size must be numeric')
    .required('Company Size is required')
  });

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
                    validationSchema={validationSchema}
                  >
                    {({ values, handleChange, handleSubmit, errors, touched }) => (
                      <form id="registerForm" className="row g-3 needs-validation" onSubmit={handleSubmit}>
                        <div className="col-6">
                          <label htmlFor="vendorName" className="form-label">Vendor Name</label>
                          <input type="text" name="vendorName" className={`form-control ${errors.vendorName && touched.vendorName ? 'is-invalid' : ''}`} id="vendorName" value={values.vendorName} onChange={handleChange} />
                          {errors.vendorName && touched.vendorName ? (
                            <div className="invalid-feedback">{errors.vendorName}</div>
                          ) : null}
                        </div>
                        <div className="col-6">
                          <label htmlFor="contactNo" className="form-label">Contact No</label>
                          <input type="text" name="contactNo" className={`form-control ${errors.contactNo && touched.contactNo ? 'is-invalid' : ''}`} id="contactNo" value={values.contactNo} onChange={handleChange} />
                          {errors.contactNo && touched.contactNo ? (
                            <div className="invalid-feedback">{errors.contactNo}</div>
                          ) : null}
                        </div>
                        <div className="col-6">
                          <label htmlFor="address" className="form-label">Address</label>
                          <input type="text" name="address" className={`form-control ${errors.address && touched.address ? 'is-invalid' : ''}`} id="address" value={values.address} onChange={handleChange} />
                          {errors.address && touched.address ? (
                            <div className="invalid-feedback">{errors.address}</div>
                          ) : null}
                        </div>
                        <div className="col-6">
                          <label htmlFor="companyName" className="form-label">Company Name</label>
                          <input type="text" name="companyName" className={`form-control ${errors.companyName && touched.companyName ? 'is-invalid' : ''}`} id="companyName" value={values.companyName} onChange={handleChange} />
                          {errors.companyName && touched.companyName ? (
                            <div className="invalid-feedback">{errors.companyName}</div>
                          ) : null}
                        </div>
                        <div className="col-6">
                          <label htmlFor="companyType" className="form-label">Company Type</label>
                          <input type="text" name="companyType" className={`form-control ${errors.companyType && touched.companyType ? 'is-invalid' : ''}`} id="companyType" value={values.companyType} onChange={handleChange} />
                          {errors.companyType && touched.companyType ? (
                            <div className="invalid-feedback">{errors.companyType}</div>
                          ) : null}
                        </div>
                        <div className="col-6">
                          <label htmlFor="email" className="form-label">Email</label>
                          <input type="email" name="email" className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`} id="email" value={values.email} onChange={handleChange} />
                          {errors.email && touched.email ? (
                            <div className="invalid-feedback">{errors.email}</div>
                          ) : null}
                        </div>
                        <div className="col-6">
                          <label htmlFor="companySize" className="form-label">Company Size</label>
                          <input type="text" name="companySize" className={`form-control ${errors.companySize && touched.companySize ? 'is-invalid' : ''}`} id="companySize" value={values.companySize} onChange={handleChange} />
                          {errors.companySize && touched.companySize ? (
                            <div className="invalid-feedback">{errors.companySize}</div>
                          ) : null}
                        </div>
                        <div className="col-12 d-flex justify-content-center ">
                          <button id="registerBtn" className="btn btn-primary w-25  " type="submit">Register</button>
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
