import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';
import { SocialIcon } from 'react-social-icons';
import BarChart from '../Charts/BarChart';
import { isFalsy } from '../Reddit/helperFunctions';
import useDidMountEffect from '../../hooks/useDidMountEffect';
import ReactTooltip from 'react-tooltip';
import hasToolTips from '../../helpers/hasToolTips';

const RedditCard = (props) => {
  const [redditToken, setRedditToken] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [hasStored, setHasStored] = useState(false);

  const hasToken = () => {
    if (!localStorage.hasOwnProperty('redditToken')) {
      // console.log("no twitch token in localstorage")
      return false;
    }
    const date = JSON.parse(localStorage.getItem('redditToken')).date;
    if ((Date.now() - date) / 36e5 >= 1) {
      // console.log("too old reddit token")
      localStorage.removeItem('redditToken');
      return false;
    }
    // console.log("yea localstorage has the twitch token")
    return true;
  };
  

  useEffect(() => {
    const doTheThing = async () => {
      let ans = await axios.post('/reddit/check', {
        params: { email: localStorage.getItem('email') },
      });
      // console.log(ans);
      if (ans.data.success && ans.data.reddit.access_token) {
        // ans.data.reddit
        // console.log('in reddit card has token');
        // console.log(ans.data);
        // console.log(ans.data.reddit.access_token);
        localStorage.setItem(
          'redditToken',
          JSON.stringify({
            token: ans.data.reddit.access_token,
            date: Date.now(),
          })
        );
        setRedditToken(ans.data.reddit.access_token);
      }
    };
    doTheThing();
  }, []);

  useEffect(() => {
    const getStoredRedditData = async () => {
      try {
        if (!JSON.parse(localStorage.getItem('settings')).permissions.reddit) {
          // console.log('no permissions');
          return false;
        }
        let ans = await axios.get('/user/reddit', {
          params: { email: localStorage.getItem('email') },
        });
        // console.log(ans.data.message);
        if (
          ans.status === 200 &&
          ans.data.message[0] !== null &&
          !isFalsy(ans.data.message) &&
          !isFalsy(ans.data.message[0].overview)
        ) {
          setHasStored(true);
          setComments(ans.data.message[0].overview.comments);
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
      let c = '';
      const currentUrl = window.location.href;
      // Get the code from the url if redirected
      // console.log(window.performance.getEntriesByType('navigation')[0].type);
      if (currentUrl.includes('state=reddit')) {
        let start = currentUrl.indexOf('code') + 5;
        const almostCode = currentUrl.substring(start);
        c = almostCode.substring(0, almostCode.length - 2);
        setCode(c);
        // will set loading as done after we make call to reddit api
      } else if (await getStoredRedditData()) {
        // console.log('loading done stored1');
        setLoading(false);
      } else if (!hasToken()) { //this could be wrong
        // console.log('loading done stored2');
        setLoading(false)
      }
    };
    doTheThing();
  }, []);

  useDidMountEffect(() => {
    const convert = async () => {
      if (!code) {
        return;
      }
      const result = await axios.post('/reddit/codeToToken/', {
        code: code,
        email: localStorage.getItem('email'),
      });
      // console.log('after conversion');
      // console.log(result);
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
    if (code) {
      convert();
    }
  }, [code]);


  useDidMountEffect(() => {
    if (redditToken) {
      localStorage.setItem(
        'redditToken',
        JSON.stringify({ token: redditToken, date: Date.now() })
      );
    }

    const callReddit = async () => {
      // console.log('called reddit');
      const redditMeQuery = {
        accessToken: redditToken,
      };
      const me = await axios.get('/reddit/me', {
        params: redditMeQuery,
      });

      if (me.status === 200) {
        const redditUserQuery = {
          accessToken: redditToken,
          username: me.data.name,
          email: localStorage.getItem('email'),
        };
        const ansOverview = await axios.get('/reddit/userOverview', {
          params: redditUserQuery,
        });
        if (ansOverview.status === 200) {
          // console.log(ansOverview.data);
          setComments(ansOverview.data.comments);
        } else {
          setComments({});
        }
        /*
        const ansSubKarma = await axios.get('/reddit/userSubKarma', {
          params: redditUserQuery,
        });

        const ansTotalKarma = await axios.get('/reddit/userTotalKarma', {
          params: redditUserQuery,
        }); */
      }
      // console.log('loading done reddit api');
      setLoading(false);
    };
    if (redditToken && !hasStored) {
      callReddit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redditToken]);


  const authenticateReddit = async (e) => {
    e.preventDefault();
    const result = await axios.post('/reddit/login/', {
      email: localStorage.getItem('email'),
    });
    if (result.status === 200) {
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
    } else if (comments !== undefined && comments.length) {
      return (
        <BarChart
          data={getScores(comments)}
          maxVal={getMaxScore(comments)}
          label='Comment Scores'
          xaxis='Comment score'
          color={'#ff4500'}
        />
      );
    } else if (!hasToken()) {
      console.log(localStorage.getItem('redditToken'));
      return (
        <div className={styles.centered}>
          <Button
            className={`${styles.buttons} ${styles.redditB}`}
            onClick={authenticateReddit}
            data-tip={
              hasToolTips()
                ? 'Connect your Reddit account to inSite to begin seeing your Reddit usage metrics!'
                : ''
            }
          >
            Authorize Reddit
          </Button>
          <ReactTooltip />
        </div>
      );
    }
  };
  const icon = () => {
    if (redditToken) {
      return (
        <SocialIcon
          fgColor='white'
          url='https://reddit.com/user/me'
          target='blank'
          rel='noreferrer'
        />
      );
    } else {
      return (
        <SocialIcon
          fgColor='white'
          url='https://reddit.com/'
          target='blank'
          rel='noreferrer'
        />
      );
    }
  };

  const refreshButton = () => {
    return;
    /*
    if (comments !== undefined && comments.length) {
      return (
        <Button
          className={`${styles.refreshButton} ${styles.redditB}`}
          onClick={authenticateReddit}
        >
          <div style={{ paddingBottom: '10px' }}>Refresh Data</div>
        </Button>
      );
    }
    */
  };

  return (
    <Col className={styles.cardCol}>
      <Card
        style={{ borderColor: 'var(--reddit)' }}
        className={styles.socialsCard}
      >
        <Card.Body>
          <Card.Title>
            {icon()} Reddit
            {comments !== undefined && comments.length ? (
              <Button
                className={`${styles.seeMore} ${styles.redditB}`}
                data-tip={
                  hasToolTips()
                    ? 'See more insights about your Reddit, such as most liked, controversial, and disliked post'
                    : ''
                }
                style={{ float: 'right' }}
                onClick={function () {
                  props.navigate('reddit', {
                    state: {
                      email: localStorage.getItem('email'),
                      accessToken: redditToken,
                    },
                  });
                }}
              >
                See more
              </Button>
            ) : null}
          </Card.Title>
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
