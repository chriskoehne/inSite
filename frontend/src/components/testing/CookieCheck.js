import React, { useEffect } from 'react';
import axios from 'axios';
import { authenticate } from '../../auth/auth';

const CookieCheck = (props) => {
  useEffect(() => { 
    async function callAuthenticate() {
      await authenticate(props);
    }

    callAuthenticate();
  
  }, []);

  return <h1>cookiecheck weeeeee</h1>;
};

export default CookieCheck;
