import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Row, Card, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Twitter.module.css';
// import LineChart from '../Charts/LineChart';

const c = require('./constants/constants.js')

const TwitterFollows = (props) => {
  const [user, setUser] = useState({ email: '', code: '' });
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
    setTwitterToken(JSON.parse(localStorage.getItem('twitterToken')).token);
  }, [user]);

  useEffect(() => {
    if (!hasToken() && twitterToken) {
      localStorage.setItem(
        'twitterToken',
        JSON.stringify({ token: twitterToken, date: Date.now() })
      );
    }

    const getFollows = async () => {
      // console.log('Calling Twitter API. Here is localStorage:');
      // console.log(localStorage);
      const twitterQuery = {
        accessToken: twitterToken,
        userID: localStorage.getItem('twitter-user-id')
      };
      const twitterFollowsRes = await axios.get(
        '/twitter/followers',
        { params: twitterQuery }
      );
      if (twitterFollowsRes) {
        console.log('Received Followers from Twitter!');
        console.log(twitterFollowsRes.data);
      } 
      // else {
      //   console.log('Could not get Followers from Twitter!');
      // }
      const twitterFollowedRes = await axios.get(
        '/twitter/following',
        { params: twitterQuery }
      );
      if (twitterFollowedRes) {
        console.log('Received Following from Twitter!');
        console.log(twitterFollowedRes.data);
      } 
      // else {
      //   console.log('Could not get Following from Twitter!');
      // }
    };

    if (twitterToken) {
      // console.log('Calling Twitter');
      getFollows();
    }
  }, [twitterToken]);
  
  return (
      <Card style={{ borderColor: 'var(--twitter)' }} className={styles.socialsCard}>
          <Row>
              <Col>
                <h3>
                  Twitter Follows Page
                  {/* Maybe say how many followers total + the last 5 followers received */}
                </h3>
                <div>
                    Hiiii
                    {/* Maybe say how many users they follow + the last 5 people they followed */}
                </div>
              </Col>
            </Row>
      </Card>
  );
};

export default TwitterFollows;
