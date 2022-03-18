import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';
// import LineChart from '../Charts/LineChart';
import { SocialIcon } from 'react-social-icons';
import BarChart from '../Charts/BarChart';

const TwitterCard = (props) => {
  const [user, setUser] = useState({ email: '', code: '' });
  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState({});

  const authenticateTwitter = async (e) => {
    e.preventDefault();
    const result = await axios.post('http://localhost:5000/twitter/login/', {
      email: user.email,
    });
    if (result.data.success) {
      console.log('got the link!');
      window.location.href = result.data.link;
    } else {
      console.log('there was an error in Twitter user signup');
    }
  };

  const display = () => {
    return (
      <div className={styles.centered}>
        <Button className={styles.buttons} onClick={authenticateTwitter}>
          Authorize Twitter
        </Button>
      </div>
    );
  };

  const icon = () => {
    return <SocialIcon fgColor='white' url='https://twitter.com/' />;
  };

  return (
    <Col className={styles.cardCol}>
      <Card style={{ borderColor: 'var(--reddit)' }} className={styles.socialsCard}>
        <Card.Body>
          <Card.Title>{icon()} Twitter</Card.Title>
          <Card.Text></Card.Text>
          <div>{display()}</div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default TwitterCard;
