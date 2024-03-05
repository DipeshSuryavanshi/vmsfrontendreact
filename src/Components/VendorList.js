import React, { useState,useEffect} from 'react';
import './VendorList.css';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';
import Pagination from '@mui/material/Pagination';
import { Box, Modal, Stack } from '@mui/material';

import Swal from 'sweetalert2';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#F8F9FA',  // Light background color
    border: '2px solid #3498db',  // Border color
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // Box shadow
    borderRadius: '8px',  // Border radius for rounded corners
    padding: '20px',  // Padding
    textAlign: 'center',  // Center-align text
    color: '#333',  // Text color
  };
  
function VendorList() {
    const [vendors, setVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false)
    const [itemsPerPage, setItemsPerPage] = useState(2);

    useEffect(() => {
        fetchVendorData();
    }, []);


    const fetchVendorData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8082/vendor/getAll', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setVendors(res?.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    // const fetchVendorData = async () => {
    //     try {
            
    //         const res = await axios.get('http://localhost:8081/vendor/getAll')
    //         setVendors(res?.data || []);
    //     } 
    //     catch (err) {
    //         console.log(err);
    //     }
    // };

    const updateVendorDate = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`http://localhost:8082/vendor/update/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                }
            });
            fetchVendorData();
        } catch (err) {
            console.log(err);
        }
    };
    const deleteVendorDate = async (id) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    
            const res = await axios.delete(`http://localhost:8082/vendor/delete/${id}`, {
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
    
    

    const handleEdit = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:8082/vendor/getVendor/${id}`,{
                headers: {
                    'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                }
            });
            setSelectedVendor(res?.data || null);
          handleOpen() 
        } catch (err) {
            console.log(err);
        }
    };

    
    const handleSaveChanges = async () => {
        try {
            if (selectedVendor) {
                const { id, ...data } = selectedVendor; // Assuming selectedVendor contains the updated data
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.put(`http://localhost:8082/vendor/updateVendor/${id}`, data, {
                        headers: {
                            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                        }
                    });
                    fetchVendorData();
                    handleClose()
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Vendor updated successfully!',
                    });
                } catch (err) {
                    console.log(err);
                }
            }
        } catch (err) {
            console.log(err);
        }
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
                {/* Vendor list table */}
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
                                <td>{moment(vendor.createdTime).format("DD-MM-YYYY")}</td>
                                <td>{vendor.email}</td>
                                <td className='icons'>
                                    {/* Edit button */}
                                    <Edit onClick={() => handleEdit(vendor.id)} />
                                    <span className="button-separator"></span>
                                    {/* Delete button */}
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
                {/* Edit Form */}
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
                <label htmlFor="vendorName"style={{ fontWeight: 'bold' }}>Vendor Name</label>
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
                <label htmlFor="companyName"style={{ fontWeight: 'bold' }}>Company Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="companyName"
                    value={selectedVendor.companyName}
                    onChange={(e) => setSelectedVendor({ ...selectedVendor, companyName: e.target.value })}
                />
            </div>
            <div className="form-group align-left">
                <label htmlFor="contactNo"style={{ fontWeight: 'bold' }}>Contact No</label>
                <input
                    type="text"
                    className="form-control"
                    id="contactNo"
                    value={selectedVendor.contactNo}
                    onChange={(e) => setSelectedVendor({ ...selectedVendor, contactNo: e.target.value })}
                />
            </div>
            <div className="form-group align-left"style={{ fontWeight: 'bold' }}>
                <label htmlFor="address">Address</label>
                <input
                    type="text"
                    className="form-control"
                    id="address"
                    value={selectedVendor.address}
                    onChange={(e) => setSelectedVendor({ ...selectedVendor, address: e.target.value })}
                />
            </div>
            <div className="form-group align-left"style={{ fontWeight: 'bold' }}>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={selectedVendor.email}
                    onChange={(e) => setSelectedVendor({ ...selectedVendor, email: e.target.value })}
                />
            </div>
            <button type="button" onClick={handleSaveChanges} className="btn btn-primary">Save Changes</button>
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

