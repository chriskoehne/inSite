import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Twitter.module.css';
import { Timeline, Tweet } from 'react-twitter-widgets';
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

const TwitterList = (props) => {
  const [user, setUser] = useState({ email: '', code: '' });
  const [twitterToken, setTwitterToken] = useState('');
  const [mostMember, setMostMember] = useState({});
  const [mostFollower, setMostFollower] = useState({});

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

    const getList = async () => {
        // console.log('Calling Twitter API. Here is localStorage:');
        // console.log(localStorage);
        console.log('yolo')
        const twitterQuery = {
          accessToken: twitterToken,
          userId: localStorage.getItem('twitter-user-id'),
        };
        const twitterRes = await axios.get('/twitter/pinnedLists', {
          params: twitterQuery,
        });
        let mostFollower = -1, mostMember = -1
        let mostFollowerList = {}, mostMemberList = {}
        if (twitterRes) {
          console.log(twitterRes)
          let dataStore = []
          let data = twitterRes.data.data
          data.forEach((e, index) => {
            if (e.member_count > mostMember) {
              mostMember = e.member_count
              mostMemberList = e
            }
            if (e.follower_count > mostFollower) {
              mostFollower = e.follower_count
              mostFollowerList = e
            }
          })
        }
        console.log(mostFollowerList)
        setMostFollower(mostFollowerList)
        setMostMember(mostMemberList)
      // else {
      //   console.log('Could not get Tweets from Twitter for Likes!');
      // }
    };

    if (twitterToken) {
      // console.log('Calling Twitter');
      getList();
    }
  }, [twitterToken]);

  return (
    <div>
      <Card
        style={{ borderColor: 'var(--twitter)' }}
        className={styles.socialsCard}
      >
          <h1>This is your most popular pinned list</h1>
          <Timeline dataSource={{
              sourceType: "list",
              id: mostFollower.id
            }}
            options={{ width: "50vw", height: "90vh" }}
          />
          <h1>This pinned list has the most accounts</h1>
          <Timeline dataSource={{
              sourceType: "list",
              id: mostMember.id
            }}
            options={{ width: "50vw", height: "90vh" }}
          />
      </Card>
      <ReactTooltip />
    </div>
  );
};

export default TwitterList;
