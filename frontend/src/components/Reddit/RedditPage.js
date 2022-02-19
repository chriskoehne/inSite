import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Navbar, Row, Card, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Reddit.module.css";
const c = require('./constants/constants');

const RedditPage = (props) => {
  const { state } = useLocation();
  const [me, setMe] = useState({});
  const [kinds, setKinds] = useState({
    comments: 0,
    accounts: 0,
    links: 0,
    messages: 0,
    subreddits: 0,
    awards: 0,
    promocampaigns: 0
  });
  // use state.email and state.accessToken

  useEffect(() => {
    // Update the document title using the browser API
    console.log("going to attempt to use access token now");
    console.log(state);
    const redditMeQuery = {
      accessToken: state.accessToken,
    };
    if (!me.name){
      axios
      .get("http://localhost:5000/redditMe", { params: redditMeQuery })
      .then((ans) => {
        if (ans) {
          console.log("me request ans - see data name");
          console.log(ans);
          setMe(ans.data);
          //because me contains vital information, such as a username, maybe we should nest all of the calls? or perhaps get one big blob of data from one backend call?
          const redditUserQuery = {
            accessToken: state.accessToken,
            username: me.name
          };
          axios
          .get("http://localhost:5000/redditUserOverview", { params: redditUserQuery })
          .then((ans) => {
            if (ans) {
              console.log("overview request ans - see data");
              console.log(ans);
              //ans.data.overview.data.children <- a list of objects. Look at 'kind' field
              let array = ans.data.overview.data.children
              array.forEach(function (item, index) {
                switch(item.kind) {
                  case c.COMMENT:
                    setKinds(prevState => ({
                      ...prevState,
                      comments: prevState.comments + 1
                  }))
                  case c.ACCOUNT:
                    setKinds(prevState => ({
                      ...prevState,
                      accounts: prevState.accounts + 1
                  }))
                  case c.LINK:
                    setKinds(prevState => ({
                      ...prevState,
                      links: prevState.links + 1
                  }))
                  case c.MESSAGE:
                    setKinds(prevState => ({
                      ...prevState,
                      messages: prevState.messages + 1
                  }))
                  case c.SUBREDDIT:
                    setKinds(prevState => ({
                      ...prevState,
                      subreddits: prevState.subreddits + 1
                  }))
                  case c.AWARD:
                    setKinds(prevState => ({
                      ...prevState,
                      awards: prevState.awards + 1
                  }))
                  case c.PROMOCAMPAIGN:
                    setKinds(prevState => ({
                      ...prevState,
                      promocampaigns: prevState.promocampaigns + 1
                  }))
                }
              });
              console.log("kinds is")
              console.log(kinds)
            }
          });
        }
      });
    }
    
  });

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
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text style={{ color: "white" }}>settings</Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <h1>Reddit Page for {me.name}</h1>
      <Row xs={1} md={2} className={styles.cardRow}>
        <Card className={styles.socialsCard}>
          <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Card.Text>Card Text</Card.Text>
            Some info:
            Num comments: {kinds.comments}
            Num messages: {kinds.messages}
            Num awards: {kinds.awards}
          </Card.Body>
        </Card>
      </Row>
    </div>
  );
};

export default RedditPage;
