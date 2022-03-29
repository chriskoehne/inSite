import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Row, Card, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Twitter.module.css';
// import LineChart from '../Charts/LineChart';
import { SocialIcon } from 'react-social-icons';
import { TagCloud } from 'react-tagcloud';

const c = require('./constants/constants.js')

function getUncommon(sentence) {
    var wordArr = sentence.match(/\w+/g),
      commonObj = {},
      uncommonArr = [],
      word,
      i;
  
    let common = c.WORDLIST;
    for (i = 0; i < common.length; i++) {
      commonObj[common[i].trim()] = true;
    }
  
    for (i = 0; i < wordArr.length; i++) {
      word = wordArr[i].trim().toLowerCase();
      if (!commonObj[word]) {
        uncommonArr.push(word);
      }
    }
  
    return uncommonArr;
  }

  function getWordList(str) {
    let arr = [];
    let array = str.split(' ');
    let map = {};
    for (let i = 0; i < array.length; i++) {
      let item = array[i];
      map[item] = map[item] + 1 || 1;
    }
    for (const property in map) {
      let obj = {};
      obj.value = property;
      obj.count = map[property];
      arr.push(obj);
    }
    arr.sort((a, b) => b.count - a.count);
    return arr.slice(0, 30);
  }

const TwitterWordGraph = (props) => {
  const [user, setUser] = useState({ email: '', code: '' });
  const [loading, setLoading] = useState(false);
  const [twitterToken, setTwitterToken] = useState('');
  const [tagCloud, setTagCloud] = useState([]);
  const [tweets, setTweets] = useState('')

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

    const getWCloud = async () => {
      // console.log('Calling Twitter API. Here is localStorage:');
      // console.log(localStorage);
      const twitterQuery = {
        accessToken: twitterToken,
        userID: localStorage.getItem('twitter-user-id')
      };
      const twitterRes = await axios.get(
        '/twitter/tweets',
        { params: twitterQuery }
      );
      if (twitterRes) {
        // console.log('Received Tweets from Twitter!');
        let array = twitterRes.data.data
        let comm_str = '';
        array.forEach((comm) => {
            comm_str += comm.text;
        });
        setTagCloud(getWordList(getUncommon(comm_str).join(' ')));
      } 
      // else {
      //   console.log('Could not get Tweets from Twitter!');
      // }
    };

    if (twitterToken) {
      // console.log('Calling Twitter');
      getWCloud();
    }
  }, [twitterToken]);
  
  return (
      <Card style={{ borderColor: 'var(--twitter)' }} className={styles.socialsCard}>
          <Row>
              <Col>
                <h3>
                  Woooaaahhh Relax! You're tweeting all over the place <br></br>
                  Here's some of the words you most frequently tweet:
                </h3>
                <div className={styles.cloudCentered}>
                    <TagCloud tags={tagCloud} minSize={32} maxSize={60} />
                </div>
              </Col>
            </Row>
      </Card>
  );
};

export default TwitterWordGraph;
