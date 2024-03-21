import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Delete, Edit } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { Box, Modal, Stack } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Select from 'react-select';

const API_URL = process.env.REACT_APP_API_URL;
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#F8F9FA',
    border: '2px solid #3498db',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    color: '#333',
};

function CandidateList() {
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [skillOptions, setSkillOptions] = useState([]);



    const fetchSkillOptions = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}skill/getAllSkills`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSkillOptions(res?.data || []);
        } catch (err) {
            console.log(err);
        }
    };
    const fetchCandidateData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}candidate/getAll`,
                {
                    headers:
                        { 'Authorization': `Bearer ${token}` }
                });
            setCandidates(res?.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        // fetchSkillOptions();
        fetchCandidateData();

    }, []);
    useEffect(() => {
        fetchSkillOptions();
        // fetchCandidateData();

    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);





    // Validation function for the form fields
    const validateFormData = (data) => {
        if (!data.firstName || !data.lastName || !data.contactNo || !data.address || !data.totalExperience || !data.dateOfBirth) {
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

        // Validation for first name and last name (should not contain numeric values)
        const namePattern = /^[a-zA-Z]+$/;
        if (!namePattern.test(data.firstName) || !namePattern.test(data.lastName)) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'First name and last name should not contain numeric values!',
                customClass: {
                    container: 'sweet-alert-container',
                },

            });
            return false;
        }

        // Validation for contact number (should be numeric and have 10 digits)
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

        // Validation for overall experience (should be numeric)
        const experiencePattern = /^\d+$/;
        if (!experiencePattern.test(data.totalExperience)) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Overall experience should be numeric!',
                customClass: {
                    container: 'sweet-alert-container',
                },
            });
            return false;
        }

        // All validations passed
        return true;
    };

    const deleteCandidateData = async (id) => {
        try {
            // Show confirmation dialog using SweetAlert
            const confirmation = await Swal.fire({
                icon: 'warning',
                title: 'Are you sure?',
                text: 'You are about to delete this candidate. This action cannot be undone.',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            // Proceed with deletion if user confirms
            if (confirmation.isConfirmed) {
                const token = localStorage.getItem('token');
                const res = await axios.delete(`${API_URL}candidate/delete/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Show success message using SweetAlert if the deletion is successful
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Candidate deleted successfully!',
                });

                // Fetch updated candidate data after deletion
                fetchCandidateData();
            }
        } catch (err) {
            console.log(err);

            // Show error message using SweetAlert if deletion fails
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete candidate. Please try again later.',
            });
        }
    };

    const handleEdit = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}candidate/getCandidate/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSelectedCandidate(res?.data || null);
            // Set selected skills for the candidate
            setSelectedSkills(res?.data?.skills.map(skill => ({ value: skill, label: skill })) || []);
            handleOpen();
        } catch (err) {
            console.log(err);
        }
    };

    const handleSaveChanges = async () => {
        try {
            if (selectedCandidate) {
                const { id, ...data } = selectedCandidate;
                // Update the data object with the selected skills
                data.skills = selectedSkills.map(skill => skill.label);

                // Validate form data
                if (!validateFormData(data)) {
                    return;
                }

                const token = localStorage.getItem('token');
                const res = await axios.put(`${API_URL}candidate/updateCandidate/${id}`, data,
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                fetchCandidateData();
                handleClose();
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Candidate updated successfully!',
                });
            }
        } catch (err) {
            console.log(err);
        }
    };


    // Change page
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Logic to get current candidates based on pagination
    const indexOfLastCandidate = currentPage * itemsPerPage;
    const indexOfFirstCandidate = indexOfLastCandidate - itemsPerPage;
    const currentCandidates = candidates.slice(indexOfFirstCandidate, indexOfLastCandidate);

    const pageCount = Math.ceil(candidates.length / itemsPerPage);

    return (
        <main>
            <section className="content-section">
                <h2 className="section-title">Candidate List</h2>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Candidate Name</th>
                            <th>Contact No</th>
                            <th>Address</th>
                            <th>Overall Experience</th>
                            <th>Skill</th>
                            <th>Date of Birth</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCandidates.map((candidate) => (
                            <tr key={candidate.id}>
                                <td>{candidate.firstName + ' ' + candidate.lastName}</td>
                                <td>{candidate.contactNo || 'N/A'}</td>
                                <td>{candidate.address}</td>
                                <td>{candidate.totalExperience}</td>
                                <td>{candidate.skills.join(", ")}</td>
                                <td>{moment(candidate.dateOfBirth).format("DD-MM-YYYY")}</td>
                                <td>{candidate.email}</td>
                                <td className='icons'>
                                    <Edit onClick={() => handleEdit(candidate.id)} />
                                    <span className="button-separator"></span>
                                    <Delete onClick={() => deleteCandidateData(candidate.id)} />
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
                {selectedCandidate && (
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <div className="edit-form-container">
                                <h2>Edit Candidate</h2>
                                <hr></hr>
                                <form>
                                    <div className="form-group align-left">
                                        <label htmlFor="firstName" style={{ fontWeight: 'bold' }}>First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            value={selectedCandidate.firstName}
                                            onChange={(e) => setSelectedCandidate({ ...selectedCandidate, firstName: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group align-left">
                                        <label htmlFor="lastName" style={{ fontWeight: 'bold' }}>Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            value={selectedCandidate.lastName}
                                            onChange={(e) => setSelectedCandidate({ ...selectedCandidate, lastName: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group align-left">
                                        <label htmlFor="contactNo" style={{ fontWeight: 'bold' }}>Contact No</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="contactNo"
                                            value={selectedCandidate.contactNo}
                                            maxLength={10} 
                                            onChange={(e) => setSelectedCandidate({ ...selectedCandidate, contactNo: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group align-left">
                                        <label htmlFor="skills" style={{ fontWeight: 'bold' }}>Skills</label>
                                        <Select
                                            id="skills"
                                            options={skillOptions.map(skill => ({ value: skill.id, label: skill.skillsName }))} // Assuming you have an array of skill options
                                            value={selectedSkills}
                                            onChange={setSelectedSkills}
                                            isMulti
                                        />
                                    </div>
                                    <div className="form-group align-left">
                                        <label htmlFor="address" style={{ fontWeight: 'bold' }}>Address</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="address"
                                            value={selectedCandidate.address}
                                            onChange={(e) => setSelectedCandidate({ ...selectedCandidate, address: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group align-left">
                                        <label htmlFor="overallExperience" style={{ fontWeight: 'bold' }}>Overall Experience</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="overallExperience"
                                            value={selectedCandidate.totalExperience}
                                            onChange={(e) => setSelectedCandidate({ ...selectedCandidate, totalExperience: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group align-left">
                                        <label htmlFor="dateOfBirth" style={{ fontWeight: 'bold' }}>Date of Birth</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="dateOfBirth"
                                            value={selectedCandidate.dateOfBirth}
                                            onChange={(e) => setSelectedCandidate({ ...selectedCandidate, dateOfBirth: e.target.value })}
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

export default CandidateList;
