import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Twitter.module.css';
import LineChart from '../Charts/LineChart';
// import LineChart from '../Charts/LineChart';

const TwitterFollowersHistory = (props) => {
  const [followersHistory, setFollowersHistory] = useState({
    datasets: [],
  });

  const options = {    
    scales: {
      yAxes: [{
      ticks: { min: 0 },
      }], 
    },
  }
  

  useEffect(() => {
    const getFolllowersHistory = async () => {
      console.log('yea');
      // console.log('Calling Twitter API. Here is localStorage:');
      // console.log(localStorage);
      const twitterRes = await axios.get('user/twitter/', {
        params: { email: localStorage.getItem('email') },
      });

      console.log(twitterRes.data.message);
      if (twitterRes.status === 200) {
        console.log('ih here');
        const history = twitterRes.data.message.followerHistory;
        let labels = [];
        let followers = [];
        history.forEach((obj) => {
          let date = new Date(obj.time);
          labels.push(date.toLocaleString());
          followers.push(obj.numFollowers);
        });
        const historyDataset = {
          labels: labels,
          datasets: [
            {
              label: 'Total Karma',
              data: followers,
              borderColor: '#05aced',
              backgroundColor: '#05aced',
              options: {
                scale: {
                  ticks: {
                    precision: 0
                  }
                }
              }
            },
          ],
        };
        console.log('uhh');
        console.log(history);
        setFollowersHistory(historyDataset);
      }
    };

    getFolllowersHistory();
    console.log('uasdfasdf');
  }, []);

  const display = () => {
    if (!followersHistory) {
      return (
        <div>
          <h1>It looks like you don't have any followers history</h1>
          <h1>Enable storage of data for Twitter data to allow for followers</h1>
        </div>
      );
    }
  };

  return (
    <Card
      style={{ borderColor: 'var(--twitter)' }}
      className={styles.socialsCard}
    >
      <h1>Trends of the number of followers</h1>
      <LineChart
        height={'50vh'}
        width={'75vw'}
        color={'#ff4500'}
        data={followersHistory}
        options={options}
      />
    </Card>
  );
};

export default TwitterFollowersHistory;
