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

const TwitterMost = (props) => {
  const [user, setUser] = useState({ email: '', code: '' });
  const [twitterToken, setTwitterToken] = useState('');
  const [mostLikedTweet, setMostLikedTweet] = useState('');
  const [mostRepliedTweet, setMostRepliedTweet] = useState('');
  const [mostQuotedTweet, setMostQuotedTweet] = useState('');
  const [mostRetweet, setMostRetweet] = useState('');

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
        userId: localStorage.getItem('twitter-user-id'),
      };
      const twitterRes = await axios.get('/twitter/likes', {
        params: twitterQuery,
      });
      if (twitterRes) {
        // console.log('Received Tweets from Twitter!');
        // console.log(twitterRes.data);
        const tweetsIds = getTweetsID(twitterRes.data.data);
        // console.log(tweetsIds);

        const twitterLikesQuery = {
          accessToken: twitterToken,
          tweetsIds: tweetsIds,
        };

        const twitterLikesRes = await axios.get('/twitter/tweetLikes', {
          params: twitterLikesQuery,
        });

        if (twitterLikesRes) {
          console.log('Received Twitter Likes');
          console.log(twitterLikesRes.data);
          let mostLiked = -1,
            mostRetweet = -1,
            mostQuoted = -1,
            mostReplied = -1;
          let tweets = twitterLikesRes.data.data;
          tweets.forEach((e) => {
            let values = e.public_metrics;
            //console.log(e)
            //console.log(values)
            // console.log(mostLiked)
            // console.log(values.like_count)
            if (mostLiked < values.like_count) {
              mostLiked = values.like_count;
              setMostLikedTweet(e.id);
              // console.log(e.id)
            }
            if (mostRetweet < values.retweet_count) {
              mostRetweet = values.retweet_count;
              setMostRetweet(e.id);
            }
            if (mostQuoted < values.quote_count) {
              mostQuoted = values.quote_count;
              setMostQuotedTweet(e.id);
            }
            if (mostReplied < values.reply_count) {
              mostReplied = values.reply_count;
              setMostRepliedTweet(e.id);
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
        <div className={styles.embedTweets}>
          <h3 data-tip={hasToolTips() ? 'Your most liked tweet' : ''}>
            Wow this Tweet was popular:
          </h3>
          <Tweet
            tweetId={mostLikedTweet}
            className={styles.embedTweets}
            options={{ align: 'center' }}
          />
          <h3 data-tip={hasToolTips() ? 'Your most retweeted tweet' : ''}>
            This one must've been worth sharing:
          </h3>
          <Tweet
            tweetId={mostRetweet}
            className={styles.embedTweets}
            options={{ align: 'center' }}
          />
          <h3 data-tip={hasToolTips() ? 'Your most quoted tweet' : ''}>
            People had a lot to say about this one:
          </h3>
          <Tweet
            tweetId={mostQuotedTweet}
            className={styles.embedTweets}
            options={{ align: 'center' }}
          />
          <h3 data-tip={hasToolTips() ? 'Your most replied tweet' : ''}>
            People were BUZZING over this:
          </h3>
          <Tweet
            tweetId={mostRepliedTweet}
            className={styles.embedTweets}
            options={{ align: 'center' }}
          />
        </div>
      </Card>
      <ReactTooltip />
    </div>
  );
};

export default TwitterMost;
