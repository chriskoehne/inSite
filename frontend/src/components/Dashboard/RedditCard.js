import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';
import { SocialIcon } from 'react-social-icons';
import BarChart from '../Charts/BarChart';
import { isFalsy } from '../Reddit/helperFunctions';

import useDidMountEffect from '../../hooks/useDidMountEffect';

const RedditCard = (props) => {
  const [redditToken, setRedditToken] = useState('');
  const [user, setUser] = useState({ email: '', code: '', stored: false });
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [me, setMe] = useState({});
  const [hasStored, setHasStored] = useState(false);

  const hasToken = () => {
    if (!localStorage.hasOwnProperty('redditToken')) {
      return false;
    }
    const date = JSON.parse(localStorage.getItem('redditToken')).date;
    if ((Date.now() - date) / 36e5 >= 1) {
      localStorage.removeItem('redditToken');
      return false;
    }
    return true;
  };

  useEffect(() => {
    setLoading(true);
    const getStoredRedditData = async () => {
      try {
        if (!JSON.parse(localStorage.getItem('settings')).permissions.reddit) {
          console.log('no permissions');
          return false;
        }
        let ans = await axios.get('/user/reddit', {
          params: { email: localStorage.getItem('email') },
        });
        if (
          ans.status === 200 &&
          ans.data.message !== null &&
          !isFalsy(ans.data.message)
        ) {
          setComments(ans.data.message.overview.comments);
          setHasStored(true);
          console.log('loading done 1');
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    };
    const doTheThing = async () => {
      let c = null;
      const e = localStorage.getItem('email');
      const currentUrl = window.location.href;

      // Get the code from the url if redirected and add it to the user state
      if (currentUrl.includes('state=reddit')) {
        console.log('here');
        let start = currentUrl.indexOf('code') + 5;
        const almostCode = currentUrl.substring(start);
        c = almostCode.substring(0, almostCode.length - 2);
        setUser({
          email: e,
          code: c,
        });
        console.log('loading done 2');
        setLoading(false);
      } else if (await getStoredRedditData()) {
        setLoading(false);
      } else {
        setUser({
          email: e,
        });
        console.log('loading done 3');
        setLoading(false);
      }
    };
    doTheThing();
  }, []);

  useDidMountEffect(() => {
    const convert = async () => {
      if (!user.code) {
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
    };
    if (!hasToken() && user.code) {
      convert();
    } else if (hasToken()) {
      setRedditToken(JSON.parse(localStorage.getItem('redditToken')).token);
    }
  }, [user]);

  useDidMountEffect(() => {
    if (!hasToken() && redditToken) {
      localStorage.setItem(
        'redditToken',
        JSON.stringify({ token: redditToken, date: Date.now() })
      );
    }

    const callReddit = async () => {
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
            try {
              if (
                JSON.parse(localStorage.getItem('settings')).permissions.reddit
              ) {
                const body = {
                  email: localStorage.getItem('email'),
                  property: 'overview',
                  data: ansOverview.data,
                };

                const storeData = await axios.post('/user/reddit', body);
                console.log(storeData);
              }
            } catch (err) {
              console.log(err);
            }
            setComments(ansOverview.data.comments);
          }
          const ansSubKarma = await axios.get('/reddit/userSubKarma', {
            params: redditUserQuery,
          });
          if (ansSubKarma.status === 200) {
            try {
              if (
                JSON.parse(localStorage.getItem('settings')).permissions.reddit
              ) {
                const body = {
                  email: localStorage.getItem('email'),
                  property: 'subKarma',
                  data: ansSubKarma.data.subKarmaList,
                };

                const storeData = await axios.post('/user/reddit', body);
                console.log(storeData);
              }
            } catch (err) {
              console.log(err);
            }
          }

          const ansTotalKarma = await axios.get('/reddit/userTotalKarma', {
            params: redditUserQuery,
          });
          if (ansTotalKarma.status === 200) {
            try {
              if (
                JSON.parse(localStorage.getItem('settings')).permissions.reddit
              ) {
                const body = {
                  email: localStorage.getItem('email'),
                  property: 'totalKarma',
                  data: ansTotalKarma.data,
                };
                const storeData = await axios.post('/user/reddit', body);
                console.log(storeData);
              }
            } catch (err) {
              console.log(err);
            }
          }
        }
      }
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
      return 0;
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

    if (hasToken() || (comments !== undefined && comments.length)) {
      return (
        <BarChart
          data={getScores(comments)}
          maxVal={getMaxScore(comments)}
          label='Comment Scores'
          xaxis='Comment score'
          color={'#ff4500'}
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
          <Button
            className={`${styles.buttons} ${styles.redditB}`}
            onClick={authenticateReddit}
          >
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

  const refreshButton = () => {
    if (hasStored && !loading) {
      return (
        <Button
          className={`${styles.refreshButton} ${styles.redditB}`}
          onClick={authenticateReddit}
        >
          <div style={{ paddingBottom: '10px' }}>Refresh Data</div>
        </Button>
      );
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
          {/* <div className={styles.refreshButton}>{refreshButton()}</div> */}
          {refreshButton()}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default RedditCard;
