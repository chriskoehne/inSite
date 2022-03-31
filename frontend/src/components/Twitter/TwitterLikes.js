import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Row, Card, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Twitter.module.css';
// import LineChart from '../Charts/LineChart';

const c = require('./constants/constants.js')

function getTweetsID(data) {
  var ids = '';
  var i;
  for (i = 0; i < data.length; i++) {
    if (i === data.length - 1) {
      ids = ids + data[i].id; 
    } else {
      ids = ids + data[i].id + ','; 
    }
  }
  return ids;
}

const TwitterLikes = (props) => {
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

    const getLikes = async () => {
      // console.log('Calling Twitter API. Here is localStorage:');
      // console.log(localStorage);
      const twitterQuery = {
        accessToken: twitterToken,
        userID: localStorage.getItem('twitter-user-id')
      };
      const twitterRes = await axios.get(
        '/twitter/likes',
        { params: twitterQuery }
      );
      if (twitterRes) {
        // console.log('Received Tweets from Twitter!');
        // console.log(twitterRes.data);
        const tweetsIds = getTweetsID(twitterRes.data.data);
        // console.log(tweetsIds);

        const twitterLikesQuery = {
          accessToken: twitterToken,
          tweetsIds: tweetsIds
        };

        const twitterLikesRes = await axios.get(
          '/twitter/tweetLikes',
          { params: twitterLikesQuery }
        );

        if (twitterLikesRes) {
          console.log('Received Twitter Likes');
          console.log(twitterLikesRes.data);
        } 
        // else {
        //   console.log('Did not receive Twitter Likes info');
        // }
      } 
      // else {
      //   console.log('Could not get Tweets from Twitter for Likes!');
      // }
    };

    if (twitterToken) {
      // console.log('Calling Twitter');
      getLikes();
    }
  }, [twitterToken]);
  
  return (
      <Card style={{ borderColor: 'var(--twitter)' }} className={styles.socialsCard}>
          <Row>
              <Col>
                <h3>
                  Twitter Likes Page
                </h3>
                <div>
                    Hiiii
                    {/* Maybe make a line graph of each tweet by how many likes they got. (Likes are found in twitterLikesRes.data[array of size 10].public_metrics.like_count)*/}
                </div>
              </Col>
            </Row>
      </Card>
  );
};

export default TwitterLikes;
