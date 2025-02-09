import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const userData = { email, password };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData);
      
      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('token', data.token);
        navigate('/home');
      }

      setEmail('');
      setPassword('');
    } catch (error) {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className='h-screen flex items-center justify-center bg-[#f7f7f7]'>
      <div className='w-full max-w-lg bg-white p-8 rounded-xl shadow-md'>
        <div className='flex justify-center mb-8'>
          <h2 className="text-xl font-bold text-purple-600 flex items-center">
            <span className="mr-2 text-2xl">☰</span> AI Notes
          </h2>
        </div>

        <form onSubmit={submitHandler}>
          <h3 className='text-xl font-medium mb-4 text-center text-gray-700'>Sign In to Your Account</h3>

          <div className='mb-6'>
            <input
              required
              className='w-full bg-[#f5f5f5] px-4 py-2 rounded-lg border text-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              type="email"
              placeholder='email@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className='mb-6'>
            <input
              required
              className='w-full bg-[#f5f5f5] px-4 py-2 rounded-lg border text-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              type="password"
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className='w-full bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-700 transition'
          >
            Login
          </button>
        </form>

        <p className='text-center text-sm mt-4 text-gray-600'>
          New here?{' '}
          <Link to='/signup' className='text-blue-600 hover:underline'>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
