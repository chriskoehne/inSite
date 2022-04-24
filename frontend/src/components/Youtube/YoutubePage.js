import React, { useEffect, useState } from 'react';
import { Row, Card, Carousel } from 'react-bootstrap';
import BarChart from '../Charts/BarChart';
import axios from 'axios';
import { useNavigate } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Youtube.module.css';
import ReactTooltip from 'react-tooltip';
import hasToolTips from '../../helpers/hasToolTips';

const YoutubePage = (props) => {
  const navigate = useNavigate();
  const c = require('./constants/youtubeCategoryConstants');
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [youtubeToken, setYoutubeToken] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);
  const [activity, setActivity] = useState([]);
  const [likedVids, setLikedVids] = useState([]);
  //const [mostSubscribers, setMostSubscribers] = useState([]);
  const [popularVidsFromLiked, setPopularVids] = useState([]);
  const [popularVidsCategory, setPopularVidsCategory] = useState('');
  const [playlistCounts, setPlaylistCounts] = useState([]);

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
      console.log("in get data, token is")
      console.log(youtubeToken)
      if (activity.length === 0) {
        const act = await axios.get('/youtube/activity', {params: {client: youtubeToken}});
        console.log('got activity:');
        console.log(act);
        if (act.status === 200) {
          setActivity(act.data.list);
          const subs = await axios.get('/youtube/subscriptions', {params: {client: youtubeToken}});
          console.log('got subs');
          console.log(subs);
          if (subs.status === 200) {
            setSubscriptions(subs.data.list);
          }
        }
      }
      const likedVids = await axios.get('/youtube/likedVideos', {params: {client: youtubeToken}});
      console.log('Liked Videos:');
      console.log(likedVids);
      setLikedVids(likedVids.data.list);

      const popularVidsFromLiked = await axios.get('/youtube/popularVidsFromLiked', {params: {client: youtubeToken}});
      console.log('Popular Vids From Liked:');
      console.log(popularVidsFromLiked);
      setPopularVids(popularVidsFromLiked.data.list);
      setPopularVidsCategory(
        c[popularVidsFromLiked.data.list[0].snippet.categoryId]
      );

      const youtubePlaylists = await axios.get('/youtube/playlists', {params: {client: youtubeToken}});
      // for each in youtubePlaylists.data.list:
      // item.contentDetails.itemCount
      let itemCounts = [];
      youtubePlaylists.data.list.forEach((item) => {
        itemCounts.push(item.contentDetails.itemCount);
      });
      setPlaylistCounts(itemCounts);

      setLoading(false);
    };
    getData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeToken]);

  const isDarkMode = () => {
    return document.body.classList.contains('dark') ? 'light' : 'dark';
  };

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const getMaxCount = (list) => {
    if (loading) {
      return {};
    }
    var maxCount = 0;
    list.forEach(function (item, index) {
      if (item > maxCount) {
        maxCount = item;
      }
    });
    return maxCount;
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
            <Row className={styles.chartContainer}>
              <BarChart
                height={'60vh'}
                data={playlistCounts}
                maxVal={getMaxCount(playlistCounts)}
                label='Playlist Counts'
                xaxis='PlaylistCounts'
                color={'#ff3333'}
              />
              <div style={{ paddingTop: '2%' }}>
                Here we see a graphical representation of the number of
                playlists a user has, divided into buckets which represent the
                number of videos per playlist.
              </div>
            </Row>
          </Card>
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
            <h3>Subscribed Channels</h3>
            <div>
              {subscriptions &&
                subscriptions.map((sub) => (
                  <tr key={sub.id}>
                    <td>{sub.snippet.title}</td>
                    <a
                      href={'https://youtube.com/c/' + sub.snippet.title}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <img alt='' src={sub.snippet.thumbnails.medium.url} />
                    </a>
                  </tr>
                ))}
            </div>
          </Card>
        </Carousel.Item>

        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
            <h3>Liked Videos</h3>
            <div>
              {likedVids &&
                likedVids.map((vid) => (
                  <tr key={vid.id}>
                    <td>{vid.snippet.title}</td>
                    <td>
                      view count: {vid.statistics.viewCount} like count:{' '}
                      {vid.statistics.likeCount}
                    </td>
                    <a
                      href={'https://youtube.com/watch?v=' + vid.id}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <img alt='' src={vid.snippet.thumbnails.medium.url} />
                    </a>
                  </tr>
                ))}
            </div>
          </Card>
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
            <h3>Popular Videos From Your Favorite Category</h3>
            <h3
              data-tip={
                hasToolTips()
                  ? "Based on YouTube's most popular categories, such as music, gaming, and entertainment"
                  : ''
              }
            >
              {popularVidsCategory}
            </h3>
            <div>
              {popularVidsFromLiked &&
                popularVidsFromLiked.map((vid) => (
                  <tr key={vid.id}>
                    <td>{vid.snippet.title}</td>
                    <td>
                      view count: {vid.statistics.viewCount} like count:{' '}
                      {vid.statistics.likeCount}
                    </td>
                    <a
                      href={'https://youtube.com/watch?v=' + vid.id}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <img alt='' src={vid.snippet.thumbnails.medium.url} />
                    </a>
                  </tr>
                ))}
            </div>
          </Card>
        </Carousel.Item>
      </Carousel>
      <ReactTooltip />
    </div>
  );
};

export default YoutubePage;
