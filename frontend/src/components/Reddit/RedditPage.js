import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Navbar, Row, Card, Col, Carousel } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LineChart from '../Charts/LineChart';
import styles from './Reddit.module.css';
const c = require('./constants/constants');

const RedditPage = (props) => {
  const { state } = useLocation();
  const [me, setMe] = useState({});
  const [comments, setComments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [posts, setPosts] = useState([]);
  // use state.email and state.accessToken

  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Update the document title using the browser API
    console.log('going to attempt to use access token now');
    console.log(state);
    const redditMeQuery = {
      accessToken: state.accessToken,
    };
    if (me && !me.name) {
      axios
        .get('http://localhost:5000/redditMe', { params: redditMeQuery })
        .then((ans) => {
          if (ans) {
            console.log('me request ans - see data name');
            console.log(ans);
            setMe(ans.data);
            //because me contains vital information, such as a username, maybe we should nest all of the calls? or perhaps get one big blob of data from one backend call?
            const redditUserQuery = {
              accessToken: state.accessToken,
              username: ans.data.name,
            };
            axios
              .get('http://localhost:5000/redditUserOverview', {
                params: redditUserQuery,
              })
              .then((ans) => {
                if (ans) {
                  console.log('overview request ans - see data');
                  // console.log(ans.data.overview.data);
                  //ans.data.overview.data.children <- a list of objects. Look at 'kind' field
                  console.log(ans)
                  setComments(ans.data.comments)
                  setPosts(ans.data.posts)
                  setMessages(ans.data.messages)
                }
              });
          }
        });
    }
  }, []);

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
                  <LineChart />
                </Row>
                <Row className={styles.chartContainer}>
                  <LineChart />
                </Row>
              </Col>
              <Col>free karma woop</Col>
            </Row>
          </Card>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default RedditPage;
