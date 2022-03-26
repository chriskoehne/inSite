import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';
import { SocialIcon } from 'react-social-icons';
import BarChart from '../Charts/BarChart';

const YoutubeCard = (props) => {
  const [youtubeToken, setYoutubeToken] = useState('');
  const [user, setUser] = useState({ email: '', code: '' });
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [activity, setActivity] = useState([]);

  const hasToken = () => {
    if (!localStorage.hasOwnProperty('youtubeToken')) {
      // console.log("no youtube token in localstorage")
      return false;
    }
    const date = JSON.parse(localStorage.getItem('youtubeToken')).date;
    if ((Date.now() - date) / 36e5 >= 1) {
      // console.log("youtube token too old")
      localStorage.removeItem('youtubeToken');
      return false;
    }
    // console.log("youtube token in localstorage")
    return true;
  };

  useEffect(() => {
    let c = null;
    const e = localStorage.getItem('email');
    const currentUrl = window.location.href;
    if (currentUrl.includes('code') && currentUrl.includes('scope')) {
      // console.log("grabbing code from url")
      let start = currentUrl.indexOf('code') + 5;
      let end = currentUrl.indexOf('&scope');
      c = currentUrl.substring(start, end);
      setUser({
        email: e,
        code: c,
      });
      // console.log(c)
    //   c = almostCode.substring(0, almostCode.length - 2);
    } else {
      setUser({
        email: e
      });
    }
    
    // console.log(user)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    const convert = async () => {
      setLoading(true);
      if (!user.code) {
        setLoading(false);
        return;
      }
      // console.log("before convert call")
      const result = await axios.post(
        '/youtube/codeToToken/',
        { code: user.code }
      );
      // console.log("after convert call")
      // console.log(result)
      if (result.data.accessToken) {
        const token = result.data.accessToken;
        localStorage.setItem(
          'youtubeToken',
          JSON.stringify({ token: token, date: Date.now() })
        );
        setYoutubeToken(token);
      } 
      // else {
      //   console.log('could not convert token');
      // }
      setLoading(false);
    };

    if (!hasToken() && user.code) {
      convert();
    } else if (hasToken()) {
      setYoutubeToken(JSON.parse(localStorage.getItem('youtubeToken')).token);
    }
  }, [user]);

// a separate use effect to store the token in local storage and make a call for the initial graph
  useEffect(() => {
    if (!hasToken() && youtubeToken) {
      localStorage.setItem(
        'youtubeToken',
        JSON.stringify({ token: youtubeToken, date: Date.now() })
      );
    }

    const callYoutube = async () => {
      setLoading(true);
      if (activity.length === 0) {
        const act = await axios.get('/youtube/activity');
        console.log("got activity:");
        console.log(act);
        if (act.status === 200) {
          setActivity(act.data.list);
          const subs = await axios.get('/youtube/subscriptions');
          console.log("got subs");
          console.log(subs);
          if (subs.status === 200) {
            setSubscriptions(subs.data.list);
          }

          // console.log('loading done');
        }
      }
      setLoading(false);
    };
    if (youtubeToken) {
      console.log('Calling YouTube');
      callYoutube();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeToken]);



  const authenticateYoutube = async (e) => {
    e.preventDefault();
    //create link to go to
    const result = await axios.post('/youtube/login/', {
      email: user.email,
    });
    if (result.data.success) {
        // console.log('got the link!');
        window.location.href = result.data.link;
      } else {
        // console.log('there was an error in youtube user signup');
      }
    return;
  };




  
  const display = () => {
    if (loading) {
      return <h2>Loading...</h2>;
    }

    if (hasToken()) {
      return (
        <BarChart
          data={[1, 2, 3, 4]}
        //   maxVal={getMaxScore(comments)}
        //   label='Comment Scores'
        //   xaxis='Comment score'
        color={'#FF0000'}
          onClick={function () {
            props.navigate('youtube', {
              state: { email: user.email, accessToken: youtubeToken },
            });
          }}
        />
      );
    } else {
      return (
        <div className={styles.centered}>
          <Button className={`${styles.buttons} ${styles.youtubeB}`} onClick={authenticateYoutube}>
            Authorize YouTube
          </Button>
        </div>
      );
    }
  };

  const icon = () => {
    return <SocialIcon fgColor='white' url='https://youtube.com/kanyewest' />;
  };

  return (
    <Col className={styles.cardCol}>
      <Card style={{ borderColor: 'var(--youtube)' }} className={styles.socialsCard}>
        <Card.Body>
          <Card.Title>{icon()} Youtube</Card.Title>
          <Card.Text></Card.Text>
          <div>{display()}</div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default YoutubeCard;
