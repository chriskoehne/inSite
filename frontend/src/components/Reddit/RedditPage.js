import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Navbar, Row, Card, Col, Carousel } from 'react-bootstrap';
import {useLocation} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LineChart from "../Charts/LineChart";
import BarChart from "../Charts/BarChart";
import styles from './Reddit.module.css';
import { TagCloud } from 'react-tagcloud';
const c = require('./constants/constants');

// Used to create the word clouds
const stopWords = ["a","able","about","across","after","all","almost","also","am","among","an","and","any","are","as","at","be","because","been","but","by","can","cannot","could","dear","did","do","does","either","else","ever","every","for","from","get","got","had","has","have","he","her","hers","him","his","how","however","i","if","in","into","is","it","its","just","least","let","like","likely","may","me","might","most","must","my","neither","no","nor","not","of","off","often","on","only","or","other","our","own","rather","said","say","says","she","should","since","so","some","than","that","the","their","them","then","there","these","they","this","tis","to","too","twas","us","wants","was","we","were","what","when","where","which","while","who","whom","why","will","with","would","yet","you","your","ain't","aren't","can't","could've","couldn't","didn't","doesn't","don't","hasn't","he'd","he'll","he's","how'd","how'll","how's","i'd","i'll","i'm","i've","isn't","it's","might've","mightn't","must've","mustn't","shan't","she'd","she'll","she's","should've","shouldn't","that'll","that's","there's","they'd","they'll","they're","they've","wasn't","we'd","we'll","we're","weren't","what'd","what's","when'd","when'll","when's","where'd","where'll","where's","who'd","who'll","who's","why'd","why'll","why's","won't","would've","wouldn't","you'd","you'll","you're","you've"]

function getUncommon(sentence) {
  var wordArr = sentence.match(/\w+/g),
      commonObj = {},
      uncommonArr = [],
      word, i;

  let common = stopWords
  for ( i = 0; i < common.length; i++ ) {
      commonObj[ common[i].trim() ] = true;
  }

  for ( i = 0; i < wordArr.length; i++ ) {
      word = wordArr[i].trim().toLowerCase();
      if ( !commonObj[word] ) {
          uncommonArr.push(word);
      }
  }

  return uncommonArr;
}

function getWordList(str) {
  let arr = []
  let array = str.split(" ")
  let map = {};
  for (let i = 0; i < array.length; i++) {
      let item = array[i];
      map[item] = (map[item] + 1) || 1;
  }
  for (const property in map) {
  	let obj = {}
    obj.value = property
    obj.count = map[property]
    arr.push(obj)
  }
  arr.sort((a, b) => b.count - a.count)
  return arr.slice(0, 30);
}


const RedditPage = (props) => {
  const { state } = useLocation();
  const [me, setMe] = useState({});
  const [links, setLinks] = useState(0);
  const [awards, setAwards] = useState(0);
  const [tagCloud, setTagCloud] = useState([])
  const [comments, setComments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [posts, setPosts] = useState([]);
  // use state.email and state.accessToken

  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Update the document title using the browser API
    console.log("going to attempt to use access token now");
    console.log(state);
    const redditMeQuery = {
      accessToken: state.accessToken,
    };
    if (me && !me.name) {
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
            username: ans.data.name
          };
          axios
          .get("http://localhost:5000/redditUserOverview", { params: redditUserQuery })
          .then((ans) => {
            if (ans) {
              console.log("overview request ans - see data");
              console.log(ans);
              //ans.data.overview.data.children <- a list of objects. Look at 'kind' field
              let array = ans.data.overview.data.children
              console.log(array)
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
          console.log("sad")
          axios.get("http://localhost:5000/redditUserComments", { params: redditUserQuery })
          .then((ans) => {
            console.log("comments request data")
            console.log(ans)
            let array = ans.data.overview.data.children
            console.log(array)
            let comm_str = ""
            array.forEach((comm) => {
              comm_str += comm.data.body
            })
            getUncommon(comm_str)
            console.log(getWordList(comm_str))
            setTagCloud(getWordList(getUncommon(comm_str).join(" ")))
            });
        }
      });
    }
    
  }, []);
  const getMaxScore = (list) => {
    var maxScore = 0;
    list.forEach(function (item, index) {
      if (item.score > maxScore) {
        maxScore = item.score;
      }
    });
    return maxScore;
  };

  const getMaxItem = (list, maxScore) => {
    var maxItem = {};
    list.forEach(function (item, index) {
      if (item.score === maxScore) {
        maxItem = item;
      }
    });
    return maxItem;
  };

  const getScores = (list) => {
    let scores = [];
    list.forEach(function (item, index) {
      scores.push(item.score);
    });
    return scores;
  };


  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  //clunky, but follow the above and add to the following if statements for the other social medias

  return !me || !me.name ? (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#3d3d3d" }}>Loading...</h1>
    </div>
  ) : (
    <div className={styles.box}>
      <Carousel
        variant="dark"
        className={styles.slideshow}
        activeIndex={index}
        onSelect={handleSelect}
      >
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
            <Row>
              <Col>
                <Row className={styles.chartContainer}>
                  <BarChart
                    data={getScores(posts)}
                    maxVal={getMaxScore(posts)}
                    label="Post Scores"
                    xaxis="post score"
                  />
                </Row>
              </Col>
              <Col>
                Here we see a graphical representation of a user's post scores.
                Each bucket represents the number of posts that fall within the
                range for the score.
              </Col>
            </Row>
          </Card>
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
            <Row>
              <Col>
                <Row className={styles.chartContainer}>
                  <BarChart
                    data={getScores(comments)}
                    maxVal={getMaxScore(comments)}
                    label="Comment Scores"
                    xaxis="Comment score"
                  />
                </Row>
              </Col>
              <Col>
                Here we see a graphical representation of a user's comment
                scores. Each bucket represents the number of comments that fall
                within the range for the score.
              </Col>
            </Row>
          </Card>
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
            <Row>
              Most Upvoted Post
              <Card
                style={{ borderColor: "#3d3d3d" }}
                // className={styles.socialsCard}
              >
                <Card.Body>
                  <Card.Title>
                    {getMaxItem(posts, getMaxScore(posts)).title}
                  </Card.Title>
                  <Card.Text>
                    {getMaxItem(posts, getMaxScore(posts)).selftext}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Row>
            <Row>
              Most Upvoted Comment
              <Card
                style={{ borderColor: "#3d3d3d" }}
                // className={styles.socialsCard}
              >
                <Card.Body>
                <Card.Title>
                    {getMaxItem(comments, getMaxScore(comments)).link_title}
                  </Card.Title>
                  <Card.Text>
                    {getMaxItem(comments, getMaxScore(comments)).body}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Row>
            <Row>
              Most Upvoted Message
              <Card
                style={{ borderColor: "#3d3d3d" }}
                // className={styles.socialsCard}
              >
                <Card.Body>
                <Card.Title>
                    {getMaxItem(messages, getMaxScore(messages)).link_title}
                  </Card.Title>
                  <Card.Text>
                    {getMaxItem(messages, getMaxScore(messages)).body}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Row>
          </Carousel.Item>
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
                    <TagCloud tags={tagCloud} minSize={32} maxSize={60} />
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
