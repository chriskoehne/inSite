import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';
import LineChart from '../Charts/LineChart';
import { SocialIcon } from 'react-social-icons';
import ReactTooltip from 'react-tooltip';
import hasToolTips from '../../helpers/hasToolTips';
import useDidMountEffect from '../../hooks/useDidMountEffect';

const c = require('../Reddit/constants/constants');

const TwitterCard = (props) => {
  const [user, setUser] = useState({ email: '', code: '' });
  const [loading, setLoading] = useState(true);
  const [twitterToken, setTwitterToken] = useState('');
  const [chartDayData, setChartDayData] = useState({
    datasets: [],
  });
  const [userId, setUserId] = useState('');

  let getDays = function (wee) {
    let arr = [0, 0, 0, 0, 0, 0, 0];
    let dayArr = ['', '', '', '', '', '', ''];
    let currentYear = new Date();
    // console.log('CURRENT YEAR: ' + (currentYear.getTime() / 1000 - 604800));
    wee.data.forEach((e) => {
      // console.log('CREATE TIME: ' + e.created_at);
      var dt = new Date(e.created_at);
      if (dt >= currentYear.getTime() / 1000 - 604800) {
        let d = new Date(dt * 1000); //get current Date
        arr[d.getDay()] += 1;
      }
    });
    for (let i = 0; i < 7; i++) {
      let x = new Date();
      x.setDate(x.getDate() - i);
      dayArr[i] = c.WEEK[x.getDay()];
    }
    let numComm = [0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 7; i++) {
      numComm[i] = arr[c.WEEKKEY[dayArr[i]]];
    }
    return { daysOfWeek: dayArr, numTweets: numComm };
  };

  /* checks if localstorage has the token*/
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

  /* gets the token from the database and sets it if there is one*/
  useEffect(() => {
    const doTheThing = async () => {
      let ans = await axios.post('/twitter/check', {
        params: { email: localStorage.getItem('email') },
      });
      // console.log('in twitter card has token');
      // console.log(ans);
      if (ans.data.success) {
        // ans.data.reddit
        localStorage.setItem(
          'twitterToken',
          JSON.stringify({ token: ans.data.twitter.access_token })
        );
        setTwitterToken(ans.data.twitter.access_token);
      } else {
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
          setLoading(false)
        }
      }
    };
    doTheThing();
  }, []);



  useDidMountEffect(() => {
    const convert = async () => {
      if (!user.code) {
        setLoading(false);
        return;
      }
      const result = await axios.post('/twitter/codeToToken/', {
        code: user.code,
        email: user.email,
      });
      // console.log(result.data);
      if (result.data.accessToken) {
        const token = result.data.accessToken;
        setTwitterToken(token);
        localStorage.setItem(
          'twitterToken',
          JSON.stringify({ token: token, date: Date.now() })
        );
      } else {
        // console.log('could not convert token');
      }
      console.log('uers');
      setLoading(false);
    };

    if (user.code) {
      convert();
    } else {
      console.log('yarp');
    }
  }, [user]);

  useEffect(() => {
    if (!hasToken() && twitterToken) {
      localStorage.setItem(
        'twitterToken',
        JSON.stringify({ token: twitterToken, date: Date.now() })
      );
    }

    const getUser = async () => {
      // console.log('Calling Twitter API. Here is localStorage:');
      // console.log(localStorage);
      // console.log('Calling getUser');
      const twitterQuery = {
        accessToken: twitterToken,
      };
      const twitterRes = await axios.get('/twitter/getUser/', {
        params: twitterQuery,
      });
      if (twitterRes) {
        //console.log('Received Tweets from Twitter!');
        // console.log('This is the user data');
        // console.log(twitterRes.data);
        // console.log('This is the user id');
        // console.log(twitterRes.data.data.id);
        localStorage.setItem('twitter-user-id', twitterRes.data.data.id);
        setUserId(twitterRes.data.data.id);
      }
      // else {
      //   console.log('Could not get Tweets from Twitter!');
      // }
    };

    if (twitterToken) {
      // console.log('Calling Twitter');
      getUser();
    }
  }, [twitterToken]);

  useEffect(() => {
    if (!hasToken() && twitterToken && userId) {
      localStorage.setItem(
        'twitterToken',
        JSON.stringify({ token: twitterToken, date: Date.now() })
      );
    }

    const callTwitter = async () => {
      // console.log('Calling Twitter API. Here is localStorage:');
      // console.log(localStorage);
      const id = localStorage.getItem('twitter-user-id');
      // console.log('TWITTER ID IN CARD: ' + id);
      const twitterQuery = {
        accessToken: twitterToken,
        userId: userId,
        email: localStorage.getItem('email'),
      };
      const twitterFollowersRes = axios.get('/twitter/followers', {
        params: twitterQuery,
      });
      const twitterFollowedRes = await axios.get('/twitter/following', {
        params: twitterQuery,
      });
      const twitterRes = await axios.get('/twitter/tweetCount/', {
        params: twitterQuery,
      });
      if (twitterRes) {
        // console.log('Received Tweets from Twitter!');
        // console.log(twitterRes.data);
        let timeArr = twitterRes.data;
        //console.log('TIMEARR: ' + timeArr)
        let dayDate = getDays(timeArr);
        let dayDataset = {
          labels: dayDate.daysOfWeek.reverse(),
          datasets: [
            {
              label: 'Number of Tweets in last week',
              data: dayDate.numTweets.reverse(),
              borderColor: '#05aced',
              backgroundColor: '#05aced',
            },
          ],
        };
        setChartDayData(dayDataset);
        const twitterFollowersRes = axios.get('/twitter/followers', {
          params: twitterQuery,
        });
        const twitterFollowedRes = await axios.get('/twitter/following', {
          params: twitterQuery,
        });
      } else {
        // console.log('Could not get Tweets from Twitter!');
      }
      setLoading(false);
    };

    if (twitterToken && userId) {
      // console.log('Calling Twitter');
      callTwitter();
    }
  }, [twitterToken, userId]);

  // useDidMountEffect(() => {
  //   if (!user.code && !twitterToken) {
  //     console.log('yarp')
  //     setLoading(false)
  //   }
  // })

  const authenticateTwitter = async (e) => {
    e.preventDefault();
    const result = await axios.post('/twitter/login/', {
      email: user.email,
    });
    if (result.status === 200) {
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
    if (twitterToken) {
      return (
        <div className={styles.centered} style={{marginTop: '5%'}}>
          <LineChart
            height={'20vh'}
            width={'45vw'}
            color={'#03a9f4'}
            data={chartDayData}
          />
        </div>
      );
    } else {
      return (
        <div className={styles.centered}>
          <Button
            className={`${styles.buttons} ${styles.twitterB}`}
            onClick={authenticateTwitter}
            data-tip={
              hasToolTips()
                ? 'Connect your Twitter account to inSite to begin seeing your Twitter usage metrics!'
                : ''
            }
          >
            Authorize Twitter
          </Button>
          <ReactTooltip />
        </div>
      );
    }
  };

  const icon = () => {
    return (
      <SocialIcon
        fgColor='white'
        url='https://twitter.com/'
        target='blank'
        rel='noreferrer'
      />
    );
  };

  return (
    <Col className={styles.cardCol}>
      <Card
        style={{ borderColor: 'var(--twitter)' }}
        className={styles.socialsCard}
      >
        <Card.Body>
          <Card.Title>
            {icon()} Twitter
            {twitterToken && chartDayData.datasets.length ? (
              <Button
                className={`${styles.seeMore} ${styles.twitterB}`}
                data-tip={
                  hasToolTips()
                    ? 'See more insights about your Twitter, such as the words you use most often and your most liked and retweeted Tweets'
                    : ''
                }
                style={{ float: 'right' }}
                onClick={function () {
                  props.navigate('twitter', {
                    state: { email: user.email, accessToken: twitterToken },
                  });
                }}
              >
                See more
              </Button>
            ) : null}
          </Card.Title>
          <Card.Text></Card.Text>
          <div>{display()}</div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default TwitterCard;
