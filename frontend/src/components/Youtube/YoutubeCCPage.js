import React, { useEffect, useState } from 'react';
import { Button, Row, Card, Carousel, Container, ButtonGroup } from 'react-bootstrap';
import BarChart from '../Charts/BarChart';
import axios from 'axios';
import { useNavigate } from 'react-router';
import LineChart from '../Charts/LineChart';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getMonths, getDays, getLastThirty } from './mySubscribers';
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
  const [myPopularVids, setMyPopularVids] = useState([]);
  const [commentGraphDay, setCommentGraphDay] = useState(true);
  const [commentGraphThirty, setCommentGraphThirty] = useState(false);
  const [commentGraphMonth, setCommentGraphMonth] = useState(false);
  const [mySubscribers, setMySubscribers] = useState([]);
  const [myPopularCat, setMyPopularCat] = useState([]);
  const [activity, setActivity] = useState([]);
  const [likedVids, setLikedVids] = useState([]);
  //const [mostSubscribers, setMostSubscribers] = useState([]);
  const [popularVidsFromLiked, setPopularVids] = useState([]);
  //const [popularVidsCategory, setPopularVidsCategory] = useState('');
  const [playlistCounts, setPlaylistCounts] = useState([]);
  const [maxCatString, setMaxCatString] = useState('');
  const [finalArr, setFinalArr] = useState([]);
  const [chartMonthData, setChartMonthData] = useState({
    datasets: [],
  });
  const [chartDayData, setChartDayData] = useState({
    datasets: [],
  });
  const [chartThirtyData, setChartThirtyData] = useState({
    datasets: [],
  });
  
  const commentMonthClick = () => {
    setCommentGraphDay(false);
    setCommentGraphThirty(false);
    setCommentGraphMonth(true);
  };

  const commentWeekClick = () => {
    setCommentGraphDay(false);
    setCommentGraphThirty(true);
    setCommentGraphMonth(false);
  };

  const commentDayClick = () => {
    setCommentGraphDay(true);
    setCommentGraphThirty(false);
    setCommentGraphMonth(false);
  };

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

  function mode(array) {
    if(array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
  }

  function getUnique(array, maxCat) {
    let i = 0;
    let j = 0;
    let cat = 0;
    let uCat = 0;
    let found = false
    const allArr = []
    for (i = 0; i < array.length; i++) {
      cat = array[i]
      if (cat != maxCat) {
       for (j = 0; j < allArr.length; j++) {
         uCat = allArr[j]
          if (uCat == cat) {
            found = true;
            break;
          }
        } 
        if (found == true) {
          continue;
        }
        else {
          allArr.push(cat)
        }
        found = false
      }
    }
    return allArr;

  }
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
    const subs = await axios.get('/youtube/channelInfo', {params: {client: youtubeToken}});
      console.log('got channelInfo');
      console.log(subs);
      if (subs.status === 200) {
        setSubscriptions(subs.data.list);
      }
     let channelId = subs.data.list[0].id

     console.log("CHANNEL ID IS: " + channelId)

    
     const vids = await axios.get('/youtube/videoList', {params: {client: youtubeToken, channelId: channelId}});
      console.log('got videoList');
      console.log(vids);
      if (vids.status === 200) {
        setVideoList(vids.data.list);
      }
      
      const myPopularVids = await axios.get('/youtube/myPopularVids', {params: {client: youtubeToken}});
      console.log('got myPopularVids');
      console.log(myPopularVids);
      if (myPopularVids.status === 200) {
        setMyPopularVids(myPopularVids.data.list);
      }
      
      const myPopularCat = await axios.get('/youtube/myPopularCat', {params: {client: youtubeToken}});
      console.log('got myPopularCat');
      console.log(myPopularCat);
      if (myPopularCat.status === 200) {
        setMyPopularCat(myPopularCat.data.list);
      }

      const catArr = [] 

      

      let index = 0;
      for (index = 0; index < myPopularCat.data.list.length; index++) {
        let videoId = myPopularCat.data.list[index].id.videoId
        console.log("videoId: " + videoId)



        const myVidCats = await axios.get('/youtube/myVidCats',  {params: {client: youtubeToken, videoId: videoId }});
        console.log('got myVidCats');
        console.log(myVidCats);
        if (myVidCats.status === 200) {
          const catId = myVidCats.data.list[0].snippet.categoryId
          console.log("catId: " + catId)
          catArr.push(catId)
        }
      }
      

      const maxCat = mode(catArr)

      console.log("VALUE OF MAXCAT IS: " + maxCat)
      console.log("STRING OF MAXCAT IS: " + c[maxCat])

      setMaxCatString(c[maxCat])

      let lastArr = getUnique(catArr, maxCat)

      setFinalArr(lastArr)
      
      const mySubscribers = await axios.get('/youtube/mySubscribers', {params: {client: youtubeToken}});
      console.log('got mySubscribers');
      console.log(mySubscribers);
      if (mySubscribers.status === 200) {
        setMySubscribers(mySubscribers.data.list);
      }
      let monthsData = getMonths(mySubscribers.data.list);
    let monthsDataset = {
      labels: monthsData.monthYear.reverse(),
      datasets: [
        {
          label: 'Number of Subscribers',
          data: monthsData.numSubscribers.reverse(),
          borderColor: '#ff4500',
          backgroundColor: '#ff4500',
          xaxis: 'Months',
        },
      ],
    };
    let dayDate = getDays(mySubscribers.data.list);
    let dayDataset = {
      labels: dayDate.daysOfWeek.reverse(),
      datasets: [
        {
          label: 'Number of Subscribers',
          data: dayDate.numSubscribers.reverse(),
          borderColor: '#ff4500',
          backgroundColor: '#ff4500',
        },
      ],
    };
    let thirtyDate = getLastThirty(mySubscribers.data.list);
    let thirtyDataset = {
      labels: thirtyDate.lastThirty.reverse(),
      datasets: [
        {
          label: 'Number of Subscribers',
          data: thirtyDate.numSubscribers.reverse(),
          borderColor: '#ff4500',
          backgroundColor: '#ff4500',
        },
      ],
    };
    setChartThirtyData(thirtyDataset);
    setChartDayData(dayDataset);
    setChartMonthData(monthsDataset);
    
      /*
      for (index = 0; index < myPopularVids.data.list.length; index++) {
        let videoId = myPopularVids.data.list[index].id.videoId
        //console.log("videoId: " + videoId)

        const youtubeVideoQuery = {
          videoId: videoId
        };

        const myVidComments = await axios.get('/youtube/myVidComments', { params: youtubeVideoQuery });

        
        
        if (myVidComments.status === 200) {
          console.log('got myVidComments');
        console.log(myVidComments);
        }
        
      }
      */

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
          <Card className={styles.channelCard}>
            <Container>
              {subscriptions && subscriptions.map((sub) => (
                  <tr key={sub.id}>
                    <div className={styles.centered}>
                      <h1>Overview of Channel - {sub.snippet.title}</h1>
                    </div >
                    <div>
                      <tr>
                        <a
                        href={'https://youtube.com/c/' + sub.snippet.title}
                        target='_blank'
                        rel='noreferrer'
                      >
                        <img alt='' src={sub.snippet.thumbnails.medium.url} />
                      </a>
                      <b><td style={{fontSize: 22}}> <h3>Description: {sub.snippet.description} </h3>
                      <h3>Number of Subscribers: {sub.statistics.subscriberCount}</h3></td></b>
                      </tr>
                    </div>
                      <h3>
                        Videos: List of Videos ({sub.statistics.videoCount} videos)
                      </h3>
                    
                  </tr>
                ))}
            
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
            </Container>
          </Card>
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.channelCard}>
            <Container>
              <div className={styles.centered}>
                <h1>Your Top 5 Most Popular Videos!</h1>
              </div >
              {myPopularVids && myPopularVids.map((pop) => (
                  <tr key={pop.id}>
                    <div>
                    <td>{pop.snippet.title}</td>
                      <tr>
                        <a
                        href={'https://youtube.com/c/' + pop.snippet.title}
                        target='_blank'
                        rel='noreferrer'
                      >
                        <img alt='' src={pop.snippet.thumbnails.medium.url} />
                      </a>
                      </tr>
                    </div>
                    
                  </tr>
                ))}
            </Container>
          </Card>
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.channelCard}>
            <Container>
              <div className={styles.centered}>
                <h1>Out of all your videos, you uploaded the most videos in the {maxCatString} category!</h1>
              </div >
              
              <div className={styles.centered}>
                <h2>You also have uploaded videos in these following categories: 
                {finalArr && finalArr.map((cat) => (
                  <Row className={styles.centered}>
                    <h3>{c[cat]}</h3>
                </Row>
                ))}
                </h2>
              </div >
            </Container>
          </Card>
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.channelCard}>
            <Row>
              <h1>My Subscribers over time</h1>

              <div className={styles.chartContainer}>
                {commentGraphMonth ? (
                  <LineChart
                    height={'50vh'}
                    width={'75vw'}
                    color={'#ff4500'}
                    data={chartMonthData}
                  />
                ) : null}
                {commentGraphDay ? (
                  <LineChart
                    height={'50vh'}
                    width={'75vw'}
                    color={'#ff4500'}
                    data={chartDayData}
                  />
                ) : null}
                {commentGraphThirty ? (
                  <LineChart
                    height={'50vh'}
                    width={'75vw'}
                    color={'#ff4500'}
                    data={chartThirtyData}
                  />
                ) : null}
              </div>
              <ButtonGroup aria-label='Basic example'>
                <Button variant='secondary' onClick={commentDayClick}>
                  Past Week
                </Button>
                <Button variant='secondary' onClick={commentWeekClick}>
                  Past Month
                </Button>
                <Button variant='secondary' onClick={commentMonthClick}>
                  Past Year
                </Button>
              </ButtonGroup>
            </Row>
          </Card>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default YoutubeCCPage;
