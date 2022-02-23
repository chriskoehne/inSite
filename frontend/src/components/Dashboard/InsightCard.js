import React from 'react';
import axios from "axios";
import { Card, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Dashboard.module.css";
import LineChart from "../Charts/LineChart";
import { SocialIcon } from 'react-social-icons';



const InsightCard = (props) => {


  const title = props.title || 'Default Title';
  const text = props.text || 'Default Text';
  const isLoggedIn = props.isLoggedIn || false;
  const userEmail = props.email || 'Invalid user loggedin';


  // deprecated
  const handleSubmit = (e) => {
    e.preventDefault();

    const body = {
      email: userEmail,
    };

    axios
      .post('http://localhost:5000/' + title.toLowerCase() + 'Login/', body)
      .then((res) => {
        console.log(res);
        // res.link
        if (res.data.success) {
          console.log('got the link!');
          window.location.href = res.data.link;
        } else {
          console.log('there was an error in ' + text + ' user signup');
        }
      });
  };

  let display;
  let icon;
  if (isLoggedIn) {
    switch (title) {
      case 'Twitter':
        display = <LineChart color={'#55ADEE'}/>;
        icon = <SocialIcon url="https://twitter.com/usernamehere" />;
        break;
      case 'Instagram':
        display = <LineChart color={'#E94475'}/>;
        icon = <SocialIcon url="https://instagram.com/kanyewest" />;
        break;
      case 'YouTube':
        display = <LineChart color={'#FF0000'}/>;
        icon = <SocialIcon url="https://youtube.com/kanyewest" />;
        break;
      default:
        console.log("default case");
        display = <LineChart />;
    }
  } else {
    display = (
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <input type='submit' value='Login' className='btn btn-primary' />
        </div>
      </form>
    );
  }

  return (
    <Col className={styles.cardCol}>
      <Card
        style={{ borderColor: props.borderColor }}
        className={styles.socialsCard}
      >
        <Card.Body>
          <Card.Title>{icon} {title}</Card.Title>
          <Card.Text>
          </Card.Text>
          <div>
          {display}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default InsightCard;
