import React, { useState } from 'react';
import axios from 'axios';
import '../credentials/login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [role, setRole] = useState('user');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent form from reloading the page
    
        try {
            const url = role === 'admin' ? 'http://localhost:8081/admin/login' : 'http://localhost:8081/user/login';
            const response = await axios.post(url, { email, password });
    
            // If login is successful, redirect based on the role
            if (response.status === 200) {
                if (role === 'admin') {
                    localStorage.removeItem('user_id'); // Clear previous user ID
                    localStorage.setItem('admin_id', response.data.admin.id);
                    console.log('Admin ID:', response.data.admin.id); // Log admin ID
                    navigate('/dashboard');
                } else {
                    localStorage.removeItem('admin_id'); // Clear previous admin ID
                    localStorage.setItem('user_id', response.data.user.id);
                    console.log('User ID:', response.data.user.id); // Log user ID
                    navigate('/home');
                }
            }
        } catch (error: any) { // Use 'any' to suppress the error type warning
            setErrorMessage(error.response?.data?.error || 'Login failed');
        }
    };
    
    

    return (
        <div className="login-container">
            <div className="info">
                <h1>Fishcom</h1>
                <p>Connect all fish enthusiasts and vendors in the Philippines around you on Fishcom.</p>
            </div>
            <div className="login-form">
                <form onSubmit={handleLogin}>
                    <h1 style={{ textAlign: 'center', fontSize: '24px', color: '#1876F2' }}>LOGIN PAGE</h1>
                    <hr style={{ width: '100%', margin: '7px auto', border: '1px solid #000000' }} />
                    
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    
                    <label htmlFor="role">Select Role:</label>
                    <select id="role" name="role" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
    
                    <label htmlFor="email">Enter your email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="Enter your email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
    
                    <label htmlFor="password">Enter your password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="Enter your password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
    
                    <button type="submit" className="login-btn">Login</button>
                    <hr style={{ width: '100%', margin: '7px auto', border: '1px solid #000000' }} />
                    
                    <button type="button" className="create-account-btn" onClick={() => navigate('/register')}>Create an Account</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
