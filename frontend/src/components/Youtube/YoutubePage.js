import React, { useEffect, useState } from 'react';
import { Row, Card, Col, Carousel, Button, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Youtube.module.css';

const YoutubePage = (props) => {
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);


  const isDarkMode = () => {
    return document.body.classList.contains('dark') ? 'light' : 'dark';
  };

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return loading ? (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <h1 style={{ color: 'var(--primary)' }}>Loading...</h1>
    </div>
  ) : (
    <div className={styles.box}>
      <Carousel
        variant={isDarkMode()}
        className={styles.slideshow}
        activeIndex={index}
        onSelect={handleSelect}
      >
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
            <Row>
              <Col>
                <Row>Smthg youtube related</Row>
              </Col>
            </Row>
          </Card>
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
            <h3>your mom</h3>
          </Card>
        </Carousel.Item>
      </Carousel>
    </div>
  );

};

export default YoutubePage;
