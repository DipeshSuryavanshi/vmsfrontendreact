import React, { useState,useEffect} from "react";
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
    linkedinUrl:"",
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
      setFormData(prevState => ({
        ...prevState,
        [name]: value
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
  
  
  // const handleChange = (e) => {
  //   if (e.target) {
  //     const { name, value } = e.target;
  //     let newValue = value;
  //     switch (name) {
  //       case "graduationInstituteName":
  //       case "postgraduationInstituteName":
  //       case "highSchoolName":
  //       case "secondarySchoolName":
  //         newValue = value.replace(/[^a-zA-Z\s]/g, "");
  //         break;
  //       case "graduationName":
  //       case "postgraduationName":
  //         newValue = value.replace(/[^a-zA-Z0-9]/g, "");
  //         break;
  //       case "graduationPassingYear":
  //       case "postgraduationPassingYear":
  //       case "highSchoolPassingYear":
  //       case "secondarySchoolPassingYear":
  //         newValue = value.replace(/[^\d]/g, "");
  //         break;
  //       case "graduationPercentage":
  //       case "postgraduationPercentage":
  //       case "highSchoolPercentage":
  //       case "secondarySchoolPercentage":
  //         newValue = value.replace(/[^0-9.]/g, "");
  //         break;
  //       case "secondarySchoolName":
  //         newValue = value.replace(/[0-9.]/g, "");
  //         break;
  //       case "firstName":
  //       case "lastName":
  //       case "motherName":
  //       case "fatherName":
  //         newValue = value.replace(/[^a-zA-Z]/g, "");
  //         break;
  //       case "whatsappNumber":
  //       case "contactNo":
  //         newValue = value.replace(/[^\d]/g, "").slice(0, 10);
  //         break;
  //       case "aadharNumber":
  //         newValue = value.replace(/[^\d]/g, "").slice(0, 12);
  //         break;
  //       case "panNumber":
  //         newValue = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 10);
  //         break;
  //       default:
  //         break;
  //     }

  //     setFormData({
  //       ...formData,
  //       [name]: newValue,
  //     });
  //   } else { // If the event target is from the Select component
  //     const selectedOptions = e;
  //     const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
  //     setFormData({
  //       ...formData,
  //       skills: selectedValues,
  //     });
  //   }
  // };
  
  

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
        }).then(()=>{
          navigate("/dashboard/candidate-list");
        });

       
        // You can perform additional actions here if needed after successful registration
      } else {
        // Handle the case where registration was not successful
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: "Failed to register the candidate. Please try again later.",
        });
      }
    } catch (error) {
      // Handle any network errors or exceptions
      console.error("Error registering candidate:", error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "Failed to register the candidate. Please try again later.",
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
                className={`nav-link ${
                  activeTab === "personal" ? "active" : ""
                }`}
                
                onClick={() => setActiveTab("personal")}
               
              >
                Personal Details
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "educational" ? "active" : ""
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
                  className={`tab-pane ${
                    activeTab === "personal" ? "active" : ""
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
                      required
                    />
                  </label>
                </div>
                <div className="col">
                  <label >
                  Last Name<span style={{ color: 'red' }}>*</span>:
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Last Name"
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
                    />
                  </label>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label>
                    WhatsApp Number:
                    <input
                      type="number "
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="WhatsApp Number"
                    />
                  </label>
                </div>
                <div className="col">
                  <label>
                    Linkdin Id:
                    <input
                      type="text"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Linkdin Id"
                    />
                  </label>
                </div>
              </div>
              
                  <div className="row mb-3">
                  <div className="col">
                      <label>
                      Total Experience<span style={{ color: 'red' }}>*</span>:
                        <input
                          type="number"
                          name="totalExperience"
                          value={formData.totalExperience}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Total Experience"
                            required
                        />
                      </label>
                    </div>
                    <div className="col">
                      <label >
                      Contact Number<span style={{ color: 'red' }}>*</span>:
                        <input
                          type="number  "
                          name="contactNo"
                          value={formData.contactNo}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Contact Number"
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
                        />
                      </label>
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
                          type="number"
                          name="aadharNumber"
                          value={formData.aadharNumber}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Aadhar Number"
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
                          placeholder="PAN Number"
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
/>

      </div>
                    
                  </div>
                  
                </div>
              )}

              {/* Educational Details Form */}
{/* Educational Details Form */}
{activeTab === "educational" && (
  <div
    className={`tab-pane ${
      activeTab === "educational" ? "active" : ""
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
            required    />
          </label>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <label>
            Degree Percentage<span style={{ color: 'red' }}>*</span>:
            <input
              type="number  "
              name="graduationPercentage"
              value={formData.graduationPercentage}
              onChange={handleChange}
              className="form-control"
              placeholder="Degree Percentage"
           required
           />
          </label>
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
              type="number  "
              name="graduationPassingYear"
              value={formData.graduationPassingYear}
              onChange={handleChange}
              className="form-control"
              placeholder="Degree Passing Year"
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
              className="form-control"
              placeholder="Degree Percentage"
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
              className="form-control"
              placeholder="Degree Passing Year"
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
            High School Name<span style={{ color: 'red' }}>*</span>:
            <input
              type="text"
              name="highSchoolName"
              value={formData.highSchoolName}
              onChange={handleChange}
              className="form-control"
              placeholder="High School Name"
            required  
            />
          </label>
        </div>
        <div className="col-md-6">
          <label>
            High School Passing Year<span style={{ color: 'red' }}>*</span>:
            <input
              type="number"
              name="highSchoolPassingYear"
              value={formData.highSchoolPassingYear}
              onChange={handleChange}
              className="form-control"
              placeholder="High School Passing Year"
                        required
            />
          </label>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <label>
            High School Percentage<span style={{ color: 'red' }}>*</span>:
            <input
              type="number"
              name="highSchoolPercentage"
              value={formData.highSchoolPercentage}
              onChange={handleChange}
              className="form-control"
              placeholder="High School Percentage"
                        required
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
            Secondary School Name:
            <input
              type="text"
              name="secondarySchoolName"
              value={formData.secondarySchoolName}
              onChange={handleChange}
              className="form-control"
              placeholder="Secondary School Name"
                        
            />
          </label>
        </div>
        <div className="col-md-6">
          <label>
            Secondary School Passing Year:
            <input
              type="number"
              name="secondarySchoolPassingYear"
              value={formData.secondarySchoolPassingYear}
              onChange={handleChange}
              className="form-control"
              placeholder="Secondary School Passing Year"
                        
            />
          </label>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <label>
            Secondary School Percentage:
            <input
              type="number  "
              name="secondarySchoolPercentage"
              value={formData.secondarySchoolPercentage}
              onChange={handleChange}
              className="form-control"
              placeholder="Secondary School Percentage"
                         
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
