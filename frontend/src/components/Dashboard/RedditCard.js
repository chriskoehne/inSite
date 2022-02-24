import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';
import LineChart from '../Charts/LineChart';
import { SocialIcon } from 'react-social-icons';

const RedditCard = (props) => {
  const [redditToken, setRedditToken] = useState('');
  const [user, setUser] = useState({ email: '', code: '' });
  const [loading, setLoading] = useState(false);

  const hasToken = () => {
    if (!localStorage.hasOwnProperty('redditToken')) {
      return false;
    }
    const token = JSON.parse(localStorage.getItem('redditToken'));
    if ((Date.now() - token.date) / 36e5 >= 1) {
      localStorage.removeItem('redditToken');
      return false;
    }
    return true;
  };

  useEffect(() => {
    let t = localStorage.getItem('redditToken');
    let c = null;
    const e = localStorage.getItem('email');

    const currentUrl = window.location.href;
    if (currentUrl.includes('&')) {
      let start = currentUrl.indexOf('state') + 6;
      start = currentUrl.indexOf('code') + 5;
      const almostCode = currentUrl.substring(start);
      c = almostCode.substring(0, almostCode.length - 2);
    }
    setUser({
      email: e,
      code: c,
    });
    setRedditToken(t);
  }, []);

  useEffect(() => {
    const convert = async () => {
      setLoading(true);
      console.log(user);
      if (!user.code) {
        setLoading(false);
        return;
      }
      console.log('fuck');
      const result = await axios.post(
        'http://localhost:5000/reddit/codeToToken/',
        { code: user.code }
      );
      if (result.data.accessToken) {
        const token = result.data.accessToken;
        console.log(Date.now());
        localStorage.setItem(
          'redditToken',
          JSON.stringify({ token: token, date: Date.now() })
        );
        setRedditToken(token);
    }
      setLoading(false);
    };
    if (!hasToken() && user.code) {
      convert();
    }
  }, [user]);

  useEffect(() => {
    if (!hasToken() && redditToken) {
      localStorage.setItem('redditToken', redditToken);
    }
  }, [redditToken]);

  const authenticateReddit = async (e) => {
    e.preventDefault();
    const result = await axios.post('http://localhost:5000/reddit/login/', {
      email: user.email,
    });
    console.log(result);
    if (result.data.success) {
      console.log('got the link!');
      window.location.href = result.data.link;
    } else {
      console.log('there was an error in Reddit user signup');
    }
  };

  

  const display = () => {
    if (loading) {
      return <h2>Loading...</h2>;
    }

    if (redditToken) {
      return (
        <LineChart
          color={'#FF4500'}
          onClick={function () {
            props.navigate('reddit', {
              state: { email: user.email, accessToken: redditToken },
            });
          }}
        />
      );
    } else {
      return (
        <form onSubmit={authenticateReddit}>
          <div className='form-group'>
            <input type='submit' value='Login' className='btn btn-primary' />
          </div>
        </form>
      );
    }
  };
  const icon = () => {
    if (redditToken) {
      return <SocialIcon url='https://reddit.com/user/me' />;
    } else {
      return null;
    }
  };

  return (
    <Col className={styles.cardCol}>
      <Card style={{ borderColor: '#FF4500' }} className={styles.socialsCard}>
        <Card.Body>
          <Card.Title>{icon()} Reddit</Card.Title>
          <Card.Text></Card.Text>
          <div>{display()}</div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default RedditCard;
