import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Card, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Twitter.module.css';
import Collapsible from 'react-collapsible';
import { FaTwitter } from 'react-icons/fa';
// import LineChart from '../Charts/LineChart';

const TwitterFollows = (props) => {
  const [user, setUser] = useState({ email: '', code: '' });
  const [twitterToken, setTwitterToken] = useState('');
  const [followersSize, setFollowersSize] = useState(0);
  const [followedSize, setFollowedSize] = useState(0);
  const [followersMetrics, setFollowersMetrics] = useState([]);
  const [followedMetrics, setFollowedMetrics] = useState([]);

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
      const twitterFollowersRes = await axios.get(
        '/twitter/followers',
        { params: twitterQuery }
      );
      if (twitterFollowersRes) {
        console.log('Received Followers from Twitter!');
        console.log(twitterFollowersRes.data);
        setFollowersSize(twitterFollowersRes.data.data.length)

        const ids = getTweetsID(twitterFollowersRes.data.data.slice(0, 5));

        const newTwitterQuery = {
          accessToken: twitterToken,
          ids: ids
        };

        const twitterFollowersMetricsRes = await axios.get(
          '/twitter/followMetrics',
          { params: newTwitterQuery }
        );

        if (twitterFollowersMetricsRes) {
          console.log('Twitter Followers Metrics Received:');
          console.log(twitterFollowersMetricsRes.data);
          setFollowersMetrics(twitterFollowersMetricsRes.data.data);
        }
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
        setFollowedSize(twitterFollowedRes.data.data.length)

        const ids = getTweetsID(twitterFollowedRes.data.data.slice(0, 5));

        const newTwitterQuery = {
          accessToken: twitterToken,
          ids: ids
        };

        const twitterFollowedMetricsRes = await axios.get(
          '/twitter/followMetrics',
          { params: newTwitterQuery }
        );

        if (twitterFollowedMetricsRes) {
          console.log('Twitter Followed Metrics Received:');
          console.log(twitterFollowedMetricsRes.data);
          setFollowedMetrics(twitterFollowedMetricsRes.data.data);
        }
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
    <Card style={{ borderColor: 'var(--twitter)'}} className={styles.socialsCard}>
      <Row>
        <Col>
          <h1>
            Total followers: {followersSize}
          </h1>
          <h3>
            Most Recent Followers:<br></br>
          </h3>
            {Object.keys(followersMetrics).map((key, index) => (
              <Collapsible trigger= {
              <div key={index} className={styles.profile}>
                <Row>              
                  <Col xs={3}>
                    <img style={{paddingRight : '10px'}} src={followersMetrics[key].profile_image_url} alt="" className={styles.pfp}></img>
                  </Col>
                  <Col xs={3} style={{marginTop: '.5vh'}}>
                    <Row style={{ fontWeight: 'bold', fontSize: "20px" }}>
                      {followersMetrics[key].name}
                    </Row>
                    <Row style={{ color: 'grey' }}>
                      @{followersMetrics[key].username} 
                    </Row>
                  </Col>
                  <Col>
                    <Row style={{marginTop : '2.7vh', color: '#05aced'}}>
                      <div>Click to View their Information      <FaTwitter /></div>
                    </Row>
                  </Col>
                </Row>
              </div>
            }>
                <div style={{ fontWeight: 'bold' }}>Followers: {followersMetrics[key].public_metrics.followers_count}, Following: {followersMetrics[key].public_metrics.following_count}, Tweets: {followersMetrics[key].public_metrics.tweet_count}, <a href={"https://www.twitter.com/" + followersMetrics[key].username} target="_blank" rel="noreferrer">View Profile</a></div>
              </Collapsible>
            ))}
        </Col>
        <Col>
          <h1>
            Total following: {followedSize}
          </h1>
          <h3>
            Most Recent Accounts You've Followed:<br></br>
          </h3>
          {Object.keys(followedMetrics).map((key, index) => (
              <Collapsible trigger= {
              <div key={index} className={styles.profile}>
                <Row>              
                  <Col xs={3}>
                    <img style={{paddingRight : '10px'}} src={followedMetrics[key].profile_image_url} alt="" className={styles.pfp}></img>
                  </Col>
                  <Col xs={3} style={{marginTop: '.5vh'}}>
                    <Row style={{ fontWeight: 'bold', fontSize: "20px" }}>
                      {followedMetrics[key].name}
                    </Row>
                    <Row style={{ color: 'grey' }}>
                      @{followedMetrics[key].username} 
                    </Row>
                  </Col>
                  <Col>
                    <Row style={{marginTop : '2.7vh', marginLeft: '1vw', color: '#05aced'}}>
                    <div>Click to View their Information      <FaTwitter /></div>
                    </Row>
                  </Col>
                </Row>
              </div>
            }>
                <div style={{ fontWeight: 'bold' }}>Followers: {followedMetrics[key].public_metrics.followers_count}, Following: {followedMetrics[key].public_metrics.following_count}, Tweets: {followedMetrics[key].public_metrics.tweet_count}, <a href={"https://www.twitter.com/" + followedMetrics[key].username} target="_blank" rel="noreferrer">View Profile</a></div>
              </Collapsible>
            ))}
            
        </Col>
      </Row>
      
    </Card>
  );
};

export default TwitterFollows;
