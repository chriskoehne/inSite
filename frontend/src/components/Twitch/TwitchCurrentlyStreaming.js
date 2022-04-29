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

      const len = twitchFollowedRes.data.data.length;
      if (len > 0) {
        console.log('Received Followed Streams from Twitch!');
        console.log(twitchFollowedRes);
        for (let i = 0; i < len; i++) {
            var date = getTime(twitchFollowedRes.data.data[i].started_at);
            twitchFollowedRes.data.data[i].started_at = date;
          }
        setUrls(twitchFollowedRes.data.data);
      } else {
        setFollowedStreams([{ 
          user_name: 'Jackson',
          game_name: 'Pokemon',
          title: 'Watch me play pokemon',
          viewer_count: 1000,
          started_at: "2021-03-31T20:57:26Z",
          thumbnail_url: "https://seeklogo.com/images/T/twitch-tv-logo-51C922E0F0-seeklogo.com.png"
        }])
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
            <h3>Current Subscriptions:</h3> <br/>
            {Object.keys(subStreams).map((key, index) => (
                <div key={index}>
                  Name: <a href={"https://twitch.tv/" + subStreams[key].broadcaster} target="_blank" rel="noreferrer" style={{color: 'purple'}}>{subStreams[key].broadcaster}</a>, Tier: {subStreams[key].tier / 1000}
                </div>
            ))}
            <br/>
            <h3>Who's Streaming Now?</h3>
            {Object.keys(followedStreams).map((key, index) => (
                <div key={index}>
                  <br/>
                  <h4><u>{followedStreams[key].user_name}</u></h4>
                  <a href={"https://twitch.tv/" + followedStreams[key].user_name} target="_blank" rel="noreferrer" style={{color: 'purple'}}>{followedStreams[key].title}</a><br/>
                  Viewers: {followedStreams[key].viewer_count}, Category: {followedStreams[key].game_name}, Started At: {followedStreams[key].started_at} <br/>
                  <a href={"https://twitch.tv/" + followedStreams[key].user_name} target="_blank" rel="noreferrer">
                      <img src={followedStreams[key].thumbnail_url} alt="" width="400" height="300"></img>
                  </a>
                  <br/>
                </div>
            ))}
    </Card>
  );
};

export default TwitchCurrentlyStreaming;
