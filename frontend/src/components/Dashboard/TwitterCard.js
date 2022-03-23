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


  useEffect(() => {
    let c = null;
    const e = localStorage.getItem('email');
    const currentUrl = window.location.href;
    if (currentUrl.includes('&')) {
      let start = currentUrl.indexOf('code') + 5;
      c = currentUrl.substring(start);
    }
    setUser({
      email: e,
      code: c,
    });
  }, []);

  useEffect(() => {
    const convert = async () => {
      setLoading(true);
      if (!user.code) {
        setLoading(false);
        return;
      }
      const result = await axios.post(
        'http://localhost:5000/twitter/codeToToken/',
        { code: user.code }
      );
      console.log(result.data);
      if (result.data.accessToken) {
        const token = result.data.accessToken;
        setTwitterToken(token);
      } else {
        console.log('could not convert token');
      }
      setLoading(false);
    };

    if (user.code) {
      convert();
    } else {
      console.log('no code received from twitter');
    }
  }, [user]);

  useEffect(() => {
    const callTwitter = async () => {
      const twitterQuery = {
        accessToken: twitterToken,
      };
      const twitterRes = await axios.get(
        'http://localhost:5000/twitter/test/',
        { params: twitterQuery }
      );
      if (twitterRes) {
        console.log('Received Tweets from Twitter!');
        console.log(twitterRes.data);
      } else {
        console.log('Could not get Tweets from Twitter!');
      }
    };

    if (twitterToken) {
      console.log('Calling Twitter');
      callTwitter();
    }
  }, [twitterToken]);

  const authenticateTwitter = async (e) => {
    e.preventDefault();
    const result = await axios.post('http://localhost:5000/twitter/login/', {
      email: user.email,
    });
    if (result.data.success) {
      console.log('got the link!');
      window.location.href = result.data.link;
    } else {
      console.log('there was an error in Twitter user signup');
    }
  };

  const display = () => {
    if (loading) {
      return <h2>Loading...</h2>;
    }
    return (
      <div className={styles.centered}>
        <Button className={styles.buttons} onClick={authenticateTwitter}>
          Authorize Twitter
        </Button>
      </div>
    );
  };

  const icon = () => {
    return <SocialIcon fgColor='white' url='https://twitter.com/' />;
  };

  return (
    <Col className={styles.cardCol}>
      <Card style={{ borderColor: 'var(--reddit)' }} className={styles.socialsCard}>
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
