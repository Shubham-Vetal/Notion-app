import React, { useContext, useEffect, useState } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProtectWrapper = ({ children }) => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserDataContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token'); // Get token inside useEffect

        if (!token) {
            navigate('/login');
            return;
        }

        // Set loading to true before API call
        setIsLoading(true);

        axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            if (response.status === 200) {
                setUser(response.data); 
            } else {
                throw new Error('Unauthorized');
            }
        })
        .catch(err => {
            console.error('Auth error:', err);
            localStorage.removeItem('token');
            navigate('/login');
        })
        .finally(() => {
            setIsLoading(false); // Ensure loading state updates after API call
        });

    }, [navigate, setUser]); 

    if (isLoading) {
        return (
            <div className="h-screen flex justify-center items-center text-lg font-semibold">
                Loading...
            </div>
        );
    }

    return <>{children}</>;
};

export default UserProtectWrapper;
