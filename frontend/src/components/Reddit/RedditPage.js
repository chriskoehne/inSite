import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Navbar, Row, Card, Col, Carousel } from 'react-bootstrap';
import {useLocation} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LineChart from "../charts/lineChart";
import styles from './Reddit.module.css';
const c = require('./constants/constants');


const RedditPage = (props) => {
  const { state } = useLocation();
  const [me, setMe] = useState({});
  const [comments, setComments] = useState(0);
  const [messages, setMessages] = useState(0);
  const [links, setLinks] = useState(0);
  const [awards, setAwards] = useState(0);
  // use state.email and state.accessToken

  const [index, setIndex] = useState(0);
  
  
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
                    setComments(comments+1)
                  case c.MESSAGE:
                    setMessages(messages+1)
                  case c.LINK:
                    setLinks(links+1)
                  case c.AWARD:
                    setAwards(awards+1)
                }
              });
            }
          });
        }
      });
    }
    
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
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text style={{ color: "white" }}>settings</Navbar.Text>
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
                    <br/>
                    Num comments: {comments}
                    <br/>
                    Num messages: {messages}
                    <br/>
                    Num links: {links}
                    <br/>
                    Num awards: {awards}
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
