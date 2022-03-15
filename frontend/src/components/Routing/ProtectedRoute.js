/**
 * @fileoverview This file gives some reuseable functions for checking whether a user is correctly logged in or logging them out
 * An unauthenticated user will also be sent back to the welcome page.
 * @author Chris Koehne <cdkoehne@gmail.com>
 */

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = (props) => {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  const getAuthenticated = async () => {
    try {
      await axios.post('http://localhost:5000/cookieCheck/');
      setAuthed(true);
    } catch (err) {
      localStorage.clear()
      setAuthed(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    async function callAuthenticate() {
      await getAuthenticated(props);
    }
    callAuthenticate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const show = () => {
    if (loading) {
      return (
        <div style={{
          width: '100vw',
          height: '100vh',
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
        }}>
          <h1 style={{color: 'var(--slate)'}}>Loading...</h1>
        </div>
      );
    } else {
      return authed ? <Outlet /> : <Navigate to='/welcome' />;
    }
  };

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return show();
};

export default ProtectedRoute;
