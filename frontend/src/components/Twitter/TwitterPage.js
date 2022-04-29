import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Twitter.module.css';
import TwitterWordGraph from './TwitterWordGraph';
import LineChart from '../Charts/LineChart';
import { useNavigate } from 'react-router';
import TwitterFollows from './TwitterFollows';
import TwitterMost from './TwitterMost';
import TwitterLikesGraph from './TwitterLikesGraph';
import TwitterList from './TwitterList'; 
import TwitterNonPublic from './TwitterNonPublic';
import TwitterMutes from './TwitterMutes';
import TwitterFollowersHistory from './TwitterFollowersHistory';

const c = require('../Reddit/constants/constants');

const TwitterPage = (props) => {
  const [twitterToken, setTwitterToken] = useState('');
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [chartDayData, setChartDayData] = useState({
    datasets: [],
  });

  console.log(loading)

  const isDarkMode = () => {
    return document.body.classList.contains('dark') ? 'light' : 'dark';
  };

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const hasToken = () => {
    if (!localStorage.hasOwnProperty('twitterToken')) {
      return false;
    }
    const token = JSON.parse(localStorage.getItem('twitterToken'));
    if ((Date.now() - token.date) / 36e5 >= 1) {
      localStorage.removeItem('twitterToken');
      return false;
    }
    return true;
  };

    useEffect(() => {
      if (!hasToken()) {
        navigate('/dashboard');
      } else {
        setTwitterToken(JSON.parse(localStorage.getItem('twitterToken')).token);
      }
      //TODO: replace below following process in https://betterprogramming.pub/stop-lying-to-react-about-missing-dependencies-10612e9aeeda
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  useEffect(() => {
    if (!hasToken() && twitterToken) {
      localStorage.setItem(
        'twitterToken',
        JSON.stringify({ token: twitterToken, date: Date.now() })
      );
    }
  
    const getUser = async () => {
      // console.log('Calling Twitter API. Here is localStorage:');
      // console.log(localStorage);
      console.log('Calling getUser');
      const twitterQuery = {
        accessToken: twitterToken
      };
      const twitterRes = await axios.get(
        '/twitter/getUser/',
        { params: twitterQuery }
      );
      if (twitterRes) {
        //console.log('Received Tweets from Twitter!');
        console.log('This is the user data')
        console.log(twitterRes.data);
        console.log('This is the user id')
        console.log(twitterRes.data.data.id)
        localStorage.setItem('twitter-user-id', twitterRes.data.data.id)
        setUserId(twitterRes.data.data.id)
      } 
      // else {
      //   console.log('Could not get Tweets from Twitter!');
      // }
    };

    if (twitterToken) {
      // console.log('Calling Twitter');
      getUser();
    }
  }, [twitterToken]);
  
    useEffect(() => {
      if (!twitterToken) {
        setLoading(true);
        return;
      }


      let getDays = function(wee) {
        let arr = [0, 0, 0, 0, 0, 0, 0];
        let dayArr = ['', '', '', '', '', '', ''];
        let currentYear = new Date()
        // console.log('CURRENT YEAR: ' + (currentYear.getTime()/1000 - 604800))
        wee.data.forEach(e => {
            // console.log('CREATE TIME: ' + e.created_at)
            var dt = new Date(e.created_at)
            if (dt >= currentYear.getTime() / 1000 - 604800) {
                let d = new Date(dt * 1000); //get current Date
                arr[d.getDay()] += 1;
            }
        });
        for (let i = 0; i < 7; i++) {
            let x = new Date();
            x.setDate(x.getDate() - i)
            dayArr[i] = c.WEEK[x.getDay()]
        }
        let numComm = [0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 7; i++) {
            numComm[i] = arr[c.WEEKKEY[dayArr[i]]]
        } 
        return { daysOfWeek: dayArr, numTweets: numComm }
    }

    const getData = async () => {
      // console.log('Calling Twitter API. Here is localStorage:');
      // console.log(localStorage);
      const id = localStorage.getItem('twitter-user-id')
      setUserId(id);
      // console.log('TWITTER ID IN GET DATA: ' + id)
      const twitterQuery = {
        accessToken: twitterToken,
        userId: id
      };
      const twitterRes = await axios.get(
        '/twitter/tweetCount/',
        { params: twitterQuery }
      );
      if (twitterRes) {
        console.log('Received Tweets from Twitter!');
        console.log(twitterRes.data);
        let timeArr = twitterRes.data
        //console.log('TIMEARR: ' + timeArr)
        let dayDate = getDays(timeArr);
        let dayDataset = {
          labels: dayDate.daysOfWeek.reverse(),
          datasets: [
            {
              label: 'Number of Tweets in last week',
              data: dayDate.numTweets.reverse(),
              borderColor: '#05aced',
              backgroundColor: '#05aced',
            },
          ],
        };
        setChartDayData(dayDataset);
      } 
      else {
        console.log('Could not get Tweets from Twitter!');
      }
    };
    getData();
  }, [twitterToken, userId]);

  return (
    <div className={styles.box}>
      <Carousel
        variant={isDarkMode()}
        className={styles.slideshow}
        activeIndex={index}
        onSelect={handleSelect}
      >
        <Carousel.Item className={styles.slideshowCard}>
          <TwitterFollows />
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <TwitterWordGraph />
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
        <TwitterMost />
        </Carousel.Item>
      <Carousel.Item className={styles.slideshowCard}>
            <Card className={styles.socialsCard}>
            <LineChart
                      height={'65vh'}
                      width={'75vw'}
                      color={'#ff4500'}
                      data={chartDayData}
                    />
            </Card>
          </Carousel.Item>
          <Carousel.Item>
            <TwitterLikesGraph />
          </Carousel.Item>
          <Carousel.Item>
            <TwitterNonPublic />
          </Carousel.Item>
          <Carousel.Item>
            <TwitterMutes />
          </Carousel.Item>
          <Carousel.Item>
            <TwitterList />
          </Carousel.Item>
          <Carousel.Item>
            <TwitterFollowersHistory />
          </Carousel.Item>
      </Carousel>
    </div>
  );

};
export default TwitterPage;
