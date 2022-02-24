import React, { useEffect } from 'react';
import { logout } from '../../auth/auth';

const Logout = (props) => {
  useEffect(() => {
    props.setAppEmail('');
    logout(props);
  }, []);

  return <h1>logout weeeeee</h1>;
};

export default Logout;
