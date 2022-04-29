import React from 'react';
import { Card, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';
import LineChartDemo from '../Charts/LineChartDemo';
import { SocialIcon } from 'react-social-icons';

const InsightCard = (props) => {
  const title = props.title || 'Default Title';

  let display;
  let icon;
  switch (title) {
    case 'Twitch':
      display = <LineChartDemo color={'#6442a5'} />;
      icon = <SocialIcon fgColor='white' url='https://www.twitch.tv/' target='blank' rel='noreferrer'/>;
      break;
    case 'YouTube':
      display = <LineChartDemo color={'#ff3333'} />;
      icon = <SocialIcon fgColor='white' url='https://www.youtube.com/' target='blank' rel='noreferrer'/>;
      break;
    default:
      console.log('default case');
      display = <LineChartDemo />;
  }

  return (
    <Col className={styles.cardCol}>
      <Card
        style={{ borderColor: props.borderColor }}
        className={styles.socialsCard}
      >
        <Card.Body>
          <Card.Title>
            {icon} {title}
          </Card.Title>
          <Card.Text></Card.Text>
          <div>{display}</div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default InsightCard;
