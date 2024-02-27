import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Formik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from "../img/logo1.png"
import Swal from 'sweetalert2';
import Sidebar from '../Components/SideBar';

function VendorRegistration() {
  const initialValues = {
    vendorName: '',
    contactNo: '',
    address: '',
    companyName: '',
    companyType: '',
    email: '',
    
    
  };  
  const navigate = useNavigate();


  const handleSubmit = async (values) => {
    const apiUrl = 'http://localhost:8082/vendor/register';
  
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  
      const response = await axios.post(apiUrl, values, {
        headers: {
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }
      });
  
      if (response.status === 200) {
        // Show SweetAlert for successful registration
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
      // Show SweetAlert for error
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'An error occurred during registration. Please try again later.',
        confirmButtonText: 'OK'
      });
    }
  };
  

  // const navigate = useNavigate();

  // const handleSubmit = (values) => {
  //   const apiUrl = 'http://localhost:8081/vendor/register';

  //   axios.post(apiUrl, values)
  //     .then((res) => {
  //       navigate("/dashboard/vendor-list");
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  return (
    <div className="content-section">
      <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div >
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-6 d-flex flex-column align-items-center justify-content-center">
              <div className="d-flex justify-content-center py-4">
               
              </div>

              <div className="card mb-3">
                <div className="card-body">
                  <div className="pt-4 pb-2 row justify-content-center">
                  <a href="index.html" class="logo d-flex align-items-center w-auto">
                  <img src={logo} alt=""/>
                  <span class="d-none d-lg-block">Vendor Registration</span>
                </a>
             
                  
                  </div>
                  <hr></hr>

                  <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                    {({ values, handleChange, handleSubmit }) => (
                      <form id="registerForm" className="row g-3 needs-validation" onSubmit={handleSubmit}>
                        <div className="col-6">
                          <label htmlFor="vendorName" className="form-label">Vendor Name</label>
                          <input type="text" name="vendorName" className="form-control" id="vendorName" value={values.vendorName} onChange={handleChange}/>
                        </div>
                        <div className="col-6">
                          <label htmlFor="contactNo" className="form-label">Contact No</label>
                          <input type="text" name="contactNo" className="form-control" id="contactNo" value={values.contactNo} onChange={handleChange}/>
                        </div>
                        <div className="col-6">
                          <label htmlFor="address" className="form-label">Address</label>
                          <input type="text" name="address" className="form-control" id="address" value={values.address} onChange={handleChange}/>
                        </div>
                        <div className="col-6">
                          <label htmlFor="companyName" className="form-label">Company Name</label>
                          <input type="text" name="companyName" className="form-control" id="companyName" value={values.companyName} onChange={handleChange}/>
                        </div>
                        <div className="col-6">
                          <label htmlFor="companyType" className="form-label">Company Type</label>
                          <input type="text" name="companyType" className="form-control" id="companyType" value={values.companyType} onChange={handleChange}/>
                        </div>
                     
                        <div className="col-6">
                          <label htmlFor="email" className="form-label">Email</label>
                          <input type="email" name="email" className="form-control" id="email" value={values.email} onChange={handleChange}/>
                        </div>

                        <div className="col-6"> {/* New field for company size */}
                          <label htmlFor="companySize" className="form-label">Company Size</label>
                          <input type="text" name="companySize" className="form-control" id="companySize" value={values.companySize} onChange={handleChange}/>
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
