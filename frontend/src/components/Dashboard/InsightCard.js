// import React, { useState } from 'react';
import React, { useState } from "react";
// import { Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Card, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Dashboard.module.css";

const InsightCard = (props) => {
  // const [redditStatus, setRedditStatus] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(true);

  const title = props.title || "Default Title";
  const text = props.text || "Default Text";
  const isLoggedIn = props.isLoggedIn || false;
  const userEmail = props.email || "Invalid user loggedin";

  console.log(text)
  console.log(isLoggedIn)

  const handleSubmit = (e) => {
    e.preventDefault();

    //axios stuff
    const body = {
      email: userEmail,
      socEmail: email,
      socPassword: password,
    };

    axios
      .post("http://localhost:5000/" + text.toLowerCase() + "Login/", body)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          console.log(text + " user logged in");
        } else {
          console.log("there was an error in " + text + " user signup");
        }
      });
  };

  let display;
  if (isLoggedIn) {
    display = "chart should be displaying";
  } else {
    display = (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email: </label>
          <input
            type="text"
            className="form-control"
            placeholder="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <label>Password: </label>
          <input
            type="text"
            className="form-control"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <br></br>
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
          <Card.Title>{title}</Card.Title>
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
