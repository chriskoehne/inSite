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
    case 'Twitter':
      display = <LineChartDemo color={'#55ADEE'} />;
      icon = <SocialIcon fgColor='white' url='https://twitter.com/usernamehere' />;
      break;
    case 'Instagram':
      display = <LineChartDemo color={'#E94475'} />;
      icon = <SocialIcon fgColor='white' url='https://instagram.com/kanyewest' />;
      break;
    case 'YouTube':
      display = <LineChartDemo color={'#FF0000'} />;
      icon = <SocialIcon fgColor='white' url='https://youtube.com/kanyewest' />;
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
