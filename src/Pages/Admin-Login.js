import React, { useState } from 'react';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../img/logo.png';
import './Admin-Login.css';
import axios from 'axios'; // Import axios for making HTTP requests

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            setEmailError(email ? '' : 'Please enter your email.');
            setPasswordError(password ? '' : 'Please enter your password.');
            return;
        }

        if (!isValidEmail(email)) {
            setEmailError('Please enter a valid email.');
            return;
        }

        try {
            const response = await axios.post("http://localhost:8081/authenticate", {
                email: email,
                password: password
            });

            if (response.status === 200) {
                const token = response.data.token; // Extract token from response
                localStorage.setItem("token", token); // Store token in localStorage
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: 'You have successfully logged in.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.href = "Dashboard";
                });
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Incorrect email or password. Please try again.',
                confirmButtonText: 'OK'
            });
            console.error("Error:", error);
        }
    };

    

    const isValidEmail = (email) => {
        // Regular expression to check if the email format is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <main>
            <div className="container">
                <section className="section login min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                    <div >
                        <div className="row justify-content-center">
                            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                                <div className="d-flex justify-content-center py-4">
                                    <a href="index.html" className="logo d-flex align-items-center w-auto">
                                        <img src={logo} alt="Evision Logo" />
                                        <span className="d-none d-lg-block">Evision</span>
                                    </a>
                                </div>
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <div className="pt-4 pb-2">
                                            <h5 className="card-title text-center pb-0 fs-4">Admin Login</h5>
                                            <p className="text-center small">Enter your email and password to login</p>
                                        </div>
                                        <form onSubmit={handleLogin} className="row g-3 needs-validation" noValidate>
                                            <div className="col-12">
                                                <label htmlFor="email" className="form-label">Email</label>
                                                <input type="email" name="email" className={`form-control ${emailError ? 'is-invalid' : ''}`} id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                                <div className="invalid-feedback">{emailError}</div>
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="password" className="form-label">Password</label>
                                                <input type="password" name="password" className={`form-control ${passwordError ? 'is-invalid' : ''}`} id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                                <div className="invalid-feedback">{passwordError}</div>
                                            </div>
                                            <div className="col-12">
                                                <button className="btn btn-primary w-100" type="submit">Login</button>
                                            </div>
                                            <div className="col-12 mt-3">
                                                <p className="text-center">Don't have an account? <a href="register-admin.html">Create one</a></p>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="credits">
                                    Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default AdminLogin;
