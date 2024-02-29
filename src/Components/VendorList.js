import React, { useState, useEffect } from 'react';
import './VendorList.css';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';

import { Box, Modal, Stack } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Swal from 'sweetalert2';

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
    const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(2);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        fetchVendorData();
    }, []);

    const fetchVendorData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8081/vendor/getAll', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setVendors(res?.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    const updateVendorDate = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`http://localhost:8081/vendor/update/${id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchVendorData();
        } catch (err) {
            console.log(err);
        }
    };

    const deleteVendorDate = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`http://localhost:8081/vendor/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Vendor deleted successfully!',
            });

            fetchVendorData();
        } catch (err) {
            console.log(err);

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
            const res = await axios.get(`http://localhost:8081/vendor/getVendor/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSelectedVendor(res?.data || null);
            handleOpen();
        } catch (err) {
            console.log(err);
        }
    };

    const handleSaveChanges = async () => {
        try {
            if (selectedVendor) {
                const { id, ...data } = selectedVendor;
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.put(`http://localhost:8081/vendor/updateVendor/${id}`, data, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    fetchVendorData();
                    handleClose();
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
                                        <label htmlFor="vendorName" style={{ fontWeight: 'bold' }}>Vendor Name</label>
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
                                        <label htmlFor="companyName" style={{ fontWeight: 'bold' }}>Company Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="companyName"
                                            value={selectedVendor.companyName}
                                            onChange={(e) => setSelectedVendor({ ...selectedVendor, companyName: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group align-left">
                                        <label htmlFor="contactNo" style={{ fontWeight: 'bold' }}>Contact No</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="contactNo"
                                            value={selectedVendor.contactNo}
                                            onChange={(e) => setSelectedVendor({ ...selectedVendor, contactNo: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group align-left" style={{ fontWeight: 'bold' }}>
                                        <label htmlFor="address">Address</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="address"
                                            value={selectedVendor.address}
                                            onChange={(e) => setSelectedVendor({ ...selectedVendor, address: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group align-left" style={{ fontWeight: 'bold' }}>
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
