import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';
import LineChart from '../Charts/LineChart';
import { SocialIcon } from 'react-social-icons';
import BarChart from '../Charts/BarChart';

const RedditCard = (props) => {
  const [redditToken, setRedditToken] = useState('');
  const [user, setUser] = useState({ email: '', code: '' });
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [me, setMe] = useState({});

  const hasToken = () => {
    if (!localStorage.hasOwnProperty('redditToken')) {
      return false;
    }
    const token = JSON.parse(localStorage.getItem('redditToken'));
    if ((Date.now() - token.date) / 36e5 >= 1) {
      localStorage.removeItem('redditToken');
      return false;
    }
    return true;
  };

  useEffect(() => {
    let t = localStorage.getItem('redditToken');
    let c = null;
    const e = localStorage.getItem('email');

    const currentUrl = window.location.href;
    if (currentUrl.includes('&')) {
      let start = currentUrl.indexOf('state') + 6;
      start = currentUrl.indexOf('code') + 5;
      const almostCode = currentUrl.substring(start);
      c = almostCode.substring(0, almostCode.length - 2);
    }
    setUser({
      email: e,
      code: c,
    });
    setRedditToken(t);
  }, []);

  useEffect(() => {
    const convert = async () => {
      setLoading(true);
      console.log(user);
      if (!user.code) {
        setLoading(false);
        return;
      }
      console.log('fuck');
      const result = await axios.post(
        'http://localhost:5000/reddit/codeToToken/',
        { code: user.code }
      );
      if (result.data.accessToken) {
        const token = result.data.accessToken;
        console.log(Date.now());
        localStorage.setItem(
          'redditToken',
          JSON.stringify({ token: token, date: Date.now() })
        );
        setRedditToken(token);
        
        console.log("Access token: " + redditToken);
        // Update the document title using the browser API
        console.log('going to attempt to use access token now');
        const redditMeQuery = {
          accessToken: token,
        };
        console.log("reddit queer")
        console.log(redditMeQuery);
        if (me && !me.name) { 
          const ansMe = await axios.get('http://localhost:5000/reddit/me', {
            params: redditMeQuery,
          });

          if (ansMe.status === 200) {
            setMe(ansMe.data);
            //because me contains vital information, such as a username, maybe we should nest all of the calls? or perhaps get one big blob of data from one backend call?
            const redditUserQuery = {
              accessToken: token,
              username: ansMe.data.name,
            };
            const ansOverview = await axios.get(
              'http://localhost:5000/reddit/userOverview',
              { params: redditUserQuery }
            );
            if (ansOverview.status === 200) {
              setComments(ansOverview.data.comments);
              setMessages(ansOverview.data.messages);
              setPosts(ansOverview.data.posts);
            }

            console.log('loading done');
          }
        }
      }
      setLoading(false);
    };
    if (!hasToken() && user.code) {
      convert();
    }
  }, [user]);

  useEffect(() => {
    if (!hasToken() && redditToken) {
      localStorage.setItem('redditToken', redditToken);
    }
  }, [redditToken]);

  const authenticateReddit = async (e) => {
    e.preventDefault();
    const result = await axios.post('http://localhost:5000/reddit/login/', {
      email: user.email,
    });
    console.log(result);
    if (result.data.success) {
      console.log('got the link!');
      window.location.href = result.data.link;
    } else {
      console.log('there was an error in Reddit user signup');
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

    if (redditToken) {
      return (
        <LineChart
          color={'#FF4500'}
          onClick={function () {
            props.navigate('reddit', {
              state: { email: user.email, accessToken: redditToken },
            });
          }}
        />
        // <BarChart
        //   data={getScores(comments)}
        //   maxVal={getMaxScore(comments)}
        //   label='Comment Scores'
        //   xaxis='Comment score'
        // />
      );
    } else {
      return (
        <form onSubmit={authenticateReddit}>
          <div className='form-group'>
            <input type='submit' value='Login' className='btn btn-primary' />
          </div>
        </form>
      );
    }
  };
  const icon = () => {
    if (redditToken) {
      return <SocialIcon url='https://reddit.com/user/me' />;
    } else {
      return null;
    }
  };

  return (
    <Col className={styles.cardCol}>
      <Card style={{ borderColor: '#FF4500' }} className={styles.socialsCard}>
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
