import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const { signupUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await signupUser(name, email, password);
        if (result.success) {
            navigate('/'); // Account बनल्यावर डायरेक्ट डॅशबोर्डवर जाणे
        } else {
            setError(result.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '80px auto', padding: '30px', border: '1px solid #e0e0e0', borderRadius: '8px', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '20px' }}>Create Your Account</h2>
            {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Sign Up
                </button>
            </form>
            <p style={{ marginTop: '15px' }}>
                Already have an account? <Link to="/login" style={{ color: '#0066cc' }}>Login here</Link>
            </p>
        </div>
    );
}

export default Register;