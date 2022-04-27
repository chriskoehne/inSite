import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';
import LineChart from '../Charts/LineChart';
import { SocialIcon } from 'react-social-icons';
import ReactTooltip from 'react-tooltip';
import hasToolTips from '../../helpers/hasToolTips';
import LineChartDemo from '../Charts/LineChartDemo';

const TwitchCard = (props) => {
  const [user, setUser] = useState({ email: '', code: '' });
  const [loading, setLoading] = useState(false);
  const [twitchToken, setTwitchToken] = useState('');

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
        JSON.stringify({ token: ans.data.twitch.access_token, date: Date.now() })
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
      // console.log(result.data);
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

    // const getUser = async () => {
    //   // console.log('Calling Twitter API. Here is localStorage:');
    //   // console.log(localStorage);
    //   console.log('Calling getUser');
    //   const twitterQuery = {
    //     accessToken: twitterToken,
    //   };
    //   const twitterRes = await axios.get('/twitter/getUser/', {
    //     params: twitterQuery,
    //   });
    //   if (twitterRes) {
    //     //console.log('Received Tweets from Twitter!');
    //     console.log('This is the user data');
    //     console.log(twitterRes.data);
    //     console.log('This is the user id');
    //     console.log(twitterRes.data.data.id);
    //     localStorage.setItem('twitter-user-id', twitterRes.data.data.id);
    //     setUserId(twitterRes.data.data.id);
    //   }
    //   // else {
    //   //   console.log('Could not get Tweets from Twitter!');
    //   // }
    // };

    // if (twitterToken) {
    //   // console.log('Calling Twitter');
    //   getUser();
    // }
  }, [twitchToken]);

//   useEffect(() => {
//     if (!hasToken() && twitterToken && userId) {
//       localStorage.setItem(
//         'twitterToken',
//         JSON.stringify({ token: twitterToken, date: Date.now() })
//       );
//     }

//     const callTwitter = async () => {
//       // console.log('Calling Twitter API. Here is localStorage:');
//       // console.log(localStorage);
//       const id = localStorage.getItem('twitter-user-id');
//       console.log('TWITTER ID IN CARD: ' + id);
//       const twitterQuery = {
//         accessToken: twitterToken,
//         userId: userId,
//       };
//       const twitterRes = await axios.get('/twitter/tweetCount/', {
//         params: twitterQuery,
//       });
//       if (twitterRes) {
//         console.log('Received Tweets from Twitter!');
//         console.log(twitterRes.data);
//         let timeArr = twitterRes.data;
//         //console.log('TIMEARR: ' + timeArr)
//         let dayDate = getDays(timeArr);
//         let dayDataset = {
//           labels: dayDate.daysOfWeek.reverse(),
//           datasets: [
//             {
//               label: 'Number of Tweets in last week',
//               data: dayDate.numTweets.reverse(),
//               borderColor: '#05aced',
//               backgroundColor: '#05aced',
//             },
//           ],
//         };
//         setChartDayData(dayDataset);
//       } else {
//         console.log('Could not get Tweets from Twitter!');
//       }
//     };

//     if (twitterToken && userId) {
//       console.log('Calling Twitter');
//       callTwitter();
//     }
//   }, [twitterToken, userId]);

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
                    state: { email: user.email, accessToken: twitchToken },
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
