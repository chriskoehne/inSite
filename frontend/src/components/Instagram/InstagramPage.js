import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Card, Col } from 'react-bootstrap';
import {useLocation} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Instagram.module.css';

const InstagramPage = (props) => {

  
  useEffect(() => {
    // Update the document title using the browser API
  });

  
//clunky, but follow the above and add to the following if statements for the other social medias

  return (
    <div className={styles.box}>
      <h1>Instagram Page</h1>
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

export default InstagramPage;
