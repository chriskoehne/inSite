import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Navbar, Row, Card, Col, Carousel } from 'react-bootstrap';
import {useLocation} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LineChart from "../charts/lineChart";
import styles from './Reddit.module.css';
import RedditComments from './RedditComments.js';
import { TagCloud } from 'react-tagcloud'

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
  return arr.slice(0, 20);
}


const RedditPage = (props) => {
  const { state } = useLocation();
  const [me, setMe] = useState({});
  const [comments, setComments] = useState(0);
  const [messages, setMessages] = useState(0);
  const [links, setLinks] = useState(0);
  const [awards, setAwards] = useState(0);
  const [wordCloud, setWordCloud] = useState([])
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
      .then(async (ans) => {
        if (ans) {
          console.log("me request ans - see data name");
          console.log(ans);
          setMe(ans); // This does not work because of the way useState works, just gonna do ans.data.name instead rn
          //console.log(me)
          //because me contains vital information, such as a username, maybe we should nest all of the calls? or perhaps get one big blob of data from one backend call?
          const redditUserQuery = {
            accessToken: state.accessToken,
            username: ans.data.name
          };
          console.log("yo s " + ans.data.name)
          axios
          .get("http://localhost:5000/redditUserOverview", { params: redditUserQuery })
          .then((ans) => {
            if (ans) {
              console.log("overview request ans - see data");
              console.log(ans);
              //ans.data.overview.data.children <- a list of objects. Look at 'kind' field
              let array = ans.data.overview.data.children
              console.log(array)
              let comm_str = ""
              array.forEach((comm) => {
                comm_str += comm.data.body
              })
              getUncommon(comm_str)
              console.log(getWordList(comm_str))
              setWordCloud(getWordList(getUncommon(comm_str).join(" ")))
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
    
  }, []);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  
//clunky, but follow the above and add to the following if statements for the other social medias

  return (
    <div className={styles.box}>
      <Navbar className={styles.dashboardNav}>
        <Container>
          <Navbar.Brand href='/dashboard'>
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
                    <h3>Hey let's look through your comments history</h3>
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
              <TagCloud tags={wordCloud} minSize={50}
    maxSize={80} />
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
