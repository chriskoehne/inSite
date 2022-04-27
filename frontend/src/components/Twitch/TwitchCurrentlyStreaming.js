import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Twitch.module.css';

const TwitchCurrentlyStreaming = (props) => {
  const [twitchToken, setTwitchToken] = useState('');
  const [followedStreams, setFollowedStreams] = useState([]);
  const [subStreams, setSubStreams] = useState([]);

  const getTime = (twitchDate) => {
    var original = twitchDate.toString();
    var index = original.indexOf('T');
    var hour = parseInt(original.substring(index + 1, index + 3));
    var minutes = original.substring(index + 4, index + 6);
    if (hour > 12) {
        return((hour - 12).toString() + ':' + minutes + ' pm')
    } else if (hour === 0) {
        return('12:' + minutes + ' am')
    } else {
        return(hour.toString() + ':' + minutes + ' am')
    }
  };

  const setUrls = (data) => {
    // console.log(data);
    for (let i = 0; i < data.length; i++) {
        var original = data[i].thumbnail_url.toString();
        // console.log("original: " + original);
        var end = original.indexOf("{width}");
        var new_string = original.substring(0, end) + "400x300.jpg";
        // console.log("new: " + new_string);
        data[i].thumbnail_url = new_string;
    }
    // console.log(data);
    setFollowedStreams(data);
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
    setTwitchToken(JSON.parse(localStorage.getItem('twitchToken')).token);
  }, []);

  useEffect(() => {
    // console.log('In Twitch Clips Page useEffect')
    if (!hasToken() && twitchToken) {
      localStorage.setItem(
        'twitchToken',
        JSON.stringify({ token: twitchToken, date: Date.now() })
      );
    }

    const callTwitch = async () => {
    //   console.log('Calling Twitch in Clips Page');
      const twitchQuery = {
        accessToken: twitchToken,
        id: localStorage.getItem('twitch-user-id'),
      };

      const twitchFollowedRes = await axios.get('/twitch/getFollowedStreams', {
        params: twitchQuery,
      });

      if (twitchFollowedRes) {
        // console.log('Received Followed Streams from Twitch!');
        // console.log(twitchFollowedRes.data);
        for (let i = 0; i < 5; i++) {
            var date = getTime(twitchFollowedRes.data.data[i].started_at);
            twitchFollowedRes.data.data[i].started_at = date;
          }
        setUrls(twitchFollowedRes.data.data);
      }

      const twitchSubRes = await axios.get('/twitch/getSubscriptions', {
        params: twitchQuery,
      });

      if (twitchSubRes) {
        // call usually finishes in 5 or so seconds
        console.log('Received Subscriptions from Twitch!');
        console.log(twitchSubRes.data);
        setSubStreams(twitchSubRes.data.data)
      }
    };

    if (twitchToken) {
    //   console.log('Calling Twitch Clips');
      callTwitch();
    }
  }, [twitchToken]);
  
  return (
    <Card className={styles.socialsCard}>
        <Row>
            <h3>Current Subscriptions</h3>
            {Object.keys(subStreams).map((key, index) => (
                <div key={index}>
                  Name: {subStreams[key].broadcaster}, Tier: {subStreams[key].tier / 1000}
                </div>
            ))}
        </Row>
        <Row>
            <h3>Who's Streaming Now?</h3>
            {Object.keys(followedStreams).map((key, index) => (
                <div key={index}>
                  Name: {followedStreams[key].user_name}, Viewers: {followedStreams[key].viewer_count}, Title: {followedStreams[key].title}, Category: {followedStreams[key].game_name}, Started At: {followedStreams[key].started_at} <br/>
                  Watch Now: 
                  <a href={"https://twitch.tv/" + followedStreams[key].user_name} target="_blank" rel="noreferrer">
                      <img src={followedStreams[key].thumbnail_url} alt="" width="100" height="100"></img>
                  </a>
                </div>
            ))}
        </Row>
    </Card>
  );
};

export default TwitchCurrentlyStreaming;
