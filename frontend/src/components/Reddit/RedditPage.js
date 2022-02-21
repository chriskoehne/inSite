import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Navbar, Row, Card, Col, Carousel } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LineChart from '../charts/lineChart';
import styles from './Reddit.module.css';

const RedditPage = (props) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Update the document title using the browser API
  });

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  //clunky, but follow the above and add to the following if statements for the other social medias

  return (
    <div className={styles.box}>
      <Carousel
        variant='dark'
        className={styles.slideshow}
        activeIndex={index}
        onSelect={handleSelect}
      >
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
            <Row>
              <Col>
                <Row className={styles.chartContainer}>
                  <LineChart />
                </Row>
                <Row className={styles.chartContainer}>
                  <LineChart />
                </Row>
              </Col>
              <Col>free karma woop</Col>
            </Row>
          </Card>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default RedditPage;
