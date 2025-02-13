import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext'; // Import Notes context

const UserLogout = () => {
    const { clearNotes } = useNotes(); // Access clearNotes function from context
    const navigate = useNavigate();

    useEffect(() => {
        const logoutUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/logout`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    localStorage.removeItem('token'); // Remove token
                    clearNotes(); // Clear notes state
                    navigate('/login'); // Redirect to login
                }
            } catch (error) {
                console.error('Error logging out:', error);
                navigate('/login'); // Redirect to login even if API fails
            }
        };

        logoutUser();
    }, [navigate, clearNotes]); // Run only on component mount

    return <div>Logging out...</div>;
};

export default UserLogout;
