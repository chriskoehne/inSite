import React, { useState } from 'react';
import { Card, Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Twitter.module.css';
import TwitterWordGraph from './TwitterWordGraph';
import TwitterFollows from './TwitterFollows';
import TwitterLikes from './TwitterLikes';
import TwitterMost from './TwitterMost';

const TwitterPage = (props) => {
  const [index, setIndex] = useState(0);

  const isDarkMode = () => {
    return document.body.classList.contains('dark') ? 'light' : 'dark';
  };

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <div className={styles.box}>
      <Carousel
        variant={isDarkMode()}
        className={styles.slideshow}
        activeIndex={index}
        onSelect={handleSelect}
      >
        <Carousel.Item className={styles.slideshowCard}>
          <TwitterFollows />
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <TwitterLikes />
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <TwitterWordGraph />
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
        <TwitterMost />
        </Carousel.Item>
      </Carousel>
    </div>
  );

};

export default TwitterPage;
