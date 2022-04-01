import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';
import LineChart from '../Charts/LineChart';
import { SocialIcon } from 'react-social-icons';
import ReactTooltip from 'react-tooltip';

const c = require('../Reddit/constants/constants');

const TwitterCard = (props) => {
  const [user, setUser] = useState({ email: '', code: '' });
  const [loading, setLoading] = useState(false);
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
    const convert = async () => {
      setLoading(true);
      if (!user.code) {
        setLoading(false);
        return;
      }
      const result = await axios.post('/twitter/codeToToken/', {
        code: user.code,
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
      setLoading(false);
    };

    if (!hasToken() && user.code) {
      convert();
    } else if (hasToken()) {
      setTwitterToken(JSON.parse(localStorage.getItem('twitterToken')).token);
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
      console.log('Calling getUser');
      const twitterQuery = {
        accessToken: twitterToken,
      };
      const twitterRes = await axios.get('/twitter/getUser/', {
        params: twitterQuery,
      });
      if (twitterRes) {
        //console.log('Received Tweets from Twitter!');
        console.log('This is the user data');
        console.log(twitterRes.data);
        console.log('This is the user id');
        console.log(twitterRes.data.data.id);
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
      console.log('TWITTER ID IN CARD: ' + id);
      const twitterQuery = {
        accessToken: twitterToken,
        userId: userId,
      };
      const twitterRes = await axios.get('/twitter/tweetCount/', {
        params: twitterQuery,
      });
      if (twitterRes) {
        console.log('Received Tweets from Twitter!');
        console.log(twitterRes.data);
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
      } else {
        console.log('Could not get Tweets from Twitter!');
      }
    };

    if (twitterToken && userId) {
      console.log('Calling Twitter');
      callTwitter();
    }
  }, [twitterToken, userId]);

  const authenticateTwitter = async (e) => {
    e.preventDefault();
    const result = await axios.post('/twitter/login/', {
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
    if (twitterToken) {
      return (
        <div className={styles.centered}>
                  <LineChart
                    height={'25vh'}
                    width={'45vw'}
                    color={'#03a9f4'}
                    data={chartDayData}
                  />
        </div>
      );
    } else {
      return (
        <div className={styles.centered}>
          <Button className={`${styles.buttons} ${styles.twitterB}`} onClick={authenticateTwitter} data-tip='Connect your Twitter account to inSite to begin seeing your Twitter usage metrics!'>
            Authorize Twitter
          </Button>
          <ReactTooltip/>
        </div>
      );
    }
  };

  const icon = () => {
    return <SocialIcon fgColor='white' url='https://twitter.com/' />;
  };

  return (
    <Col className={styles.cardCol}>
      <Card
        style={{ borderColor: 'var(--twitter)' }}
        className={styles.socialsCard}
      >
        <Card.Body>
          <Card.Title>{icon()} Twitter
            <Button
                className={`${styles.seeMore} ${styles.twitterB}`}
                data-tip="See more insights about your Twitter, such as the words you use most often and your most liked and retweeted Tweets"
                style={{ float: "right" }}
                onClick={function () {
                  props.navigate("twitter", {
                    state: { email: user.email, accessToken: twitterToken },
                  });
                }}
              >
                See more
              </Button>
          </Card.Title>
          <Card.Text></Card.Text>
          <div>{display()}</div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default TwitterCard;
