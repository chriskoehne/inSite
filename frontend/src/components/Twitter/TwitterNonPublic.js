import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Twitter.module.css';
import { Tweet } from 'react-twitter-widgets';
import ReactTooltip from 'react-tooltip';
import hasToolTips from '../../helpers/hasToolTips';
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

const TwitterNonPublic = (props) => {
  const [user, setUser] = useState({ email: '', code: '' });
  const [twitterToken, setTwitterToken] = useState('');
  const [mostClicks, setMostClicks] = useState('');
  const [mostImpressions, setMostImpressions] = useState('');

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
        email: e,
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
        userID: localStorage.getItem('twitter-user-id'),
      };
      const twitterRes = await axios.get('/twitter/likes', {
        params: twitterQuery,
      });
      if (twitterRes) {
        const tweetsIds = getTweetsID(twitterRes.data.data);
        const twitterLikesQuery = {
          accessToken: twitterToken,
          tweetsIds: tweetsIds,
        };

        const twitterLikesRes = await axios.get('/twitter/tweetNonPublic', {
          params: twitterLikesQuery,
        });

        if (twitterLikesRes) {
            console.log('Received Twitter Likes');
            console.log(twitterLikesRes.data);
            let mostClicks = -1, mostImpressions = -1
            let tweets = twitterLikesRes.data.data;
            tweets.forEach((e) => {
                let values = e.non_public_metrics;
                if (mostClicks < values.user_profile_clicks) {
                    mostClicks = values.user_profile_clicks;
                    setMostClicks({ id: e.id, clicks: values.user_profile_clicks});
                    
                }
                if (mostImpressions < values.impression_count) {
                    mostImpressions = values.impression_count;
                    setMostImpressions({ id: e.id, impression_count: values.impression_count});
                    
                }
            });
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
    <div>
      <Card
        style={{ borderColor: 'var(--twitter)' }}
        className={styles.socialsCard}
      >
          <h3 data-tip={hasToolTips() ? 'Your most viewed tweet' : ''}>
            You left quite the impression with this one:
          </h3>
          <Tweet
            tweetId={mostImpressions.id}
            className={styles.embedTweets}
            options={{ align: 'center' }}
          />
          <h4>{mostImpressions.impression_count} people saw it</h4>
          <h3 data-tip={hasToolTips() ? 'Your most profile clicks' : ''}>
            This tweet lead you to be to be SEEN:
          </h3>
          <Tweet
            tweetId={mostClicks.id}
            className={styles.embedTweets}
            options={{ align: 'center' }}
          />
          <h4>{mostClicks.clicks} people looked at your profile as a result</h4>
      </Card>
      <ReactTooltip />
    </div>
  );
};

export default TwitterNonPublic;
