import React, { useState, useEffect } from 'react';
import './VendorList.css';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';
import Pagination from '@mui/material/Pagination';
import { Box, Modal, Stack } from '@mui/material';
import Swal from 'sweetalert2';

const API_URL = process.env.REACT_APP_API_URL;
console.log("API_URL",API_URL);
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#F8F9FA', // Light background color
  border: '2px solid #3498db', // Border color
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Box shadow
  borderRadius: '8px', // Border radius for rounded corners
  padding: '20px', // Padding
  textAlign: 'center', // Center-align text
  color: '#333', // Text color
};

function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(6);
 

  useEffect(() => {
    fetchVendorData();
  }, []);


  const deleteVendorDate = async (id) => {
    try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage

        const res = await axios.delete(`${API_URL}vendor/delete/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
        });

        // Show success message using SweetAlert if the deletion is successful
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Vendor deleted successfully!',
        });

        // Fetch updated vendor data after deletion
        fetchVendorData();
    } catch (err) {
        console.log(err);

        // Show error message using SweetAlert if deletion fails
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete vendor. Please try again later.',
        });
    }
};

  const fetchVendorData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${API_URL}vendor/getAll`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      
      setVendors(res?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}vendor/getVendor/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedVendor(res?.data || null);
      setOpen(true);
    } catch (err) {
      console.log(err);
    }
  };


  const handleSaveChanges = async () => {
    try {
      if (selectedVendor) {
        const { id, ...data } = selectedVendor;

        // Validation checks
        if (!validateFormData(data)) {
          return; // Exit if validation fails
        }

        const token = localStorage.getItem('token');
        const res = await axios.put(`${API_URL}vendor/updateVendor/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchVendorData();
        handleClose();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Vendor updated successfully!',
          customClass: {
            container: 'sweet-alert-container',
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const validateFormData = (data) => {
    if (!data.vendorName || !data.companyName || !data.contactNo || !data.address || !data.email) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'All fields are required!',
        customClass: {
          container: 'sweet-alert-container',
        },
      });
      return false;
    }

    // Validate contact number (numeric and 10 digits)
    const contactNoPattern = /^\d{10}$/;
    if (!contactNoPattern.test(data.contactNo)) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Contact number should be numeric and should have 10 digits!',
        customClass: {
          container: 'sweet-alert-container',
        },
      });
      return false;
    }
const deleteVendorDate = async (id) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    
            const res = await axios.delete(`${API_URL}vendor/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                }
            });
    
            // Show success message using SweetAlert if the deletion is successful
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Vendor deleted successfully!',
            });
    
            // Fetch updated vendor data after deletion
            fetchVendorData();
        } catch (err) {
            console.log(err);
    
            // Show error message using SweetAlert if deletion fails
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete vendor. Please try again later.',
            });
        }
    };
    // Validate email format
    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(data.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Email should be in proper format!',
        customClass: {
          container: 'sweet-alert-container',
        },
      });
      return false;
    }

    return true; // All validations passed
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVendors = vendors.slice(indexOfFirstItem, indexOfLastItem);

  const pageCount = Math.ceil(vendors.length / itemsPerPage);

  return (
    <main>
      <section className="content-section">
        <h2 className="section-title">Vendor List</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Vendor Name</th>
              <th>Company Name</th>
              <th>Contact No</th>
              <th>Address</th>
              <th>Created Time</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentVendors.map((vendor) => (
              <tr key={vendor.id}>
                <td>{vendor.vendorName}</td>
                <td>{vendor.companyName}</td>
                <td>{vendor.contactNo || 'N/A'}</td>
                <td>{vendor.address}</td>
                <td>{moment(vendor.createdTime).format('DD-MM-YYYY')}</td>
                <td>{vendor.email}</td>
                <td className="icons">
                  <Edit onClick={() => handleEdit(vendor.id)} />
                  <span className="button-separator"></span>
                  <Delete onClick={() => deleteVendorDate(vendor.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Stack spacing={2} direction="row" justifyContent="center" marginTop={2}>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            color="primary"
          />
        </Stack>
        {selectedVendor && (
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className="edit-form-container">
                <h2>Edit Vendor</h2>
                <hr></hr>
                <form>
                  <div className="form-group align-left">
                    <label htmlFor="vendorName" style={{ fontWeight: 'bold' }}>
                      Vendor Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="vendorName"
                      value={selectedVendor.vendorName}
                      onChange={(e) => setSelectedVendor({ ...selectedVendor, vendorName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group align-left">
                    <label htmlFor="companyName" style={{ fontWeight: 'bold' }}>
                      Company Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="companyName"
                      value={selectedVendor.companyName}
                      onChange={(e) => setSelectedVendor({ ...selectedVendor, companyName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group align-left">
                    <label htmlFor="contactNo" style={{ fontWeight: 'bold' }}>
                      Contact No
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="contactNo"
                      value={selectedVendor.contactNo}
                      onChange={(e) => setSelectedVendor({ ...selectedVendor, contactNo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group align-left">
                    <label htmlFor="address" style={{ fontWeight: 'bold' }}>
                      Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      value={selectedVendor.address}
                      onChange={(e) => setSelectedVendor({ ...selectedVendor, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group align-left">
                    <label htmlFor="email" style={{ fontWeight: 'bold' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={selectedVendor.email}
                      onChange={(e) => setSelectedVendor({ ...selectedVendor, email: e.target.value })}
                      required
                    />
                  </div>
                  <button type="button" onClick={handleSaveChanges} className="btn btn-primary">
                    Save Changes
                  </button>
                </form>
              </div>
            </Box>
          </Modal>
        )}
      </section>
    </main>
  );
}

export default VendorList;
