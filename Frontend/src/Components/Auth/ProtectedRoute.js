import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        await axios.get('http://localhost:3001/api/auth/getUserDetails', {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          try {
            const refreshRes = await axios.get(
              'http://localhost:3001/api/auth/refresh',
              { withCredentials: true }
            );
            
            localStorage.setItem('accessToken', refreshRes.data.accessToken);
            setIsAuthenticated(true);
          } catch (refreshError) {
            console.error('Session expired:', refreshError);
            localStorage.removeItem('accessToken');
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;