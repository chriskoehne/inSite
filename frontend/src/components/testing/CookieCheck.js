import React, { useEffect } from 'react';
import axios from 'axios';

const CookieCheck = (props) => {

  useEffect(() => {
    async function checkit() {
      try {
      let result = await axios.get('http://localhost:5000/cookieCheck/');
      console.log(result);
      } catch (err) {
          props.navigate('/welcome');
      }
    }

    checkit()
  });

  return (<h1>cookiecheck weeeeee</h1>);
};

export default CookieCheck;
