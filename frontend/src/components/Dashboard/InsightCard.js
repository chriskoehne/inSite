import React, { useState } from 'react';
import axios from "axios";
import { Card, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Dashboard.module.css";
import { BarChart } from "../Charts/BarChart";
import { PieChart } from "../Charts/PieChart";
import LineChart from "../Charts/LineChart";
import { SocialIcon } from 'react-social-icons';



const InsightCard = (props) => {
  // const [redditStatus, setRedditStatus] = useState('');
  const [email, setEmail] = useState('');
  const [redditAccessToken, setAccessToken] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(true);

  const title = props.title || 'Default Title';
  const text = props.text || 'Default Text';
  const isLoggedIn = props.isLoggedIn || false;
  const userEmail = props.email || 'Invalid user loggedin';
  const code = props.code;

  console.log(text);
  console.log(isLoggedIn);
  console.log(props);

  const handleSubmit = (e) => {
    e.preventDefault();

    //axios stuff
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
      case 'Reddit':
        display = <LineChart color={'#FF4500'} onClick={function(){props.navigate(title.toLowerCase(), {state:{email: userEmail, accessToken: redditAccessToken}})}}/>;
        icon = <SocialIcon url="https://reddit.com/user/me" />; //can pass in username to the url, so if they click the icon they go their profile page
        break;
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
    
    // convert code to token
    const body = {
      code: code,
    };
    axios
      .post(
        'http://localhost:5000/' + title.toLowerCase() + 'CodeToToken/',
        body
      )
      .then((res) => {
        if (res.data.accessToken) {
          console.log('should see token as:');
          console.log(res);
          setAccessToken(res.data.accessToken);
        }
      });
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
