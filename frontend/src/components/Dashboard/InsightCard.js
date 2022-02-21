// import React, { useState } from 'react';
import React, { useState } from "react";
// import { Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Card, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Dashboard.module.css";
import { barChart } from "../charts/barChart";
import { pieChart } from "../charts/pieChart";
import LineChart from "../charts/lineChart";
import { SocialIcon } from 'react-social-icons';



const InsightCard = (props) => {
  // const [redditStatus, setRedditStatus] = useState('');
  const [email, setEmail] = useState("");
  const [redditAccessToken, setAccessToken] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(true);

  const title = props.title || "Default Title";
  const text = props.text || "Default Text";
  const isLoggedIn = props.isLoggedIn || false;
  const userEmail = props.email || "Invalid user loggedin";
  const code = props.code;

  console.log(text)
  console.log(isLoggedIn)

  console.log("props in insite card");
  console.log(props);

  const handleSubmit = (e) => {
    e.preventDefault();

    //axios stuff
    const body = {
      email: userEmail,
    }

    

    axios
      .post("http://localhost:5000/" + text.toLowerCase() + "Login/", body)
      .then((res) => {
        console.log(res);
        // res.link
        if (res.data.success) {
          console.log("got the link!")
          window.location.href = res.data.link
        } else {
          console.log("there was an error in " + text + " user signup");
        }
      });
  };

  let display;
  let icon;
  if (isLoggedIn) {
    switch (title) {
      case 'Reddit':
        display = <LineChart color={'#FF4500'}/>;
        icon = <SocialIcon url="https://reddit.com/user/usernamehere" />; //can pass in username to the url, so if they click the icon they go their profile page
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
      code: code
    }
    axios.post("http://localhost:5000/" + text.toLowerCase() + "CodeToToken/", body).then((res) => {
    console.log("back in frontend")  
    console.log(res)
    setAccessToken(res.accessToken)
      //get token

    });
  } else {
    display = (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="submit" value="Login" className="btn btn-primary" />
        </div>
      </form>
    );
  }

  return (
    <Col className={styles.cardCol}>
      <Card className={styles.socialsCard}>
        <Card.Body>
          <Card.Title>{title} {icon}</Card.Title>
          <Card.Text>
            {text}
          </Card.Text>
          {display}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default InsightCard;
