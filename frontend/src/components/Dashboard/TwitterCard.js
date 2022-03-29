import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';
// import LineChart from '../Charts/LineChart';
import { SocialIcon } from 'react-social-icons';

const TwitterCard = (props) => {
  const [user, setUser] = useState({ email: '', code: '' });
  const [loading, setLoading] = useState(false);
  const [twitterToken, setTwitterToken] = useState('');

  const hasToken = () => {
    if (!localStorage.hasOwnProperty('twitterToken')) {
      // console.log("no twitter token in localstorage")
      return false;
    }
    const date = JSON.parse(localStorage.getItem('twitterToken')).date;
    if ((Date.now() - date) / 36e5 >= 1) {
      // console.log("too old reddit token")
      localStorage.removeItem('twitterToken');
      return false;
    }
    // console.log("yea localstorage has the twitter token")
    return true;
  };

  useEffect(() => {
    let c = null;
    const e = localStorage.getItem('email');
    const currentUrl = window.location.href;
    if (currentUrl.includes('state=twitter')) {
      let start = currentUrl.indexOf('code') + 5;
      c = currentUrl.substring(start);
      setUser({
        email: e,
        code: c,
      });
    } else {
      setUser({
        email: e
      });
    }
  }, []);

  useEffect(() => {
    const convert = async () => {
      setLoading(true);
      if (!user.code) {
        setLoading(false);
        return;
      }
      const result = await axios.post(
        '/twitter/codeToToken/',
        { code: user.code }
      );
      // console.log(result.data);
      if (result.data.accessToken) {
        const token = result.data.accessToken;
        setTwitterToken(token);
        localStorage.setItem(
          'twitterToken',
          JSON.stringify({ token: token, date: Date.now() })
        );
      } else {
        // console.log('could not convert token');
      }
      setLoading(false);
    };

    if (!hasToken() && user.code) {
      convert();
    } else if (hasToken()) {
      setTwitterToken(JSON.parse(localStorage.getItem('twitterToken')).token);
    }
  }, [user]);

  useEffect(() => {
    if (!hasToken() && twitterToken) {
      localStorage.setItem(
        'twitterToken',
        JSON.stringify({ token: twitterToken, date: Date.now() })
      );
    }

    const getUser = async () => {
      // console.log('Calling Twitter API. Here is localStorage:');
      // console.log(localStorage);
      const twitterQuery = {
        accessToken: twitterToken
      };
      const twitterRes = await axios.get(
        '/twitter/getUser/',
        { params: twitterQuery }
      );
      if (twitterRes) {
        // console.log('Received Tweets from Twitter!');
        console.log()
        console.log(twitterRes.data);
        console.log(twitterRes.data.data.id)
        localStorage.setItem('twitter-user-id', twitterRes.data.data.id)
      } 
      // else {
      //   console.log('Could not get Tweets from Twitter!');
      // }
    };

    if (twitterToken) {
      // console.log('Calling Twitter');
      getUser();
    }
  }, [twitterToken]);

  useEffect(() => {
    if (!hasToken() && twitterToken) {
      localStorage.setItem(
        'twitterToken',
        JSON.stringify({ token: twitterToken, date: Date.now() })
      );
    }

    const callTwitter = async () => {
      // console.log('Calling Twitter API. Here is localStorage:');
      // console.log(localStorage);
      const twitterQuery = {
        accessToken: twitterToken,
      };
      const twitterRes = await axios.get(
        '/twitter/test/',
        { params: twitterQuery }
      );
      if (twitterRes) {
        // console.log('Received Tweets from Twitter!');
        console.log(twitterRes.data);
      } 
      // else {
      //   console.log('Could not get Tweets from Twitter!');
      // }
    };

    if (twitterToken) {
      // console.log('Calling Twitter');
      callTwitter();
    }
  }, [twitterToken]);

  const authenticateTwitter = async (e) => {
    e.preventDefault();
    const result = await axios.post('/twitter/login/', {
      email: user.email,
    });
    if (result.data.success) {
      // console.log('got the link!');
      window.location.href = result.data.link;
    } else {
      // console.log('there was an error in Twitter user signup');
    }
  };

  const display = () => {
    if (loading) {
      return <h2>Loading...</h2>;
    }
    if (twitterToken) {
      return (
        <div className={styles.centered}>
          <Button className={styles.buttons} onClick={function () {
            props.navigate('twitter', {
              state: { email: user.email, accessToken: twitterToken },
            });
            }}>
            Navigate to Twitter
          </Button>
        </div>
      );
    }
    else {
      return (
        <div className={styles.centered}>
          <Button className={`${styles.buttons} ${styles.twitterB}`} onClick={authenticateTwitter}>
            Authorize Twitter
          </Button>
        </div>
      );
    }
  };

  const icon = () => {
    return <SocialIcon fgColor='white' url='https://twitter.com/' />;
  };
  
  return (
    <Col className={styles.cardCol}>
      <Card style={{ borderColor: 'var(--twitter)' }} className={styles.socialsCard}>
        <Card.Body>
          <Card.Title>{icon()} Twitter</Card.Title>
          <Card.Text></Card.Text>
          <div>{display()}</div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default TwitterCard;
