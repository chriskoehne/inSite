import React, { useEffect } from 'react';
import axios from 'axios';

const CookieCheck = (props) => {
  // const [redditStatus, setRedditStatus] = useState('');


  useEffect(() => {
    async function checkit() {
      console.log('checking cookie');
      let result = await axios.get('http://localhost:5000/cookieCheck/');
      console.log(result);
    }

    checkit()
  }, [])

  return <h1>cookiecheck weeeeee</h1>;
};

export default CookieCheck;
