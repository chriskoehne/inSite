import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Navbar, Row, Card, Col, Carousel } from 'react-bootstrap';
import {useLocation} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LineChart from "../charts/lineChart";
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

      <div className={styles.backgroundstyle}>
        <Carousel className={styles.slideshow} activeIndex={index} onSelect={handleSelect}>
          <Carousel.Item>
            <Row xs={1} md={2} className={styles.cardRow}>
              <Card className={styles.socialsCard}>
                <Row>
                  <Col>
                    <div className={styles.chartContainer}>
                      <LineChart className={styles.chart} />
                      <LineChart className={styles.chart} />
                    </div>
                  </Col>
                  <Col>
                    free karma woop
                  </Col>
                </Row>
              </Card>
            </Row>
          </Carousel.Item>
        </Carousel>
      </div>
    </div>
  );

};

export default RedditPage;
