import React, { useState, useEffect } from "react";
import SideBar from "../Components/SideBar";
import Box from "@mui/material/Box";
import NavBar from "../Components/NavBar";

import { Link } from "react-router-dom";

import ProfileTabs from "./ProfileTabs";

// import { motion } from "framer-motion";

function PersonalInfo() {
  const [errors, setErrors] = useState({});
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [fatherContactNumber, setFatherContactNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [personalContactNumber, setPersonalContactNumber] = useState("");
  const [personalMailId, setPersonalMailId] = useState("");
  const [loggedIn, setLoggedIn] = useState(true);
  const [isImageUploadModalOpen, setImageUploadModalOpen] = useState(false);

  const openImageUploadModal = () => {
    setImageUploadModalOpen(true);
  };

  const closeImageUploadModal = () => {
    setImageUploadModalOpen(false);
  };

  const validate = () => {
    const newErrors = {};

    if (!fatherName) {
      newErrors.fatherName = "Father Name is required";
    }

    if (!motherName) {
      newErrors.motherName = "Mother Name is required";
    }

    if (!fatherContactNumber) {
      newErrors.fatherContactNumber = "Father No. is required";
    } else if (!/^\d{10}$/.test(fatherContactNumber)) {
      newErrors.fatherContactNumber = "Father No. must be 10 digits";
    }

    if (!panNumber) {
      newErrors.panNumber = "Pan Number is required";
    }

    if (!aadharNumber) {
      newErrors.aadharNumber = "Aadhar Number is required";
    }

    if (!currentAddress) {
      newErrors.currentAddress = "Current Address is required";
    }

    if (!permanentAddress) {
      newErrors.permanentAddress = "Permanent Address is required";
    }

    if (!personalContactNumber) {
      newErrors.personalContactNumber = "Personal No. is required";
    } else if (!/^\d{10}$/.test(personalContactNumber)) {
      newErrors.personalContactNumber = "Personal No. must be 10 digits";
    }

    if (!personalMailId) {
      newErrors.personalMailId = "Personal Mail is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem("user"));

//     if (userData) {
//       setUserId(userData.user_id);
//       setUserName(userData.user_name);

//       ProfileService.getPersonalDetailById(userData.user_id)
//         .then((response) => {
//           const personalDetails = response.data;
//           setFatherName(personalDetails.fatherName || "");
//           setMotherName(personalDetails.motherName || "");
//           setFatherContactNumber(personalDetails.fatherContactNumber || "");
//           setPanNumber(personalDetails.panNumber || "");
//           setAadharNumber(personalDetails.aadharNumber || "");
//           setCurrentAddress(personalDetails.currentAddress || "");
//           setPermanentAddress(personalDetails.permanentAddress || "");
//           setPersonalContactNumber(personalDetails.personalContactNumber || "");
//           setPersonalMailId(personalDetails.personalMailId || "");
//         })
//         .catch((error) => {
//           console.error("Error fetching Personal details:", error);
//         });
//     }
//   }, []);

  const handleFatherNameChange = (e) => {
    setFatherName(e.target.value);
    if (errors.fatherName) {
      setErrors((prevErrors) => ({ ...prevErrors, fatherName: "" }));
    }
  };

  const handleMotherNameChange = (e) => {
    setMotherName(e.target.value);
    if (errors.motherName) {
      setErrors((prevErrors) => ({ ...prevErrors, motherName: "" }));
    }
  };

  const handleFatherContactNumberChange = (e) => {
    const inputValue = e.target.value;
    setFatherContactNumber(inputValue);

    if (inputValue.length > 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fatherContactNumber: "Father No. must be 10 digits",
      }));
    } else if (errors.fatherContactNumber) {
      // Clear the error message if the input is valid
      setErrors((prevErrors) => ({
        ...prevErrors,
        fatherContactNumber: "",
      }));
    }
  };

  const handlePersonalContactNumberChange = (e) => {
    const inputValue = e.target.value;
    setPersonalContactNumber(inputValue);

    if (inputValue.length > 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        personalContactNumber: "Personal No. must be 10 digits",
      }));
    } else if (errors.personalContactNumber) {
      // Clear the error message if the input is valid
      setErrors((prevErrors) => ({
        ...prevErrors,
        personalContactNumber: "",
      }));
    }
  };

  const handlePanNumberChange = (e) => {
    setPanNumber(e.target.value);
    if (errors.panNumber) {
      setErrors((prevErrors) => ({ ...prevErrors, panNumber: "" }));
    }
  };

  const handleAadharNumberChange = (e) => {
    setAadharNumber(e.target.value);
    if (errors.aadharNumber) {
      setErrors((prevErrors) => ({ ...prevErrors, aadharNumber: "" }));
    }
  };

  const handleCurrentAddressChange = (e) => {
    setCurrentAddress(e.target.value);
    if (errors.currentAddress) {
      setErrors((prevErrors) => ({ ...prevErrors, currentAddress: "" }));
    }
  };

  const handlePermanentAddressChange = (e) => {
    setPermanentAddress(e.target.value);
    if (errors.permanentAddress) {
      setErrors((prevErrors) => ({ ...prevErrors, permanentAddress: "" }));
    }
  };

