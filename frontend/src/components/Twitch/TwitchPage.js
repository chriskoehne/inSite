import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Row, Card, Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Twitch.module.css';
import LineChart from '../Charts/LineChart';
import { useNavigate } from 'react-router';
import TwitchCreatorSettings from './TwitchCreatorSettings'
import TwitchClips from './TwitchClips';
import TwitchCurrentlyStreaming from './TwitchCurrentlyStreaming';

const TwitchPage = (props) => {
  // const [loading, setLoading] = useState(false);
  const [twitchToken, setTwitchToken] = useState('');
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [userId, setUserId] = useState('');
  const [chartData, setChartData] = useState({
    datasets: [],
  });
  const [channelData, setChannelData] = useState({});
  const [followers, setFollowers] = useState([]);
  const [followersLength, setFollowersLength] = useState(0);
  const [channelInfo, setChannelInfo] = useState({})
  const [gameName, setGameName] = useState('')

  // console.log(loading)

  const isDarkMode = () => {
    return document.body.classList.contains('dark') ? 'light' : 'dark';
  };

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const getDate = (twitchDate) => {
    var original = twitchDate.toString();
    // console.log('original' + original);
    var newDate = new Date(original);
    // console.log('newDate ' + newDate);
    return((newDate.getMonth() + 1) + '/' + newDate.getDate() + '/' + newDate.getFullYear())
  };

  let getData = function (followers_data) {
    let arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let yearArr = ['', '', '', '', '', '', '', '', '', ''];
    let date = new Date();
    let year = date.getFullYear();
    var start_year = year - 9
    // console.log('Date: ' + date + ' Year: ' + year);
    for (let i = 0; i < 10; i++) {
      yearArr[i] = start_year.toString();
      start_year++;
    }
    // console.log("year array:");
    // console.log(yearArr);
    followers_data.data.forEach((e) => {
      // console.log('CREATE TIME: ' + e.followed_at);
      var year = e.followed_at.substring(0, 4)
      var index = yearArr.indexOf(year);
      if (index > -1) {
        arr[index]++;
      }
    });
    return({numFollowsArr: arr, years: yearArr});
  };

  const hasToken = () => {
    if (!localStorage.hasOwnProperty('twitchToken')) {
      // console.log("no twitch token in localstorage")
      return false;
    }
    const date = JSON.parse(localStorage.getItem('twitchToken')).date;
    if ((Date.now() - date) / 36e5 >= 1) {
      // console.log("too old reddit token")
      localStorage.removeItem('twitchToken');
      return false;
    }
    // console.log("yea localstorage has the twitch token")
    return true;
  };

  useEffect(() => {
    if (!hasToken()) {
      navigate('/dashboard');
    } else {
      setTwitchToken(JSON.parse(localStorage.getItem('twitchToken')).token);
    }
    //TODO: replace below following process in https://betterprogramming.pub/stop-lying-to-react-about-missing-dependencies-10612e9aeeda
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasToken() && twitchToken) {
      localStorage.setItem(
        'twitchToken',
        JSON.stringify({ token: twitchToken, date: Date.now() })
      );
    }

    const getUser = async () => {
      // console.log('Calling getUser');
      const twitchQuery = {
        accessToken: twitchToken,
      };
      const twitchRes = await axios.get('/twitch/getUser/', {
        params: twitchQuery,
      });
      if (twitchRes) {
        // console.log('This is the user data');
        // console.log(twitchRes.data);
        var date = getDate(twitchRes.data.data[0].created_at);
        // console.log('Date: ' + twitchRes.data.data[0].created_at);
        twitchRes.data.data[0].created_at = date;
        setChannelData(twitchRes.data.data[0]);
        setUserId(twitchRes.data.data[0].id);
      }
      // else {
      //   console.log('Could not get User Info from Twitch!');
      // }
    };

    if (twitchToken) {
      // console.log('Calling Twitch');
      getUser();
    }
  }, [twitchToken]);

  useEffect(() => {
    if (!hasToken() && twitchToken && userId) {
      localStorage.setItem(
        'twitchToken',
        JSON.stringify({ token: twitchToken, date: Date.now() })
      );
    }

    const callTwitch = async () => {
      // console.log('Calling Twitch Get User Follows');
      const twitchQuery = {
        accessToken: twitchToken,
        id: userId,
      };
      const twitchRes = await axios.get('/twitch/getUserFollows', {
        params: twitchQuery,
      });
      if (twitchRes) {
        // console.log('Received Followers from Twitch!');
        // console.log(twitchRes.data);
        console.log(twitchRes.data.data);
        

        let chart_data = getData(twitchRes.data);
        // console.log(chart_data);
        
        let dataset = {
          labels: chart_data.years,
          datasets: [
            {
              label: 'Number of Followers in the last 10 years',
              data: chart_data.numFollowsArr,
              borderColor: '#6441a5',
              backgroundColor: '#6441a5',
            },
          ],
        };
        setChartData(dataset);

        for (let i = 0; i < 5; i++) {
          var date = getDate(twitchRes.data.data[i].followed_at);
          twitchRes.data.data[i].followed_at = date;
        }
        setFollowersLength(twitchRes.data.data.length);
        setFollowers(twitchRes.data.data.slice(0, 5));

        const twitchChannelRes = await axios.get('/twitch/getChannelInformation', {
          params: twitchQuery,
        });

        if (twitchChannelRes) {
          // console.log('Recieved Channel Data!');
          // console.log(twitchChannelRes.data);
          setGameName(twitchChannelRes.data.data[0].game_name);
          var uri = twitchChannelRes.data.data[0].game_name;
          uri = uri.replace('/', '%2F');
          twitchChannelRes.data.data[0].game_name = uri;
          setChannelInfo(twitchChannelRes.data.data[0]);
        }
      } 
      // else {
      //   console.log('Could not get Followers from Twitch!');
      // }
    };

    if (twitchToken && userId) {
      // console.log('Calling Twitch User Follows');
      callTwitch();
    }
  }, [twitchToken, userId]);
  
  return (
    <div className={styles.box}>
      <Carousel
        variant={isDarkMode()}
        className={styles.slideshow}
        activeIndex={index}
        onSelect={handleSelect}
      >
        <Carousel.Item className={styles.slideshowCard}>
          <Card style={{ borderColor: 'var(--twitch)' }} className={styles.socialsCard} >
            <Row>
            <Col>
              <h1>Profile Info</h1><br/>
              <img src={channelData.profile_image_url} alt="" width="200" height="200"></img><br/>
              <a href={"https://twitch.tv/" + channelData.display_name} style={{color: 'var(--twitch)'}} target="_blank" rel="noreferrer" >
              <h3>{channelData.display_name}</h3>
              </a>
              <div style={{ fontWeight: 'bold', fontSize: 22 }}>
              Total Views: {channelData.view_count}<br/>
              Followers: {followersLength}<br/>
              Bio: {channelData.description}<br/>
              Created On: {channelData.created_at}<br/>
              </div>
            </Col>
            <Col>
              <h1>Five Most Recent Followers</h1><br/>
              {Object.keys(followers).map((key, index) => (
                <div key={index} style={{ fontWeight: 'bold', fontSize: 22 }}>
                  Name:
                  <a href={"https://twitch.tv/" + followers[key].from_name} style={{color: 'var(--twitch)', marginLeft: 3.2}} target="_blank" rel="noreferrer" >{followers[key].from_name}</a>, Followed On: {followers[key].followed_at} 
                </div>
              ))}
            </Col>
            </Row>
            <Row>
              <Col>
              <br/>
              <br/>
              <h1>Most Recent Stream</h1>
              <div style={{ fontWeight: 'bold', fontSize: 22}}>
                Title: {channelInfo.title}<br/>
                Game: <a href={"https://twitch.tv/directory/game/" + channelInfo.game_name} style={{color: 'var(--twitch)'}} target="_blank" rel="noreferrer" >{gameName}</a> <br/>
              </div>
              </Col>
            </Row>
          </Card>
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
            <LineChart
              height={'65vh'}
              width={'75vw'}
              color={'#6441a5'}
              data={chartData}
            />
          </Card>
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <TwitchCreatorSettings />
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <TwitchClips />
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <TwitchCurrentlyStreaming />
        </Carousel.Item>
      </Carousel>
      
    </div>
  );
};

export default TwitchPage;
