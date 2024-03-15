import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import './NavBar.css'; // Import your CSS file

const NavBar = () => {
  return (
    <>
      <div className="collapse" id="navbarToggleExternalContent" data-bs-theme="dark">
        <div className="bg-dark p-4">
          <h5 className="text-body-emphasis h4">Collapsed content</h5>
          <span className="text-body-secondary">Toggleable via the navbar brand.</span>
        </div>
      </div>
      <Navbar expand="lg" variant="dark" bg="primary"> {/* Change bg="dark" to bg="primary" */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Add any Nav items here if needed */}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default NavBar;
