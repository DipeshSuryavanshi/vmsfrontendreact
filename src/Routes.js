import React from 'react';
import { BrowserRouter as Router, Route, Routes as RouterRoutes, Navigate } from 'react-router-dom';
import AdminLogin from './Pages/Admin-Login';
import Dashboard from './Pages/Dashboard';
import VendorList from './Components/VendorList';
import VendorRegistration from './Pages/VendorRegistration';
import CandidateRegistration from './Pages/CandidateRegistration';

const Routes = () => {
  return (
    <Router>
      <RouterRoutes>
        {/* Define a top-level route for AdminLogin */}
        <Route path="/" element={<AdminLogin />} />

        {/* Define a top-level route for Dashboard */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Nested routes under Dashboard */}
          <Route path="vendor-list" element={<VendorList />} />
          <Route path="register-caditate" element={<CandidateRegistration />} />
          <Route path="register-vendor" element={<VendorRegistration />} />
        </Route>
         
         
        
      </RouterRoutes>
    </Router>
  );
};

export default Routes;
// import React from 'react'
// import { BrowserRouter  ,Route,Routes as Routess } from 'react-router-dom'
// import Dashboard from './Pages/Dashboard'
// import VendorList from './Components/VendorList'
// import VendorRegistration from './Pages/VendorRegistration'
// import CandidateRegistration from './Pages/CandidateRegistration'

// const Routes = () => {
//   return (
//     <div>
//       <BrowserRouter>
//       <Routess>
//         <Route path='/' element={<Dashboard/>}/>
//         <Route path='/canditate-list' element={<VendorList/>}/>
//         <Route path='/register-canditate' element={<VendorRegistration/>}/>
//         <Route path='/register-caditate' element={<CandidateRegistration/>}/>
//     </Route>
//       </Routess>
//       </BrowserRouter>
//     </div>
//   )
// }

// export default Routes