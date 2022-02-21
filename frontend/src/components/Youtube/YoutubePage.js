import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Navbar, Row, Card, Col } from 'react-bootstrap';
import {useLocation} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Youtube.module.css';

const YoutubePage = (props) => {

  
  useEffect(() => {
    // Update the document title using the browser API
  });

  
//clunky, but follow the above and add to the following if statements for the other social medias

  return (
    <div className={styles.box}>
      <Navbar className={styles.dashboardNav}>
        <Container>
          <Navbar.Brand>
            <div className={styles.inlineDiv}>
              <h2 className={styles.in}>in</h2>
              <h2 className={styles.site}>Site</h2>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className='justify-content-end'>
            <Navbar.Text style={{ color: 'white' }}>settings</Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
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
