import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';
import LineChart from '../Charts/LineChart';
import { SocialIcon } from 'react-social-icons';
import BarChart from '../Charts/BarChart';

const YoutubeCard = (props) => {
  const [youtubeToken, setYoutubeToken] = useState('');
  const [user, setUser] = useState({ email: '', code: '' });
  const [loading, setLoading] = useState(false);
  const [updatedToken, setUpdatedToken] = useState('');

  const hasToken = () => {
    if (!localStorage.hasOwnProperty('youtubeToken')) {
      return false;
    }
    const date = JSON.parse(localStorage.getItem('youtubeToken')).date;
    if ((Date.now() - date) / 36e5 >= 1) {
      localStorage.removeItem('youtubeToken');
      return false;
    }
    return true;
  };

  useEffect(() => {
    let c = null;
    const e = localStorage.getItem('email');
    const currentUrl = window.location.href;
    if (currentUrl.includes('code') && currentUrl.includes('scope')) {
        console.log("grabbing code from url")
      let start = currentUrl.indexOf('code') + 5;
      let end = currentUrl.indexOf('&scope');
      c = currentUrl.substring(start, end);
      console.log(c)
    //   c = almostCode.substring(0, almostCode.length - 2);
    }
    setUser({
      email: e,
      code: c,
    });
    console.log(user)
  }, []);


  useEffect(() => {
    const convert = async () => {
      setLoading(true);
      if (!user.code) {
        setLoading(false);
        return;
      }
      console.log("before convert call")
      const result = await axios.post(
        'http://localhost:5000/youtube/codeToToken/',
        { code: user.code }
      );
      console.log("after convert call")
      console.log(result)
      if (result.data.accessToken) {
        const token = result.data.accessToken;
        localStorage.setItem(
          'youtubeToken',
          JSON.stringify({ token: token, date: Date.now() })
        );
        setYoutubeToken(token);
      } else {
        console.log('could not convert token');
      }
      setLoading(false);
    };

    if (!hasToken() && user.code) {
      convert();
    } else if (hasToken()) {
      setYoutubeToken(JSON.parse(localStorage.getItem('youtubeToken')).token);
    }
  }, [user]);

// a separate use effect to store the token in local storage and make a call for the initial graph
//   useEffect(() => {
//     if (!hasToken() && redditToken) {
//       localStorage.setItem(
//         'redditToken',
//         JSON.stringify({ token: redditToken, date: Date.now() })
//       );
//     }

//     const callReddit = async () => {
//       setLoading(true);
//       const redditMeQuery = {
//         accessToken: redditToken,
//       };
//       if (me && !me.name) {
//         const ansMe = await axios.get('http://localhost:5000/reddit/me', {
//           params: redditMeQuery,
//         });

//         if (ansMe.status === 200) {
//           setMe(ansMe.data);
//           const redditUserQuery = {
//             accessToken: redditToken,
//             username: ansMe.data.name,
//           };
//           const ansOverview = await axios.get(
//             'http://localhost:5000/reddit/userOverview',
//             { params: redditUserQuery }
//           );
//           if (ansOverview.status === 200) {
//             setComments(ansOverview.data.comments);
//             setMessages(ansOverview.data.messages);
//             setPosts(ansOverview.data.posts);
//           }

//           console.log('loading done');
//         }
//       }
//       setLoading(false);
//     };
//     if (redditToken) {
//       callReddit();
//     }
//   }, [redditToken]);



  const authenticateYoutube = async (e) => {
    e.preventDefault();
    //create link to go to
    const result = await axios.post('http://localhost:5000/youtube/login/', {
      email: user.email,
    });
    if (result.data.success) {
        console.log('got the link!');
        window.location.href = result.data.link;
      } else {
        console.log('there was an error in Reddit user signup');
      }
    return;
  };




  
  const display = () => {
    if (loading) {
      return <h2>Loading...</h2>;
    }

    if (youtubeToken) {
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
          <Button className={styles.buttons} onClick={authenticateYoutube}>
            Log in to Youtube
          </Button>
        </div>
      );
    }
  };

  const icon = () => {
    return <SocialIcon url='https://youtube.com/kanyewest' />;
  };

  return (
    <Col className={styles.cardCol}>
      <Card style={{ borderColor: '#FF0000' }} className={styles.socialsCard}>
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
