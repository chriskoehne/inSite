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
  const [redditAccessToken, setAccessToken] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(true);

  const title = props.title || "Default Title";
  const text = props.text || "Default Text";
  const isLoggedIn = props.isLoggedIn || false;
  const userEmail = props.email || "Invalid user loggedin";
  const code = props.code;

  console.log(text);
  console.log(isLoggedIn);

  const handleSubmit = (e) => {
    e.preventDefault();

    //axios stuff
    const body = {
      email: userEmail,
    };

    axios
      .post("http://localhost:5000/" + text.toLowerCase() + "Login/", body)
      .then((res) => {
        console.log(res);
        // res.link
        if (res.data.success) {
          console.log("got the link!");
          window.location.href = res.data.link;
        } else {
          console.log("there was an error in " + text + " user signup");
        }
      });
  };

  let display;
  if (isLoggedIn) {
    display = "chart should be displaying";
    // convert code to token
    const body = {
      code: code,
    };
    axios
      .post(
        "http://localhost:5000/" + text.toLowerCase() + "CodeToToken/",
        body
      )
      .then((res) => {
        console.log("res is");
        console.log(res);
        if (res.data.accessToken) {
          console.log("should see token as:");
          console.log(res);
          setAccessToken(res.data.accessToken);
          console.log("going to attempt to use access token now");
          const redditQuery = {
            accessToken: res.data.accessToken,
          };
          axios
            .get("http://localhost:5000/redditMe", redditQuery)
            .then((ans) => {
              console.log("subreddit request ans");
              console.log(ans);
            });
        }
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
          <Card.Title>{title}</Card.Title>
          <Card.Text>{text}</Card.Text>
          {display}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default InsightCard;
