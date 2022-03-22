import React from 'react';
import { Row } from 'react-bootstrap';
import InsightCard from './InsightCard';
import RedditCard from './RedditCard';
import YoutubeCard from './YoutubeCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';

const Dashboard = (props) => {


  return (
    <div className={styles.box}>
      <Row xs={1} md={2} className={styles.cardRow}>
        <RedditCard
        navigate={props.navigate}
        setExternalUrl={props.setExternalUrl}
        />
        <InsightCard
          title='Twitter'
          text='Twitter'
          borderColor='var(--twitter)'
          isLoggedIn={true}
          navigate={props.navigate}
        />
        <InsightCard
          title='Instagram'
          text='Instagram'
          borderColor='var(--instagram)'
          isLoggedIn={true}
          navigate={props.navigate}
        />
        <YoutubeCard
        navigate={props.navigate}
        setExternalUrl={props.setExternalUrl}
        />
        {/* <InsightCard
          title='YouTube'
          text='YouTube'
          borderColor='var(--youtube)'
          isLoggedIn={true}
          navigate={props.navigate}
        /> */}
      </Row>
    </div>
  );
};

export default Dashboard;