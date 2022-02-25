import React from 'react';
import { Row } from 'react-bootstrap';
import InsightCard from './InsightCard';
import RedditCard from './RedditCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';

const Dashboard = (props) => {

  //clunky, but follow the above and add to the following if statements for the other social medias

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
          borderColor='#55ADEE'
          isLoggedIn={true}
          navigate={props.navigate}
        />
        <InsightCard
          title='Instagram'
          text='Instagram'
          borderColor='#E94475'
          isLoggedIn={true}
          navigate={props.navigate}
        />
        <InsightCard
          title='YouTube'
          text='YouTube'
          borderColor='#FF0000'
          isLoggedIn={true}
          navigate={props.navigate}
        />
      </Row>
    </div>
  );
};

export default Dashboard;