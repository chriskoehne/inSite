import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Row, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Twitch.module.css';

const TwitchCreatorSettings = (props) => {
  const [twitchToken, setTwitchToken] = useState('');
  const [automodSettings, setAutomodSettings] = useState({})
  const [streamTags, setStreamTags] = useState([])
  const [creatorGoals, setCreatorGoals] = useState({})
  const [bannedUsers, setBannedUsers] = useState([])

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
    // console.log('In Twitch Page 3 useEffect')
    if (!hasToken() && twitchToken) {
      localStorage.setItem(
        'twitchToken',
        JSON.stringify({ token: twitchToken, date: Date.now() })
      );
    }

    const callTwitch = async () => {
      // console.log('Calling Twitch in Page 3');
      const twitchQuery = {
        accessToken: twitchToken,
        id: localStorage.getItem('twitch-user-id'),
      };

      const twitchCreatorRes = await axios.get('/twitch/getCreatorGoals', {
        params: twitchQuery,
      });

      if (twitchCreatorRes) {
        // console.log('Received Creator Goals from Twitch!');
        // console.log(twitchCreatorRes.data);
        twitchCreatorRes.data.data[0].created_at = getDate(twitchCreatorRes.data.data[0].created_at);
        setCreatorGoals(twitchCreatorRes.data.data[0]);
      }

      const twitchTagsRes = await axios.get('/twitch/getStreamTags', {
        params: twitchQuery,
      });

      if (twitchTagsRes) {
        // console.log('Received Stream Tags from Twitch!');
        // console.log(twitchTagsRes.data);
        setStreamTags(twitchTagsRes.data.data);
      }

      const twitchAutomodRes = await axios.get('/twitch/getAutomodSettings', {
        params: twitchQuery,
      });

      if (twitchAutomodRes) {
        // console.log('Received Automod Settings from Twitch!');
        // console.log(twitchAutomodRes.data);
        setAutomodSettings(twitchAutomodRes.data.data[0]);
      } 

      const twitchBannedRes = await axios.get('/twitch/getBannedUsers', {
        params: twitchQuery,
      });

      if (twitchBannedRes) {
        // console.log('Received Banned Users from Twitch!');
        // console.log(twitchBannedRes.data);
        setBannedUsers(twitchBannedRes.data.data);
      } 
    };

    if (twitchToken) {
      // console.log('Calling Twitch User Follows');
      callTwitch();
    }
  }, [twitchToken]);
  
  return (
    <Card className={styles.socialsCard}>
      <Row>
          <Row>
              <Col>
              <h3>Creator Goals</h3>
              You created a {creatorGoals.type} Goal on {creatorGoals.created_at} with the description "{creatorGoals.description}"<br/>
              The goal is to reach {creatorGoals.target_amount} and you are currently at {creatorGoals.current_amount}. Only {creatorGoals.target_amount - creatorGoals.current_amount} more to go!
              </Col><Col>
              <h3>AutoMod Hostility Levels (0-4)</h3>
                {/* <div style={{width: 300}}> */}
                <Row className={styles.centered}>
                  <Col>
                  Disability: {automodSettings.disability} <br/>
                  Aggression: {automodSettings.aggression} <br/>
                  Sexuality or Gender: {automodSettings.sexuality_sex_or_gender} <br/>
                  Misogyny: {automodSettings.misogyny} <br/>
                  </Col>
                  
                  <Col>
                  Bullying: {automodSettings.bullying} <br/>
                  Swearing: {automodSettings.swearing} <br/>
                  Race or Religion: {automodSettings.race_ethnicity_or_religion} <br/>
                  Sex Based Terms: {automodSettings.sex_based_terms} <br/>
                  </Col>
                </Row>
                {/* </div> */}
              
              </Col>
          </Row>
          <Row>
              <Col>
                <h3>Stream Tags</h3>
              {Object.keys(streamTags).map((key, index) => (
                <div key={index}>
                  Name: {streamTags[key].localization_names['en-us']}<br/>
                  Description: {streamTags[key].localization_descriptions['en-us']}<br/>
                  <br/>
                </div>
              ))}
              </Col>
              <Col>
              <h3>Banned Users</h3>
              {Object.keys(bannedUsers).map((key, index) => (
                <div key={index}>
                  Name: <a href={"https://twitch.tv/" + bannedUsers[key].user_name} style={{color: 'var(--twitch)'}} target="_blank" rel="noreferrer" >{bannedUsers[key].user_name}</a><br/>
                  Reason: {bannedUsers[key].reason}<br/>
                  Banned By: <a href={"https://twitch.tv/" + bannedUsers[key].moderator_name} style={{color: 'var(--twitch)'}} target="_blank" rel="noreferrer" >{bannedUsers[key].moderator_name}</a><br/>
                  <br/>
                </div>
              ))}
              </Col>
          </Row>
        </Row>
      </Card>
  );
};

export default TwitchCreatorSettings;
