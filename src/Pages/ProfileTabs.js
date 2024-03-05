import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "../App.css";

function ProfileTabs() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(getInitialTab());

  function getInitialTab() {
    const path = location.pathname;
    if (path.includes("/PersonalInfo")) return "personal";
    if (path.includes("/BankDetails")) return "bank";
    if (path.includes("/EducationProfile")) return "education";
    return "";
  }

  const handleTabChange = (event, tabName) => {
    setActiveTab(tabName);
  };

  return (
    <>
      <h1 style={{ color: "#523c8b" }}>Complete Your Profile</h1>
      <div className="profile-tabs-container">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
        >
          <Tab
            label="Personal Details"
            value="personal"
            component={NavLink}
            to="/PersonalInfo"
            className="profile-tab-btn"
            style={{
              color: activeTab === "personal" ? "#523c8b" : "gray",
            }}
          />
          <Tab
            label="Bank Details"
            value="bank"
            component={NavLink}
            to="/BankDetails"
            className="profile-tab-btn"
            style={{
              color: activeTab === "bank" ? "#523c8b" : "gray",
            }}
          />
          <Tab
            label="Education Details"
            value="education"
            component={NavLink}
            to="/EducationProfile"
            className="profile-tab-btn"
            style={{
              color: activeTab === "education" ? "#523c8b" : "gray",
            }}
          />
        </Tabs>
      </div>
      <br />
      <hr className="profilehr" /> <br />
    </>
  );
}

export default ProfileTabs;
