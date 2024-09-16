import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [teamName, setTeamName] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    // Basic regex for validating email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Regex to ensure password is at least 8 characters long, contains at least one digit, and one special character
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };
  

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address.', {
        position: 'top-right',
        autoClose: 3000,
        className: 'bg-red-500 text-white',
      });
      return;
    }

    if (!validatePassword(password)) {
      toast.error('Password must be at least 8 characters long, contain at least one digit and one special character.', {
        position: 'top-right',
        autoClose: 3000,
        className: 'bg-red-500 text-white',
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, teamName }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const result = await response.json();
      if (result.message === 'User registered successfully. Please check your email to verify your account.') {
        toast.success('Registration successful! Please check your email to verify your account.', {
          position: 'top-right',
          autoClose: 5000,
        });

        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        toast.error(result.message || 'Registration failed. Please try again.', {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error('Error registering:', error);
      toast.error('Registration failed. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/Homepage2.png')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay */}
      
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen">
        <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor='username'>Username:</label>
              <input
                id='username'
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                autoComplete='username'
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor='email'>Email:</label>
              <input
                id='email'
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                autoComplete='email'
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor='password'>Password:</label>
              <input
                id='password'
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor='teamName'>Team Name:</label>
              <input
                id='teamName'
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <button type="submit" className="w-full py-2 mt-4 bg-sky-400 text-white rounded-lg hover:bg-sky-500">
              Register
            </button>
          </form>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2 mt-4 bg-red-400 text-white rounded-lg hover:bg-red-500"
          >
            Back to Homepage
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Register;
