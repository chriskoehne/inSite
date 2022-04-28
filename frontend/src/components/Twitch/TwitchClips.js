import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Twitch.module.css';

const TwitchClips = (props) => {
  const [twitchToken, setTwitchToken] = useState('');
  const [clips, setClips] = useState([]);

  const getDate = (twitchDate) => {
    var original = twitchDate.toString();
    // console.log('original' + original);
    var newDate = new Date(original);
    // console.log('newDate ' + newDate);
    return((newDate.getMonth() + 1) + '/' + newDate.getDate() + '/' + newDate.getFullYear())
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

      const twitchRes = await axios.get('/twitch/getClips', {
        params: twitchQuery,
      });

      if (twitchRes) {
        // console.log('Received Clips from Twitch!');
        // console.log(twitchRes.data);
        for (let i = 0; i < 5; i++) {
          var date = getDate(twitchRes.data.data[i].created_at);
          twitchRes.data.data[i].created_at = date;
        }
        setClips(twitchRes.data.data);
      }
    };

    if (twitchToken) {
    //   console.log('Calling Twitch Clips');
      callTwitch();
    }
  }, [twitchToken]);
  
  return (
    <Card className={styles.socialsCard}>
        <h1>Top 5 Clips</h1>
        {Object.keys(clips).map((key, index) => (
            
            <div key={index}>
            <br/>
            Title:<a href={clips[key].url} style={{color: 'var(--twitch)', marginLeft: 3.2}} target="_blank" rel="noreferrer">{clips[key].title}</a>, Views: {clips[key].view_count}, Created By: <a href={"https://twitch.tv/" + clips[key].creator_name} style={{color: 'var(--twitch)', marginLeft: 3.2}} target="_blank" rel="noreferrer" >{clips[key].creator_name}</a>, Created On: {clips[key].created_at}<br/>
            <iframe title={clips[key].title} width="500" height="400" src={clips[key].embed_url + '&parent=127.0.0.1'} allowFullScreen></iframe>
            </div>
        ))}
    </Card>
  );
};

export default TwitchClips;
