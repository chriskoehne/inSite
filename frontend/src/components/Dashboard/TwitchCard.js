import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';
// import LineChart from '../Charts/LineChart';
import { SocialIcon } from 'react-social-icons';
import ReactTooltip from 'react-tooltip';
import hasToolTips from '../../helpers/hasToolTips';
import LineChartDemo from '../Charts/LineChartDemo';

const TwitchCard = (props) => {
  const [user, setUser] = useState({ email: '', code: '' });
  const [loading, setLoading] = useState(false);
  const [twitchToken, setTwitchToken] = useState('');
  const [userId, setUserId] = useState('');

  const hasToken = () => {
    if (!localStorage.hasOwnProperty('twitchToken')) {
      // console.log("no twitch token in localstorage")
      return false;
    }
    const date = JSON.parse(localStorage.getItem('twitchToken')).date;
    if ((Date.now() - date) / 36e5 >= 1) {
      // console.log("too old reddit token")
      localStorage.removeItem('twitchToken');
      return false;
    }
    // console.log("yea localstorage has the twitch token")
    return true;
  };

  useEffect( async () => {
    let ans = await axios.post('/twitch/check', {
      params: { email: localStorage.getItem('email') },
    });
    // console.log("in twitch card has token")
    // console.log(ans)
    if (ans.data.success) {
      // ans.data.reddit
      localStorage.setItem(
        'twitchToken',
        JSON.stringify({ token: ans.data.twitch.access_token })
      );
      setTwitchToken(ans.data.twitch.access_token);
    } 
  }, []);

  useEffect(() => {
    // console.log("twitch card useeffect")
    let c = null;
    const e = localStorage.getItem('email');
    const currentUrl = window.location.href;
    if (currentUrl.includes('state=twitch')) {
      let start = currentUrl.indexOf('code') + 5;
      let end = currentUrl.indexOf('scope') - 1;
      c = currentUrl.substring(start, end);
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
    const convert = async () => {
      setLoading(true);
      if (!user.code) {
        setLoading(false);
        return;
      }
      const result = await axios.post('/twitch/convert/', {
        code: user.code,
        email: localStorage.getItem('email')
      });
      console.log(result.data);
      if (result.data.accessToken) {
        const token = result.data.accessToken;
        setTwitchToken(token);
        localStorage.setItem(
          'twitchToken',
          JSON.stringify({ token: token, date: Date.now() })
        );
      } else {
        // console.log('could not convert token');
      }
      setLoading(false);
    };

    if (!hasToken() && user.code) {
      convert();
    }
  }, [user]);

  useEffect(() => {
    if (!hasToken() && twitchToken) {
      localStorage.setItem(
        'twitchToken',
        JSON.stringify({ token: twitchToken, date: Date.now() })
      );
    }

    const getUser = async () => {
      console.log('Calling getUser');
      const twitchQuery = {
        accessToken: twitchToken,
      };
      const twitchRes = await axios.get('/twitch/getUser/', {
        params: twitchQuery,
      });
      if (twitchRes) {
        // console.log('This is the user data');
        // console.log(twitchRes.data);
        setUserId(twitterRes.data.data.id);
      }
      // else {
      //   console.log('Could not get User Info from Twitch!');
      // }
    };

    if (twitchToken) {
      // console.log('Calling Twitch');
      getUser();
    }
  }, [twitchToken]);

  const authenticateTwitch = async (e) => {
    e.preventDefault();
    const result = await axios.post('/twitch/login/', {
      email: user.email,
    });
    if (result.data.success) {
      // console.log('got the link!');
      window.location.href = result.data.link;
    } else {
      // console.log('there was an error in Twitter user signup');
    }
  };

  const display = () => {
    if (loading) {
      return <h2>Loading...</h2>;
    }
    if (twitchToken) {
      return (
        <div className={styles.centered}>
          <LineChartDemo />
        </div>
      );
    } else {
      return (
        <div className={styles.centered}>
          <Button
            className={`${styles.buttons} ${styles.twitchB}`}
            onClick={authenticateTwitch}
            data-tip={
              hasToolTips()
                ? 'Connect your Twitch account to inSite to begin seeing your Twitch usage metrics!'
                : ''
            }
          >
            Authorize Twitch
          </Button>
          <ReactTooltip />
        </div>
      );
    }
  };

  const icon = () => {
    return <SocialIcon fgColor='white' url='https://twitch.tv/' />;
  };

  return (
    <Col className={styles.cardCol}>
      <Card
        style={{ borderColor: 'var(--twitch)' }}
        className={styles.socialsCard}
      >
        <Card.Body>
          <Card.Title>
            {icon()} Twitch
            {twitchToken ?
              <Button
                className={`${styles.seeMore} ${styles.twitchB}`}
                data-tip={
                  hasToolTips()
                    ? 'See more insights about your Twitch account'
                    : ''
                }
                style={{ float: 'right' }}
                onClick={function () {
                  props.navigate('twitch', {
                    state: { email: user.email, accessToken: twitchToken, id: userId },
                  });
                }}
              >
                See more
              </Button>
          : null}
          </Card.Title>
          <Card.Text></Card.Text>
          <div>{display()}</div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default TwitchCard;
