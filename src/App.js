// App.js
import React from 'react';
import Routes from './Routes';
// import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
// import './App.css';
// import AdminLogin from './Pages/Admin-Login'; 
// import Dashboard from './Pages/Dashboard'; 
// import VendorRegistration from './Pages/VendorRegistration';
import "../src/assets/global.css"





function App() {
  return (
    <div className="App">
      {/* <Router>
        <Routes>
          <Route path="/Admin-login" element={<AdminLogin />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/VendorRegistration" element={<VendorRegistration />} />
          
          <Route path="/" element={<Navigate to="/Admin-Login"/>}/>
          
       
  
        </Routes>
      </Router> */}
      <Routes/>
    </div>
  );
}

export default App;
