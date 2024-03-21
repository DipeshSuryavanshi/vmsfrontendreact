import React, { useState, useEffect } from "react";
import SideBar from "../Components/SideBar";
import Box from "@mui/material/Box";
import NavBar from "../Components/NavBar";
import Swal from "sweetalert2";
import Select from "react-select";
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;
function CandidateInfo() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    motherName: "",
    linkedinUrl: "",
    skypeID: "",
    facebookUrl: "",
    whatsappNumber: "",
    contactNo: "",
    address: "",
    email: "",
    dateOfBirth: "",
    aadharNumber: "",
    panNumber: "",
    skills: [],
    totalExperience: "",
    graduationInstituteName: "",
    graduationName: "",
    graduationStream: "",
    graduationPassingYear: "",
    graduationPercentage: "",
    postgraduationInstituteName: "",
    postgraduationName: "",
    postgraduationStream: "",
    postgraduationPassingYear: "",
    postgraduationPercentage: "",
    highSchoolName: "",
    highSchoolPassingYear: "",
    highSchoolPercentage: "",
    secondarySchoolName: "",
    secondarySchoolPassingYear: "",
    secondarySchoolPercentage: "",
  })
  const [mandatoryFieldsCompleted, setMandatoryFieldsCompleted] = useState({
    firstName: false,
    lastName: false,
    email: false,
    dateOfBirth: false,
    contactNo: false,
    address: false,
    aadharNumber: false,
    totalExperience: false,
    skills: false
  });



  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("personal");
  const [showPostGraduation, setShowPostGraduation] = useState(false);
  const [nextButtonClicked, setNextButtonClicked] = useState(false);
  const [allSkills, setAllSkills] = useState([]);
  const [token, setToken] = useState("");
  const [educationTabActive, setEducationTabActive] = useState(false);

  useEffect(() => {
    if (activeTab === "personal") {
      // Disable the Education Profile tab when switching back to Personal Detail tab
      setEducationTabActive(false);
    }
  }, [activeTab]);

  useEffect(() => {
    // Enable/disable "Next" button and "Education Profile" tab based on completion status
    const nextBtn = document.getElementById("nextBtn");
    const educationTab = document.getElementById("educationTab");
    if (nextBtn && educationTab) {
      const allMandatoryFieldsCompleted = Object.values(
        mandatoryFieldsCompleted
      ).every((field) => field);
      nextBtn.disabled = !allMandatoryFieldsCompleted || nextButtonClicked;
      educationTab.disabled = !educationTabActive;
    }
  }, [mandatoryFieldsCompleted, nextButtonClicked, educationTabActive]);
  useEffect(() => {
    // Fetch authorization token from localStorage
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    // Fetch skills when the component mounts
    async function fetchSkills() {
      try {
        const response = await fetch(`${API_URL}skill/getAllSkills`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        if (response.ok) {
          const skillsData = await response.json();
          console.log("Skills Data:", skillsData);
          setAllSkills(skillsData);
          console.log("Skills Data:", allSkills);
        } else {
          console.error("Failed to fetch skills");
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    }

    fetchSkills();
  }, []);



  const handleChange = (e) => {
    if (e.target) {
      // Standard input change event

      const { name, value } = e.target;
      let errorMessage = '';
      // Custom validation for email format
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      if (name === 'contactNo') {
        if (value.length > 10) {
          errorMessage = 'Contact number cannot exceed 10 digits.';
        } else if (value.length < 10) {
          errorMessage = 'Please enter 10 digits for contact number.';
        }
      }

      if (name === 'whatsappNumber') {
        if (value.length > 10) {
          errorMessage = 'WhatsApp number should contain exactly 10 digits';
        } else if (value.length < 10) {
          errorMessage = 'Please enter 10 digits for WhatsApp number';
        }
      }
      // if (!regex.test(value)) {
      //   e.target.setCustomValidity('Please enter a valid email ending with .com.');
      // } else {
      //   e.target.setCustomValidity('');
      // }

      setFormData(prevState => ({
        ...prevState,
        [name]: value,
        // contactNoError: errorMessage,
        // whatsappNumberError: errorMessage,
        // emailError: isValidEmail ? '' : 'Please enter a valid email address',
      }));
      if (mandatoryFieldsCompleted.hasOwnProperty(name)) {
        setMandatoryFieldsCompleted(prevState => ({
          ...prevState,
          [name]: !!value
        }));
      }
    } else {
      // react-select change event
      const selectedOptions = e;
      const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
      setFormData(prevState => ({
        ...prevState,
        skills: selectedValues,
      }));
      setMandatoryFieldsCompleted(prevState => ({
        ...prevState,
        skills: selectedValues.length > 0
      }));

    }

  };






  const handleSubmit = async (e) => {
    e.preventDefault();
    setNextButtonClicked(false);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}candidate/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: "Candidate has been registered successfully.",
          confirmButtonText: 'Ok'
        }).then(() => {
          navigate("/dashboard/candidate-list");
        });
      } else {
        const responseData = await response.json();
        if (response.status === 409 && responseData.errorCode === 409) {
          Swal.fire({
            icon: "error",
            title: "Registration Failed",
            text: "Candidate with email already exists",
            confirmButtonText: 'Ok'
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Registration Failed",
            text: "Failed to register the candidate. Please try again later.",
            confirmButtonText: 'Ok'
          });
        }
      }
    } catch (error) {
      // Handle any network errors or exceptions
      console.error("Error registering candidate:", error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "Failed to register the candidate. Please try again later.",
        confirmButtonText: 'Ok'
      });
    }
  };


  const handleNextButtonClick = () => {
    // Set the state to indicate that "Next" button is clicked
    setNextButtonClicked(true);
    setActiveTab("educational");
    setEducationTabActive(true);
  };

  return (
    <>
      {/* <NavBar /> */}
      <Box height={100} />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Adjusted styling here */}
        {/* <SideBar /> */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <div className="profile-container">
            <h4>Complete your profile</h4>
            <div>
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "personal" ? "active" : ""
                      }`}

                    onClick={() => setActiveTab("personal")}

                  >
                    Personal Details
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "educational" ? "active" : ""
                      }`}
                    onClick={() => setActiveTab("educational")}
                    disabled={!nextButtonClicked}
                  >
                    Educational Details
                  </button>
                </li>
              </ul>
              <div className="tab-content">
                <form onSubmit={handleSubmit}>
                  {/* Personal Details Form */}
                  {activeTab === "personal" && (
                    <div
                      className={`tab-pane ${activeTab === "personal" ? "active" : ""
                        }`}
                    ><div className="row mb-3">

                        <div className="col">
                          <label>
                            First Name<span style={{ color: 'red' }}>*</span>:
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="First Name"
                              pattern="[A-Za-z]+" // Allow only alphabetical characters
                              title="First name should not contain numerical digits or special characters"
                              onKeyPress={(e) => {
                                const charCode = e.which ? e.which : e.keyCode;
                                if (charCode >= 48 && charCode <= 57) {
                                  e.preventDefault(); // Prevent entering numerical digits
                                }
                                const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                                if (specialChars.test(e.key)) {
                                  e.preventDefault(); // Prevent entering special characters
                                }
                              }}
                              required
                            />
                          </label>
                        </div>

                        <div className="col">
                          <label>
                            Last Name<span style={{ color: 'red' }}>*</span>:
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Last Name"
                              onKeyPress={(e) => {
                                const charCode = e.which ? e.which : e.keyCode;
                                if (charCode >= 48 && charCode <= 57) {
                                  e.preventDefault(); // Prevent entering numerical digits
                                }
                                const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                                if (specialChars.test(e.key)) {
                                  e.preventDefault(); // Prevent entering special characters
                                }
                              }}
                              required
                            />
                          </label>
                        </div>


                      </div>
                      <div className="row mb-3">
                        <div className="col">
                          <label>
                            Father's Name:
                            <input
                              type="text"
                              name="fatherName"
                              value={formData.fatherName}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Father's Name"
                              onKeyPress={(e) => {
                                const charCode = e.which ? e.which : e.keyCode;
                                if (charCode >= 48 && charCode <= 57) {
                                  e.preventDefault();
                                }
                              }}
                            />
                          </label>
                        </div>

                        <div className="col">
                          <label>
                            Mother's Name:
                            <input
                              type="text"
                              name="motherName"
                              value={formData.motherName}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Mother's Name"
                              onKeyPress={(e) => {
                                const charCode = e.which ? e.which : e.keyCode;
                                if (charCode >= 48 && charCode <= 57) {
                                  e.preventDefault();
                                }
                              }}
                            />
                          </label>
                        </div>

                      </div>
                      <div className="row mb-3">
                        <div className="col">
                          <label>
                            Skype ID:
                            <input
                              type="text"
                              name="skypeID"
                              value={formData.skypeID}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Skype ID"
                              pattern="[A-Za-z0-9]+"
                              title="Skype ID should contain only alphanumeric characters"
                            />
                          </label>
                        </div>

                        <div className="col">
                          <label>
                            Facebook URL:
                            <input
                              type="text"
                              name="facebookUrl"
                              value={formData.facebookUrl}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Facebook URL"
                              pattern="^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9_\.]+$"
                              title="Please enter a valid Facebook URL"
                            />
                          </label>
                        </div>

                      </div>

                      <div className="row mb-3">
                        <div className="col">
                          <label>
                            WhatsApp Number:
                            <input
                              type="text"
                              name="whatsappNumber"
                              value={formData.whatsappNumber}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="WhatsApp Number"
                              pattern="[0-9]{10}" // Restrict input to exactly 10 numeric characters
                              title="WhatsApp number should contain exactly 10 digits"
                              maxLength={10}
                              minLength={10}
                              onKeyPress={(e) => {
                                const pattern = /[0-9]/;
                                if (!pattern.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            />
                          </label>
                        </div>


                        <div className="col">
                          <label>
                            LinkedIn ID:
                            <input
                              type="text"
                              name="linkedinUrl"
                              value={formData.linkedinUrl}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="LinkedIn ID"
                              pattern="[a-zA-Z0-9]+"
                              title="LinkedIn ID should contain only alphanumeric characters"
                            />
                          </label>
                        </div>

                      </div>


                      <div className="row mb-3">
                        <div className="col">
                          <label>
                            Total Experience<span style={{ color: 'red' }}>*</span>:
                            <input
                              type="text"
                              name="totalExperience"
                              value={formData.totalExperience}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Total Experience"
                              pattern="[0-9]+" // Restrict input to only numeric characters
                              title="Total Experience should contain only numeric values"
                              onKeyPress={(e) => {
                                const charCode = e.which ? e.which : e.keyCode;
                                if (charCode < 48 || charCode > 57) {
                                  e.preventDefault(); // Prevent entering non-numeric characters
                                }
                              }}
                              required
                            />
                          </label>
                        </div>
                        <div className="col">
                          <label>
                            Contact Number<span style={{ color: 'red' }}>*</span>:
                            <input
                              type="text"
                              name="contactNo"
                              value={formData.contactNo}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Contact Number"
                              pattern="[0-9]{10}" // Restrict input to exactly 10 numeric characters
                              title="Contact Number should contain exactly 10 digits"
                              maxLength={10}
                              minLength={10}
                              onKeyPress={(e) => {
                                const pattern = /[0-9]/;
                                if (!pattern.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              required
                            />
                          </label>
                        </div>


                      </div>
                      <div className="row mb-3">
                        <div className="col">
                          <label>
                            Address<span style={{ color: 'red' }}>*</span>:
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Address"
                              required
                            />
                          </label>
                        </div>
                        <div className="col">
                          <label>
                            Email<span style={{ color: 'red' }}>*</span>:
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Email"
                              required
                              onInput={(e) => {
                                const value = e.target.value;
                                const regex = /^[^@]+@[^@]+\.[^@]+\.com$/; // Valid email format regex
                                if (!regex.test(value)) {
                                  e.target.setCustomValidity('Please enter a valid email ending with .com.');
                                } else {
                                  e.target.setCustomValidity('');
                                }
                              }}
                            />
                          </label>
                          {formData.emailError && (
                            <span className="error-message">{formData.emailError}</span>
                          )}
                        </div>






                      </div>
                      <div className="row mb-3">
                        <div className="col">
                          <label>
                            Date of Birth<span style={{ color: 'red' }}>*</span>:
                            <input
                              type="date"
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Date of Birth"
                              required
                            />
                          </label>
                        </div>
                        <div className="col">
                          <label>
                            Aadhar Number<span style={{ color: 'red' }}>*</span>:
                            <input
                              type="text"
                              name="aadharNumber"
                              value={formData.aadharNumber}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Last 4 digits"
                              pattern="[0-9]{4}" // Restrict input to exactly 4 numeric characters
                              title="Aadhar Number should contain exactly 4 digits"
                              maxLength={4}
                              onKeyPress={(e) => {
                                const charCode = e.which ? e.which : e.keyCode;
                                if (charCode < 48 || charCode > 57) {
                                  e.preventDefault(); // Prevent entering non-numeric characters
                                }
                              }}
                              required
                            />
                          </label>
                        </div>


                      </div>
                      <div className="row mb-3">
                        <div className="col">
                          <label>
                            PAN Number:
                            <input
                              type="text"
                              name="panNumber"
                              value={formData.panNumber}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Last four digits"
                              pattern="[A-Za-z0-9]{4}" // Allow only alphanumeric characters and exactly 4 characters
                              title="PAN Number should be 4 alphanumeric characters"
                              maxLength={4}
                            />
                          </label>
                        </div>

                        <div className="col">
                          <label> Skills<span style={{ color: 'red' }}>*</span>:</label>
                          <Select
                            isMulti
                            name="skills"
                            options={allSkills.map(skill => ({ value: skill.id, label: skill.skillsName }))}
                            value={formData.skills.map(skillId => ({ value: skillId, label: allSkills.find(skill => skill.id === skillId).skillsName }))}
                            onChange={handleChange}
                            required
                          />

                        </div>

                      </div>

                    </div>
                  )}


                  {/* Educational Details Form */}
                  {activeTab === "educational" && (
                    <div
                      className={`tab-pane ${activeTab === "educational" ? "active" : ""
                        }`}
                    >
                      {/* College Detail Section */}
                      <div className="mb-4">

                        <h5>Graduation Detail </h5>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label>
                              College Name<span style={{ color: 'red' }}>*</span>:
                              <input
                                type="text"
                                name="graduationInstituteName"
                                value={formData.graduationInstituteName}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="College Name"
                                pattern="[A-Za-z0-9 ]+" // Allow only alphanumeric characters and spaces
                                title="College Name should contain only alphanumeric characters"
                                required
                              />
                            </label>
                          </div>

                          <div className="col-md-6">
                            <label>
                              Degree Name<span style={{ color: 'red' }}>*</span>:
                              <input
                                type="text"
                                name="graduationName"
                                value={formData.graduationName}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Degree Name"
                                pattern="[A-Za-z0-9 ]+" // Allow only alphanumeric characters and spaces
                                title="Degree Name should contain only alphanumeric characters"
                                required
                              />
                            </label>
                          </div>

                        </div>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label>
                              Degree Percentage<span style={{ color: 'red' }}>*</span>:
                              <input
                                type="text" // Change type to "text" to handle custom validation
                                name="graduationPercentage"
                                value={formData.graduationPercentage}
                                onChange={handleChange}
                                onKeyPress={(e) => {
                                  // Allow only numeric digits (0-9) and prevent other characters
                                  const pattern = /[0-9]/;
                                  if (!pattern.test(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                                className={`form-control ${formData.graduationPercentageError ? 'invalid-input' : ''}`}
                                placeholder="Degree Percentage"
                                maxLength={2} // Limit input to 2 characters
                                required
                              />
                            </label>
                            {formData.graduationPercentageError && (
                              <span className="error-message">{formData.graduationPercentageError}</span>
                            )}
                          </div>


                          <div className="col-md-6">
                            <label>
                              Stream<span style={{ color: 'red' }}>*</span>:
                              <input
                                type="text"
                                name="graduationStream"
                                value={formData.graduationStream}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Stream"
                                pattern="[A-Za-z]+" // Allow only alphabetic characters
                                title="Stream should contain only alphabetic characters"
                                required
                              />
                            </label>
                          </div>

                        </div>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label>
                              Degree Passing Year<span style={{ color: 'red' }}>*</span>:
                              <input
                                type="text"
                                name="graduationPassingYear"
                                value={formData.graduationPassingYear}
                                onChange={handleChange}
                                onKeyPress={(e) => {
                                  // Allow only numeric digits (0-9) and prevent other characters
                                  const pattern = /[0-9]/;
                                  if (!pattern.test(e.key) || e.target.value.length >= 4) {
                                    e.preventDefault();
                                  }
                                }}
                                className="form-control"
                                placeholder="Degree Passing Year"
                                pattern="[0-9]{4}" // Allow only 4 numeric characters
                                title="Degree Passing Year should contain exactly 4 numeric characters"
                                required
                              />
                            </label>
                          </div>


                        </div>
                        <div className="col-md-12">

                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => setShowPostGraduation(true)}
                          >
                            Add Post Graduation
                          </button>

                        </div>

                        {/* Post Graduation Detail Section */}
                        {showPostGraduation && (
                          <div className="row mb-4">
                            <div className="col-md-12">
                              <hr></hr>
                              <h5>Post Graduation Detail</h5>

                              {/* Post graduation detail fields */}
                              <div className="row mb-3">
                                <div className="col-md-6">
                                  <label>
                                    College Name:
                                    <input
                                      type="text"
                                      name="postgraduationInstituteName"
                                      value={formData.postgraduationInstituteName}
                                      onChange={handleChange}
                                      className="form-control"
                                      placeholder="College Name"
                                      pattern="[A-Za-z0-9 ]+" // Allow only alphanumeric characters and spaces
                                      title="College Name should contain only alphanumeric characters"
                                    />
                                  </label>
                                </div>

                                <div className="col-md-6">
                                  <label>
                                    Degree Name:
                                    <input
                                      type="text"
                                      name="postgraduationName"
                                      value={formData.postgraduationName}
                                      onChange={handleChange}
                                      className="form-control"
                                      placeholder="Degree Name"
                                      pattern="[A-Za-z0-9 ]+" // Allow only alphanumeric characters and spaces
                                      title="Degree Name should contain only alphanumeric characters"
                                    />
                                  </label>
                                </div>

                              </div>
                              <div className="row mb-3">
                                <div className="col-md-6">
                                  <label>
                                    Degree Percentage:
                                    <input
                                      type="text"
                                      name="postgraduationPercentage"
                                      value={formData.postgraduationPercentage}
                                      onChange={handleChange}
                                      onKeyPress={(e) => {
                                        // Allow only numeric digits and one decimal point, limit to 2 characters
                                        const pattern = /^[0-9.]$/;
                                        const value = e.target.value;
                                        if (!pattern.test(e.key) || value.includes('.') || value.length >= 3) {
                                          e.preventDefault();
                                        }
                                      }}
                                      className="form-control"
                                      placeholder="Degree Percentage"
                                      pattern="^\d+(\.\d+)?$" // Allow decimal or numeric values
                                      title="Degree Percentage should be a decimal or numeric value"
                                    />
                                  </label>
                                </div>


                                <div className="col-md-6">
                                  <label>
                                    Stream:
                                    <input
                                      type="text"
                                      name="postgraduationStream"
                                      value={formData.postgraduationStream}
                                      onChange={handleChange}
                                      className="form-control"
                                      placeholder="Stream"
                                      pattern="[A-Za-z]+" // Allow only alphabetic characters (letters)
                                      title="Stream should contain only alphabetic characters"
                                    />
                                  </label>
                                </div>

                              </div>
                              <div className="row mb-3">
                                <div className="col-md-6">
                                  <label>
                                    Degree Passing Year:
                                    <input
                                      type="text"
                                      name="postgraduationPassingYear"
                                      value={formData.postgraduationPassingYear}
                                      onChange={handleChange}
                                      onKeyPress={(e) => {
                                        // Allow only numeric digits and limit to 4 characters
                                        const pattern = /^[0-9]$/;
                                        const value = e.target.value;
                                        if (!pattern.test(e.key) || value.length >= 4) {
                                          e.preventDefault();
                                        }
                                      }}
                                      className="form-control"
                                      placeholder="Degree Passing Year"
                                      pattern="[0-9]{1,4}" // Allow 1 to 4 numeric characters
                                      title="Degree Passing Year should contain between 1 to 4 numeric characters"
                                    />
                                  </label>
                                </div>

                              </div>
                            </div>
                          </div>
                        )}

                      </div>
                      <hr></hr>


                      {/* High School Detail Section */}
                      <div className="mb-4">
                        <h5>High School Detail</h5>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label>
                              High School Name:
                              <input
                                type="text"
                                name="highSchoolName"
                                value={formData.highSchoolName}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="High School Name"
                                pattern="[A-Za-z0-9 ]+" // Allow alphanumeric characters and spaces
                                title="High School Name should contain only alphanumeric characters"
                              />
                            </label>
                          </div>

                          <div className="col-md-6">
                            <label>
                              High School Passing Year:
                              <input
                                type="text"
                                name="highSchoolPassingYear"
                                value={formData.highSchoolPassingYear}
                                onChange={handleChange}
                                onKeyPress={(e) => {
                                  const pattern = /[0-9]/;
                                  const value = e.target.value + e.key;
                                  if (!pattern.test(e.key) || value.length > 4) {
                                    e.preventDefault();
                                  }
                                }}
                                className="form-control"
                                placeholder="High School Passing Year"
                                pattern="[0-9]{4}" // Allow only 4 numeric characters
                                title="High School Passing Year should contain exactly 4 numeric characters"
                              />
                            </label>
                          </div>


                        </div>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label>
                              High School Percentage:
                              <input
                                type="text" // Change type to "text" for custom validation
                                name="highSchoolPercentage"
                                value={formData.highSchoolPercentage}
                                onChange={handleChange}
                                onKeyPress={(e) => {
                                  // Allow only numeric digits and limit to 2 characters
                                  const pattern = /[0-9]/;
                                  const value = e.target.value;
                                  if (!pattern.test(e.key) || value.length >= 2) {
                                    e.preventDefault();
                                  }
                                }}
                                className="form-control"
                                placeholder="High School Percentage"
                                pattern="[0-9]{1,2}" // Allow 1 to 2 numeric characters
                                title="High School Percentage should contain between 1 to 2 numeric characters"
                              />
                            </label>
                          </div>


                        </div>
                      </div>
                      <hr></hr>
                      {/* Secondary School Detail Section */}
                      <div className="mb-4">
                        <h5>Secondary School Detail</h5>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label>
                              Secondary School Name<span style={{ color: 'red' }}>*</span>::
                              <input
                                type="text"
                                name="secondarySchoolName"
                                value={formData.secondarySchoolName}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Secondary School Name"
                                pattern="[A-Za-z0-9 ]+" // Allow only alphanumeric characters and spaces
                                title="Secondary School Name should contain only alphanumeric characters"
                                required
                              />
                            </label>
                          </div>

                          <div className="col-md-6">
                            <label>
                              Secondary School Passing Year<span style={{ color: 'red' }}>*</span>:
                              <input
                                type="text"
                                name="secondarySchoolPassingYear"
                                value={formData.secondarySchoolPassingYear}
                                onChange={handleChange}
                                onKeyPress={(e) => {
                                  // Allow only numeric digits and limit to 4 characters
                                  const pattern = /[0-9]/;
                                  const value = e.target.value;
                                  if (!pattern.test(e.key) || value.length >= 4) {
                                    e.preventDefault();
                                  }
                                }}
                                className="form-control"
                                placeholder="Secondary School Passing Year"
                                pattern="[0-9]{4}" // Allow only 4 numeric characters
                                title="Secondary School Passing Year should contain exactly 4 numeric characters"
                                required
                              />
                            </label>
                          </div>

                        </div>
                        <div className="row mb-3">

                          <div className="col-md-6">
                            <label>
                              Secondary School Percentage <span style={{ color: 'red' }}>*</span>:
                              <input
                                type="text" // Change type to "text" for custom validation
                                name="secondarySchoolPercentage"
                                value={formData.secondarySchoolPercentage}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const pattern = /^[0-9]{0,2}(\.\d{0,2})?$/; // Allow up to 2 numeric digits and optional decimal values
                                  if (!pattern.test(value)) {
                                    return; // Exit the function if the input doesn't match the pattern
                                  }
                                  setFormData(prevState => ({
                                    ...prevState,
                                    secondarySchoolPercentage: value
                                  }));
                                }}
                                onKeyPress={(e) => {
                                  const pattern = /[0-9\.]/; // Allow only numeric digits and decimal point
                                  if (!pattern.test(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                                className="form-control"
                                placeholder="Secondary School Percentage"
                                required
                              />
                            </label>
                          </div>


                        </div>
                      </div>
                    </div>
                  )}
                  {/* Navigation buttons */}
                  {activeTab === "personal" && (
                    <div className="row mb-3">
                      <div className="col text-end">
                        <button
                          type="button"
                          className="btn btn-primary ms-auto"
                          onClick={handleNextButtonClick}
                          disabled={!Object.values(mandatoryFieldsCompleted).every(field => field)}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                  {activeTab === "educational" && (
                    <>
                      <div className="text-center">
                        <button
                          type="button"
                          className="btn btn-secondary "
                          onClick={() => setActiveTab("personal")}
                        >
                          Previous
                        </button>
                        <span>        </span>

                        <button type="submit" className="btn btn-primary ">
                          Submit
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </div>
            </div>
          </div>
        </Box>
      </Box>
    </>
  );
}

export default CandidateInfo;
