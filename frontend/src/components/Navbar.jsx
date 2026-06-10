import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 30px',
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#ffffff'
        }}>
            <h2><Link to="/" style={{ textDecoration: 'none', color: '#333' }}>📝 Digital Note-Book</Link></h2>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                {user ? (
                    <>
                        <span>Welcome, <b>{user.name}</b></span>
                        <button onClick={handleLogout} style={{
                            padding: '8px 15px',
                            backgroundColor: '#ff4d4d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ textDecoration: 'none', color: '#333' }}>Login</Link>
                        <Link to="/register" style={{
                            textDecoration: 'none',
                            color: 'white',
                            backgroundColor: '#333',
                            padding: '8px 15px',
                            borderRadius: '5px'
                        }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;