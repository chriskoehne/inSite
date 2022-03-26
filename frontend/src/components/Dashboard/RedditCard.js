import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';
import { SocialIcon } from 'react-social-icons';
import BarChart from '../Charts/BarChart';

const RedditCard = (props) => {
  const [redditToken, setRedditToken] = useState('');
  const [user, setUser] = useState({ email: '', code: '' });
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [me, setMe] = useState({});

  const hasToken = () => {
    if (!localStorage.hasOwnProperty('redditToken')) {
      // console.log("no reddit token in localstorage")
      return false;
    }
    const date = JSON.parse(localStorage.getItem('redditToken')).date;
    if ((Date.now() - date) / 36e5 >= 1) {
      // console.log("too old reddit token")
      localStorage.removeItem('redditToken');
      return false;
    }
    // console.log("yea localstorage has the reddit token")
    return true;
  };

  useEffect(() => {
    let c = null;
    const e = localStorage.getItem('email');
    const currentUrl = window.location.href;
    if (currentUrl.includes('state=reddit')) {
      let start = currentUrl.indexOf('code') + 5;
      const almostCode = currentUrl.substring(start);
      c = almostCode.substring(0, almostCode.length - 2);
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
    const convert = async () => {
      setLoading(true);
      if (!user.code) {
        setLoading(false);
        return;
      }
      const result = await axios.post('/reddit/codeToToken/', {
        code: user.code,
      });
      if (result.data.accessToken) {
        const token = result.data.accessToken;
        localStorage.setItem(
          'redditToken',
          JSON.stringify({ token: token, date: Date.now() })
        );
        setRedditToken(token);
      } else {
        // console.log('could not convert token');
      }
      setLoading(false);
    };

    if (!hasToken() && user.code) {
      convert();
    } else if (hasToken()) {
      setRedditToken(JSON.parse(localStorage.getItem('redditToken')).token);
    }
  }, [user]);

  useEffect(() => {
    if (!hasToken() && redditToken) {
      localStorage.setItem(
        'redditToken',
        JSON.stringify({ token: redditToken, date: Date.now() })
      );
    }

    const callReddit = async () => {
      setLoading(true);
      const redditMeQuery = {
        accessToken: redditToken,
      };
      if (me && !me.name) {
        const ansMe = await axios.get('/reddit/me', {
          params: redditMeQuery,
        });

        if (ansMe.status === 200) {
          setMe(ansMe.data);
          const redditUserQuery = {
            accessToken: redditToken,
            username: ansMe.data.name,
          };
          const ansOverview = await axios.get('/reddit/userOverview', {
            params: redditUserQuery,
          });
          if (ansOverview.status === 200) {
            setComments(ansOverview.data.comments);

          }

          // console.log('loading done');
        }
      }
      setLoading(false);
    };
    if (redditToken) {
      callReddit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redditToken]);

  const authenticateReddit = async (e) => {
    e.preventDefault();
    const result = await axios.post('/reddit/login/', {
      email: user.email,
    });
    if (result.data.success) {
      // console.log('got the link!');
      window.location.href = result.data.link;
    } else {
      // console.log('there was an error in Reddit user signup');
    }
  };

  const getScores = (list) => {
    if (loading) {
      return [];
    }
    let scores = [];
    list.forEach(function (item, index) {
      scores.push(item.score);
    });
    return scores;
  };

  const getMaxScore = (list) => {
    if (loading) {
      return {};
    }
    var maxScore = 0;
    list.forEach(function (item, index) {
      if (item.score > maxScore) {
        maxScore = item.score;
      }
    });
    return maxScore;
  };

  const display = () => {
    if (loading) {
      return <h2>Loading...</h2>;
    }

    if (hasToken()) {
      return (
        <BarChart
          data={getScores(comments)}
          maxVal={getMaxScore(comments)}
          label='Comment Scores'
          xaxis='Comment score'
          onClick={function () {
            props.navigate('reddit', {
              state: { email: user.email, accessToken: redditToken },
            });
          }}
        />
      );
    } else {
      return (
        <div className={styles.centered}>
          <Button className={`${styles.buttons} ${styles.redditB}`} onClick={authenticateReddit}>
            Authorize Reddit
          </Button>
        </div>
      );
    }
  };
  const icon = () => {
    if (redditToken) {
      return <SocialIcon fgColor='white' url='https://reddit.com/user/me' />;
    } else {
      return <SocialIcon fgColor='white' url='https://reddit.com/' />;
    }
  };

  return (
    <Col className={styles.cardCol}>
      <Card
        style={{ borderColor: 'var(--reddit)' }}
        className={styles.socialsCard}
      >
        <Card.Body>
          <Card.Title>{icon()} Reddit</Card.Title>
          <Card.Text></Card.Text>
          <div>{display()}</div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default RedditCard;
