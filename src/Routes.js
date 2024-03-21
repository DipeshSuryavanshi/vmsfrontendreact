import React from 'react';
import { BrowserRouter as Router, Route, Routes as RouterRoutes, Navigate } from 'react-router-dom';
import AdminLogin from './Pages/Admin-Login';
import Dashboard from './Pages/Dashboard';
import VendorList from './Components/VendorList';
import VendorRegistration from './Pages/VendorRegistration';

import CandidateList from './Components/CandidateList';
import CandidateInfo from './Pages/CandidateInfo';
import Header from './Components/Header';
import AddSkillForm from './Pages/AddSkillForm';
import CandidateProfile from './Pages/CandidateProfile';

function isLoggedIn() {
  const token = localStorage.getItem('token');
  return token !== null && token !== undefined;
}

const Routes = () => {
  return (
    <Router>
      <RouterRoutes>
        {/* Define a top-level route for AdminLogin */}
        <Route path="/" element={<AdminLogin />} />

        {/* Conditional rendering based on isLoggedIn */}
        {isLoggedIn() ? (
          <>
            {/* Define a top-level route for Dashboard */}
            <Route path="/dashboard" element={<Dashboard />}>
              {/* Nested routes under Dashboard */}
              <Route path="vendor-list" element={<VendorList />} />
              {/* <Route path="register-candidate" element={<CandidateRegistration />} /> */}
              <Route path="register-vendor" element={<VendorRegistration />} />
              <Route path="candidate-list" element={<CandidateList />} />
              <Route path="candidate-info" element={<CandidateInfo />} />
              <Route path="candidate-profile" element={<CandidateProfile />} />
              <Route path="add-skill" element={<AddSkillForm />} />
            </Route>
            
          </>
        ) : (
          // If not logged in, redirect to the login page
          <Route path="*" element={<Navigate to="/" />} />
        )}
        
      </RouterRoutes>
    </Router>
  );
};

export default Routes;
