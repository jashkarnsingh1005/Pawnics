import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:3001/api/auth/getUserDetails', {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        
        // Check if user is admin
        const isUserAdmin = response.data.email === 'admin@gmail.com' || response.data.role === 'admin';
        setIsAdmin(isUserAdmin);
        setIsLoading(false);
      } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          try {
            const refreshRes = await axios.get(
              'http://localhost:3001/api/auth/refresh',
              { withCredentials: true }
            );
            
            localStorage.setItem('accessToken', refreshRes.data.accessToken);
            
            // Retry with new token
            const retryRes = await axios.get('http://localhost:3001/api/auth/getUserDetails', {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${refreshRes.data.accessToken}`,
              },
            });
            
            const isUserAdmin = retryRes.data.email === 'admin@gmail.com' || retryRes.data.role === 'admin';
            setIsAdmin(isUserAdmin);
          } catch (refreshError) {
            console.error('Session expired:', refreshError);
            localStorage.removeItem('accessToken');
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
        setIsLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;