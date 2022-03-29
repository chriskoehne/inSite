import React from 'react';
import { Row } from 'react-bootstrap';
import InsightCard from './InsightCard';
import RedditCard from './RedditCard';
import TwitterCard from './TwitterCard';
import YoutubeCard from './YoutubeCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';

const Dashboard = (props) => {
  let cards = [
    <RedditCard
      id='reddit'
      key='reddit'
      navigate={props.navigate}
      setExternalUrl={props.setExternalUrl}
    />,
    <TwitterCard
      id='twitter'
      key='twitter'
      navigate={props.navigate}
      setExternalUrl={props.setExternalUrl}
    />,
    <InsightCard
      id='instagram'
      key='instagram'
      title='Instagram'
      text='Instagram'
      borderColor='var(--instagram)'
      isLoggedIn={true}
      navigate={props.navigate}
    />,
    <YoutubeCard
      id='youtube'
      key='youtube'
      navigate={props.navigate}
      setExternalUrl={props.setExternalUrl}
    />,
  ];

  const orderCards = () => {
    let positions = {};
    for (let [index, val] of JSON.parse(
      localStorage.getItem('settings')
    ).cardOrder.entries()) {
      positions[val] = index;
    }
    let order = Array(4);
    for (const card of cards) {
      order[positions[card.props.id]] = card;
    }
    return order;
  };

  return (
    <div className={styles.box}>
      <Row xs={1} md={2} className={styles.cardRow}>
        {orderCards()}
      </Row>
    </div>
  );
};

export default Dashboard;
