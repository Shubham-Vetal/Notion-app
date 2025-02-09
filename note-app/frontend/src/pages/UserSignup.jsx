import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'
import { NavLink } from 'react-router-dom'

const UserSignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userData, setUserData] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const navigate = useNavigate()
  const { user, setUser } = useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);

      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('token', data.token);
        setSuccessMessage('Account successfully created! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Navigate to login after 2 seconds
      }

      setEmail('');
      setFirstName('');
      setLastName('');
      setPassword('');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
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

        <form onSubmit={(e) => submitHandler(e)}>
          <h3 className='text-xl font-medium mb-4 text-center text-gray-700'>Create Your Account</h3>

          <div className='flex gap-4 mb-6'>
            <input
              required
              className='w-1/2 bg-[#f5f5f5] px-4 py-2 rounded-lg border text-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              type="text"
              placeholder='First name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              required
              className='w-1/2 bg-[#f5f5f5] px-4 py-2 rounded-lg border text-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              type="text"
              placeholder='Last name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

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
            Create account
          </button>
        </form>

        {successMessage && (
          <div className="mt-4 text-green-600 text-center">
            <p>{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 text-red-600 text-center">
            <p>{errorMessage}</p>
          </div>
        )}

        <p className='text-center text-sm mt-4 text-gray-600'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-600 hover:underline'>
            Login here
          </Link>
        </p>

        <div className='mt-8 text-center text-xs text-gray-500'>
          <p>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
