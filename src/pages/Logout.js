import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        fetch('http://localhost:8080/logout', {
            method: 'POST',
            credentials: 'include'
        })
            .then(response => {
                if (response.ok) {
                    navigate('/login');
                } else {
                    throw new Error('Logout failed');
                }
            })
            .catch(error => {
                console.error(error);
         });
        navigate('/login');
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;