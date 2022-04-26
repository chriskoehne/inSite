import React, { useEffect, useState } from 'react';
import { Button, Row, Card, Carousel } from 'react-bootstrap';
import BarChart from '../Charts/BarChart';
import axios from 'axios';
import { useNavigate } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Youtube.module.css';
import ReactTooltip from 'react-tooltip';
import hasToolTips from '../../helpers/hasToolTips';

const YoutubeCCPage = (props) => {
  
  const navigate = useNavigate();
  const c = require('./constants/youtubeCategoryConstants');
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [youtubeToken, setYoutubeToken] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);
  const [videoList, setVideoList] = useState([]);
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
    const subs = await axios.get('/youtube/channelInfo');
      console.log('got channelInfo');
      console.log(subs);
      if (subs.status === 200) {
        setSubscriptions(subs.data.list);
      }
     let channelId = subs.data.list[0].id

     const youtubeQuery = {
      channelId: channelId
    };

     const vids = await axios.get('/youtube/videoList', { params: youtubeQuery });
      console.log('got videoList');
      console.log(vids);
      if (vids.status === 200) {
        setVideoList(vids.data.list);
      }

      /*
      const likedVids = await axios.get('/youtube/likedVideos');
      console.log('Liked Videos:');
      console.log(likedVids);
      setLikedVids(likedVids.data.list);

      const popularVidsFromLiked = await axios.get(
        '/youtube/popularVidsFromLiked'
      );
      console.log('Popular Vids From Liked:');
      console.log(popularVidsFromLiked);
      setPopularVids(popularVidsFromLiked.data.list);
      setPopularVidsCategory(
        c[popularVidsFromLiked.data.list[0].snippet.categoryId]
      );

      const youtubePlaylists = await axios.get('/youtube/playlists');
      // for each in youtubePlaylists.data.list:
      // item.contentDetails.itemCount
      let itemCounts = [];
      youtubePlaylists.data.list.forEach((item) => {
        itemCounts.push(item.contentDetails.itemCount);
      });
      setPlaylistCounts(itemCounts);
      */
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
            <h3>Overview of Channel - </h3>
            <div>
              {subscriptions &&
                subscriptions.map((sub) => (
                  <tr key={sub.id}>
                    <a
                      href={'https://youtube.com/c/' + sub.snippet.title}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <img alt='' src={sub.snippet.thumbnails.medium.url} />
                    </a>
                    <h1>
                      Videos: List of Videos ({sub.statistics.videoCount} videos)
                    </h1>
                    <td>Number of Subscribers: {sub.statistics.subscriberCount}</td>
                  </tr>
                ))}
            </div>
            <div>
              {videoList && 
                videoList.map((video) => (
                  <tr key={video.id}>
                    <td>{video.snippet.title}</td>
                    <a
                      href={'https://youtube.com/c/' + video.snippet.title}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <img alt='' src={video.snippet.thumbnails.medium.url} />
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

export default YoutubeCCPage;