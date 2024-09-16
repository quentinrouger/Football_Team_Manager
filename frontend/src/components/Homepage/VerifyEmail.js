import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './VerifyEmail.css'; // Optional CSS for styling

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token'); // Extract token from URL

      if (!token) {
        setMessage('Invalid verification link.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/verify-email?token=${token}`);
        
        if (response.ok) {
          setMessage('Email verified successfully!');
          setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
        } else {
          setMessage('Invalid or expired verification link.');
        }
      } catch (error) {
        setMessage('An error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="verify-email-container">
      {loading ? (
        <p>Verifying your email...</p>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
};

export default VerifyEmail;
