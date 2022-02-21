/**
 * @fileoverview This file gives some reuseable functions for checking whether a user is correctly logged in or logging them out
 * An unauthenticated user will also be sent back to the welcome page.
 * @author Chris Koehne <cdkoehne@gmail.com>
 */

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const UnprotectedRoute = (props) => {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  const getUnauthenticated = async () => {
    try {
      await axios.post('http://localhost:5000/cookieCheck/');
      setAuthed(true);
    } catch (err) {
      setAuthed(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    async function callAuthenticate() {
      await getUnauthenticated(props);
    }

    callAuthenticate();
  }, []);

  const show = () => {
    if (loading) {
      return (
        <div style={{ backgroundColor: '#3d3d3d', height: '100vh' }}></div>
      );
    } else {
      return !authed ? <Outlet /> : <Navigate to='/dashboard' />;
    }
  };

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return show();
};

export default UnprotectedRoute;
