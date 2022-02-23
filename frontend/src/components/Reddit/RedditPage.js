import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Card, Col, Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import LineChart from '../Charts/LineChart';
import BarChart from '../Charts/BarChart';
import styles from './Reddit.module.css';
// const c = require('./constants/constants');

const RedditPage = (props) => {
  const [me, setMe] = useState({});
  // const [email, setEmail] = useState(localStorage.getItem('email'));
  const [redditToken, setRedditToken] = useState('');
  const [comments, setComments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [index, setIndex] = useState(0);

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
    if (!hasToken()) {
      props.navigate('/dashboard');
    } else {
      setRedditToken(JSON.parse(localStorage.getItem('redditToken')).token);
    }
  }, []);

  useEffect(() => {
    if (!redditToken) {
      return;
    }
    // Update the document title using the browser API
    console.log('going to attempt to use access token now');
    const redditMeQuery = {
      accessToken: redditToken,
    };
    if (me && !me.name) {
      axios
        .get('http://localhost:5000/reddit/me', { params: redditMeQuery })
        .then((ans) => {
          if (ans) {
            console.log('me request ans - see data name');
            console.log(ans);
            setMe(ans.data);
            //because me contains vital information, such as a username, maybe we should nest all of the calls? or perhaps get one big blob of data from one backend call?
            const redditUserQuery = {
              accessToken: redditToken,
              username: ans.data.name,
            };
            axios
              .get('http://localhost:5000/reddit/userOverview', {
                params: redditUserQuery,
              })
              .then((ans) => {
                if (ans) {
                  console.log('overview request ans - see data');
                  // console.log(ans.data.overview.data);
                  //ans.data.overview.data.children <- a list of objects. Look at 'kind' field
                  console.log(ans);
                  setComments(ans.data.comments);
                  setPosts(ans.data.posts);
                  setMessages(ans.data.messages);
                }
              });
          }
        });
    }
  }, [redditToken]);

  const getMaxScore = (list) => {
    var maxScore = 0;
    list.forEach(function (item, index) {
      if (item.score > maxScore) {
        maxScore = item.score;
      }
    });
    return maxScore;
  };

  const getMaxItem = (list, maxScore) => {
    var maxItem = {};
    list.forEach(function (item, index) {
      if (item.score === maxScore) {
        maxItem = item;
      }
    });
    return maxItem;
  };

  const getScores = (list) => {
    let scores = [];
    list.forEach(function (item, index) {
      scores.push(item.score);
    });
    return scores;
  };

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  //clunky, but follow the above and add to the following if statements for the other social medias

  return !me || !me.name ? (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <h1 style={{ color: '#3d3d3d' }}>Loading...</h1>
    </div>
  ) : (
    <div className={styles.box}>
      <Carousel
        variant='dark'
        className={styles.slideshow}
        activeIndex={index}
        onSelect={handleSelect}
      >
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
            <Row>
              <Col>
                <Row className={styles.chartContainer}>
                  <BarChart
                    data={getScores(posts)}
                    maxVal={getMaxScore(posts)}
                    label='Post Scores'
                    xaxis='post score'
                  />
                </Row>
              </Col>
              <Col>
                Here we see a graphical representation of a user's post scores.
                Each bucket represents the number of posts that fall within the
                range for the score.
              </Col>
            </Row>
          </Card>
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
            <Row>
              <Col>
                <Row className={styles.chartContainer}>
                  <BarChart
                    data={getScores(comments)}
                    maxVal={getMaxScore(comments)}
                    label='Comment Scores'
                    xaxis='Comment score'
                  />
                </Row>
              </Col>
              <Col>
                Here we see a graphical representation of a user's comment
                scores. Each bucket represents the number of comments that fall
                within the range for the score.
              </Col>
            </Row>
          </Card>
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
            <Row>
              Most Upvoted Post
              <Card
                style={{ borderColor: '#3d3d3d' }}
                // className={styles.socialsCard}
              >
                <Card.Body>
                  <Card.Title>
                    {getMaxItem(posts, getMaxScore(posts)).title}
                  </Card.Title>
                  <Card.Text>
                    {getMaxItem(posts, getMaxScore(posts)).selftext}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Row>
            <Row>
              Most Upvoted Comment
              <Card
                style={{ borderColor: '#3d3d3d' }}
                // className={styles.socialsCard}
              >
                <Card.Body>
                  <Card.Title>
                    {getMaxItem(comments, getMaxScore(comments)).link_title}
                  </Card.Title>
                  <Card.Text>
                    {getMaxItem(comments, getMaxScore(comments)).body}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Row>
            <Row>
              Most Upvoted Message
              <Card
                style={{ borderColor: '#3d3d3d' }}
                // className={styles.socialsCard}
              >
                <Card.Body>
                  <Card.Title>
                    {getMaxItem(messages, getMaxScore(messages)).link_title}
                  </Card.Title>
                  <Card.Text>
                    {getMaxItem(messages, getMaxScore(messages)).body}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Row>
          </Card>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default RedditPage;
