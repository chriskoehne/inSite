import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Twitter.module.css';
import LineChart from '../Charts/LineChart';
// import LineChart from '../Charts/LineChart';

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

const TwitterLikesGraph = (props) => {
  const [user, setUser] = useState({ email: '', code: '' });
  const [twitterToken, setTwitterToken] = useState('');
  const [tweetsData, setTweetsData] = useState({
    datasets: [],
  });
 
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
        userId: localStorage.getItem('twitter-user-id')
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
          let tweets = twitterLikesRes.data.data;
          let likeData = [],  labels = [], replyData = [], retweetData = []
       
          tweets.forEach((e, index) => {
              let values = e.public_metrics
              likeData.push(values.like_count)
              replyData.push(values.reply_count)
              retweetData.push(values.retweet_count)
              labels.push(index + 1)
          })
          let tweetDataset = {
            labels: labels,
            datasets: [
              {
                label: 'Like Count',
                data: likeData.reverse(),
                borderColor: '#05aced',
                backgroundColor: '#05aced',
                xaxis: 'Tweets',
              },
              {
                label: 'Reply Count',
                data: replyData.reverse(),
                borderColor: '#007DAD',
                backgroundColor: '#007DAD',
                xaxis: 'Tweets',
              },
              {
                label: 'Retweet Count',
                data: retweetData.reverse(),
                borderColor: '#025E82',
                backgroundColor: '#025E82',
                xaxis: 'Tweets',
              }
            ],
            
          };
          setTweetsData(tweetDataset)
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
          <h1>Trends of your last 100 Tweets</h1>
          <LineChart
                    height={'50vh'}
                    width={'75vw'}
                    color={'#ff4500'}
                    data={tweetsData}
                  />
      </Card>
  );
};

export default TwitterLikesGraph;
