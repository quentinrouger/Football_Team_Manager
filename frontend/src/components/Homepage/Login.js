import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ( {setIsAuthenticated}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      // localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.username);
      localStorage.setItem('teamName', data.user.teamName);


      toast.success(`Login successful ! Welcome back, ${data.user.username} !`, {
        position: 'top-right',
        autoClose: 2000,
      });

      setTimeout(() => {
      navigate('/players');
      }, 1500);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Login failed. Please check your credentials and try again.', {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/Homepage2.png')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay */}
      
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen">
        <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handleLogin}>
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
            <button type="submit" className="w-full py-2 mt-4 bg-sky-400 text-white rounded-lg hover:bg-sky-500">
              Login
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

export default Login;