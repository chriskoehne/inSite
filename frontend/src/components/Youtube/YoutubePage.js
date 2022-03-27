import React, { useEffect, useState } from 'react';
import { Row, Card, Col, Carousel, Button, ButtonGroup } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Youtube.module.css';

const YoutubePage = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [youtubeToken, setYoutubeToken] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);
  const [activity, setActivity] = useState([]);
  const [likedVids, setLikedVids] = useState([]);


  const hasToken = () => {
    if (!localStorage.hasOwnProperty('youtubeToken')) {
      return false;
    }
    const token = JSON.parse(localStorage.getItem('youtubeToken'));
    if ((Date.now() - token.date) / 36e5 >= 1) {
      localStorage.removeItem('youtubeToken');
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!hasToken()) {
      navigate('/dashboard');
    } else {
      setYoutubeToken(JSON.parse(localStorage.getItem('youtubeToken')).token);
    }
    //TODO: replace below following process in https://betterprogramming.pub/stop-lying-to-react-about-missing-dependencies-10612e9aeeda
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!youtubeToken) {
      setLoading(true);
      return;
    }
    const getData = async () => {
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

        }
      }
      const likedVids = await axios.get('/youtube/likedVideos');
      console.log("vids:")
      console.log(likedVids)
      setLikedVids(likedVids.data.list)
      setLoading(false);
    };
    getData();
  }, [youtubeToken]);

  const isDarkMode = () => {
    return document.body.classList.contains('dark') ? 'light' : 'dark';
  };

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };



  return loading ? (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <h1 style={{ color: 'var(--primary)' }}>Loading...</h1>
    </div>
  ) : (
    <div className={styles.box}>
      <Carousel
        variant={isDarkMode()}
        className={styles.slideshow}
        activeIndex={index}
        onSelect={handleSelect}
      >
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
            <Row>
              <Col>
                <Row>Smthg youtube related</Row>
              </Col>
            </Row>
          </Card>
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
          <h3>Subscribed Channels</h3>
            <div>
            {subscriptions && subscriptions.map(sub =>
                        <tr key={sub.id}>
                            <td>{sub.snippet.title}</td>
                            <img src={sub.snippet.thumbnails.medium.url}/>
                        </tr>
                    )}
            </div>
          </Card>
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
          <h3>Liked Videos</h3>
            <div>
            {likedVids && likedVids.map(vid =>
                        <tr key={vid.id}>
                            <td>{vid.snippet.title}</td>
                            <td>view count: {vid.statistics.viewCount} like count: {vid.statistics.likeCount}</td>
                            <img src={vid.snippet.thumbnails.medium.url}/>
                        </tr>
                    )}
            </div>
          </Card>
        </Carousel.Item>
      </Carousel>
    </div>
  );

};

export default YoutubePage;