//   const handlePersonalMailIdChange = (e) => {
//     setPersonalMailId(e.target.value);
//     if (errors.personalMailId) {
//       setErrors((prevErrors) => ({ ...prevErrors, personalMailId: "" }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // if (validate()) {
//     try {
//       await ProfileService.submitPersonalDetails(
//         fatherName,
//         motherName,
//         fatherContactNumber,
//         panNumber,
//         aadharNumber,
//         currentAddress,
//         permanentAddress,
//         personalContactNumber,
//         personalMailId,
//         userId,
//         userName
//       );
//       window.location.reload();

//       console.log("Personal Details submitted successfully!");

//       setFatherName("");
//       setMotherName("");
//       setFatherContactNumber("");
//       setPanNumber("");
//       setAadharNumber("");
//       setCurrentAddress("");
//       setPermanentAddress("");
//       setPersonalContactNumber("");
//       setPersonalMailId("");
//       setUserId("");
//       setUserName("");
//     } catch (error) {
//       console.error("Error submitting Personal Details:", error);
//     }
//   };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));

    if (userData) {
      setUserId(userData.user_id);
      setUserName(userData.user_name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <>
      <NavBar />
      <Box height={100} />
      <Box sx={{ display: "flex" }}>
        <SideBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <div>
            {/* <UploadProfileImage /> */}

            <div className="profile-container">
              <ProfileTabs />
              
              
                <span
                  style={{
                    marginLeft: "2%",
                    marginTop: "-15px",
                    color: "#566a7f",
                  }}
                >
                  Enter Your Personal Info.
                </span>

                {/* <div>
            
              <button className="profile-image-link" onClick={openImageUploadModal}>
                Upload Image
              </button>
           
          </div> */}
                <div className="profile-inputs-container">
                  <div className="profile-input-left">
                    <label className="profileLable">
                      Father name
                      <br />
                      <input
                        className="profile-input"
                        onChange={handleFatherNameChange}
                        value={fatherName}
                      />
                      {/* {errors.fatherName && (
                    <span className="validation-error">
                      {errors.fatherName}
                    </span>
                  )} */}
                    </label>
                    {/* <div>
                  <label className="profileLable">
                    Father Contact No. <br />
                    <input
                      className="profile-input"
                      type="number"
                      onChange={handleFatherContactNumberChange}
                      value={fatherContactNumber}
                    />
                    {errors.fatherContactNumber && (
                      <span className="validation-error">
                        {errors.fatherContactNumber}
                      </span>
                    )}
                  </label>
                </div> */}
                    <div>
                      <label className="profileLable">
                        Pan Card <br />
                        <input
                          className="profile-input"
                          onChange={handlePanNumberChange}
                          value={panNumber}
                        />
                        {/* {errors.panNumber && (
                      <span className="validation-error">
                        {errors.panNumber}
                      </span>
                    )} */}
                      </label>
                    </div>
                    <div>
                      <label className="profileLable">
                        Permanent Address <br />
                        <input
                          className="profile-input"
                          onChange={handlePermanentAddressChange}
                          value={permanentAddress}
                        />
                        {/* {errors.permanentAddress && (
                      <span className="validation-error">
                        {errors.permanentAddress}
                      </span>
                    )} */}
                      </label>
                    </div>
                    */
                  </div>

                  <div className="profile-input-right">
                    <label className="profileLable">
                      Mother Name <br />
                      <input
                        className="profile-input"
                        onChange={handleMotherNameChange}
                        value={motherName}
                      />
                      {/* {errors.motherName && (
                    <span className="validation-error">
                      {errors.motherName}
                    </span>
                  )} */}
                    </label>
                    <div>
                      <label className="profileLable">
                        Aadhar Card <br />
                        <input
                          className="profile-input"
                          onChange={handleAadharNumberChange}
                          type="number"
                          value={aadharNumber}
                        />
                        {/* {errors.aadharNumber && (
                      <span className="validation-error">
                        {errors.aadharNumber}
                      </span>
                    )} */}
                      </label>
                    </div>
                    <div>
                      <label className="profileLable">
                        Current Address <br />
                        <input
                          className="profile-input"
                          onChange={handleCurrentAddressChange}
                          value={currentAddress}
                        />
                        {/* {errors.currentAddress && (
                      <span className="validation-error">
                        {errors.currentAddress}
                      </span>
                    )} */}
                      </label>
                    </div>
                    <div>
                      <label className="profileLable">
                        Personal Contact No.
                        <br />
                        <input
                          className="profile-input"
                          type="number"
                          onChange={handlePersonalContactNumberChange}
                          value={personalContactNumber}
                        />
                        {/* {errors.personalContactNumber && (
                      <span className="validation-error">
                        {errors.personalContactNumber}
                      </span>
                    )} */}
                      </label>
                    </div>
                  </div>
                </div>
                <hr className="profilehr" />
               
                <div>
                  {/* <button className="profile-submit-btn" onClick={handleSubmit}>
                    Submit
                  </button> */}
                </div>
             
              {/* <a
              href="/TimeSheet"
              className="Education-back-link"
            >
              Back To TimeSheet
            </a> */}

              <Link to="/BankDetails">
                <button className="profile-next-btn">Next</button>
              </Link>
            </div>
          </div>
        </Box>
      </Box>
      {/* {isImageUploadModalOpen && (
        <UploadProfileImage onClose={closeImageUploadModal} />
      )} */}
    </>
  );
}

export default PersonalInfo;
