import React from 'react';
import { Row, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Youtube.module.css';

const YoutubePage = (props) => {

  return (
    <div className={styles.box}>

      <h1>Youtube Page</h1>
      <Row xs={1} md={2} className={styles.cardRow}>
      <Card className={styles.socialsCard}>
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Text>Card Text</Card.Text>
          Display a chart
        </Card.Body>
      </Card>
      </Row>
    </div>
  );

};

export default YoutubePage;
