import React, { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import { Box, Modal, Button, Stack, TextField } from '@mui/material';
import { Delete } from '@mui/icons-material';
import Swal from 'sweetalert2';

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

function AddSkillForm() {
    const [skills, setSkills] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [newSkillName, setNewSkillName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // Adjust as needed
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = () => {
        fetch(`${API_URL}skill/getAllSkills`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            setSkills(data);
        })
        .catch(error => {
            console.error('Error fetching skills:', error);
        });
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleSubmitSkill = () => {
        const newSkillData = {
            skillsName: newSkillName
        };
    
        fetch(`${API_URL}skill/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newSkillData)
        })
        .then(response => {
            if (response.ok) {
                fetchSkills();
                setNewSkillName('');
                setOpenModal(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Skill added successfully!',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                response.json().then(data => {
                    if (response.status === 409) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: data.message,
                            customClass: {
                                container: 'custom-swal-container',
                            },
                        });
                    } else {
                        throw new Error('Failed to add skill');
                    }
                });
            }
        });
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleDeleteSkill = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this skill!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${API_URL}skill/delete/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => {
                    if (response.ok) {
                        fetchSkills();
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: 'Skill deleted successfully!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        throw new Error('Failed to delete skill');
                    }
                })
                .catch(error => {
                    console.error('Error deleting skill:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Failed to delete skill. Please try again later.',
                    });
                });
            }
        });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSkills = skills.slice(indexOfFirstItem, indexOfLastItem);

    const pageCount = Math.ceil(skills.length / itemsPerPage);

    return (
        <main>
            <section className="content-section profile-container margin-top-80">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Skills ID</th>
                            <th>Skills Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSkills.map(skill => (
                            <tr key={skill.id}>
                                <td>{skill.id}</td>
                                <td>{skill.skillsName}</td>
                                <td>
                                    <Delete onClick={() => handleDeleteSkill(skill.id)} style={{ cursor: 'pointer' }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <footer>
                    <Button variant="contained" color="primary" onClick={handleOpenModal}>Add Skills</Button>
                </footer>
                <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <h2 id="modal-modal-title">Add New Skill</h2>
                        <TextField
                            id="skillName"
                            label="Skill Name"
                            variant="outlined"
                            value={newSkillName}
                            onChange={(e) => setNewSkillName(e.target.value)}
                            fullWidth
                            mb={2}
                        />
                        <Button variant="contained" color="primary" onClick={handleSubmitSkill}>Submit</Button>
                    </Box>
                </Modal>
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
            </section>
        </main>
    );
}

export default AddSkillForm;
