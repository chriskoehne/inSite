// import React, { useState } from 'react';
import { Card, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';

const InsightCard = (props) => {

  const title = props.title || 'Default Title';
  const text = props.text || 'Default Text';

  return (
    <Col className={styles.cardCol}>
      <Card className={styles.socialsCard}>
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>
            {text}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default InsightCard;
