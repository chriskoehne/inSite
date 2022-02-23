import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Card, Col, Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import BarChart from '../Charts/BarChart';
import styles from './Reddit.module.css';
import { TagCloud } from 'react-tagcloud';
const c = require('./constants/constants');

// Used to create the word clouds
function getUncommon(sentence) {
  var wordArr = sentence.match(/\w+/g),
    commonObj = {},
    uncommonArr = [],
    word,
    i;

  let common = c.WORDLIST;
  for (i = 0; i < common.length; i++) {
    commonObj[common[i].trim()] = true;
  }

  for (i = 0; i < wordArr.length; i++) {
    word = wordArr[i].trim().toLowerCase();
    if (!commonObj[word]) {
      uncommonArr.push(word);
    }
  }

  return uncommonArr;
}

function getWordList(str) {
  let arr = [];
  let array = str.split(' ');
  let map = {};
  for (let i = 0; i < array.length; i++) {
    let item = array[i];
    map[item] = map[item] + 1 || 1;
  }
  for (const property in map) {
    let obj = {};
    obj.value = property;
    obj.count = map[property];
    arr.push(obj);
  }
  arr.sort((a, b) => b.count - a.count);
  return arr.slice(0, 30);
}

const RedditPage = (props) => {
  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState({});
  const [links, setLinks] = useState(0);
  const [awards, setAwards] = useState(0);
  const [tagCloud, setTagCloud] = useState([]);
  // const [email, setEmail] = useState(localStorage.getItem('email'));
  const [redditToken, setRedditToken] = useState('');
  const [comments, setComments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [index, setIndex] = useState(0);
  const [commentKarma, setCommentKarma] = useState(0);
  const [linkKarma, setLinkKarma] = useState(0);
  const [awardKarma, setAwardKarma] = useState(0);
  const [totalKarma, setTotalKarma] = useState(0);
  const [subKarmaList, setSubKarmaList] = useState([]);

  const hasToken = () => {
    if (!localStorage.hasOwnProperty('redditToken')) {
      return false;
    }
    const token = JSON.parse(localStorage.getItem('redditToken'));
    if ((Date.now() - token.date) / 36e5 >= 1) {
      localStorage.removeItem('redditToken');
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!hasToken()) {
      props.navigate('/dashboard');
    } else {
      setRedditToken(JSON.parse(localStorage.getItem('redditToken')).token);
    }
  }, []);

 
  useEffect(() => {
    if (!redditToken) {
      setLoading(true);
      return;
    }

    const getData = async () => {
      setLoading(true);

      // Update the document title using the browser API
      console.log('going to attempt to use access token now');
      const redditMeQuery = {
        accessToken: redditToken,
      };
      if (me && !me.name) {
        const ansMe = await axios.get('http://localhost:5000/reddit/me', {
          params: redditMeQuery,
        });

        if (ansMe.status === 200) {
          setMe(ansMe.data);
          //because me contains vital information, such as a username, maybe we should nest all of the calls? or perhaps get one big blob of data from one backend call?
          const redditUserQuery = {
            accessToken: redditToken,
            username: ansMe.data.name,
          };
          const ansOverview = await axios.get(
            'http://localhost:5000/reddit/userOverview',
            { params: redditUserQuery }
          );
          if (ansOverview.status === 200) {
            setComments(ansOverview.data.comments);
            setMessages(ansOverview.data.messages);
            setPosts(ansOverview.data.posts);
          }
          const ansComments = await axios.get(
            'http://localhost:5000/reddit/userComments',
            {
              params: redditUserQuery,
            }
          );
          if (ansComments.status === 200) {
            let array = ansComments.data.overview.data.children;
            let comm_str = '';
            array.forEach((comm) => {
              comm_str += comm.data.body;
            });
            getUncommon(comm_str);
            setTagCloud(getWordList(getUncommon(comm_str).join(' ')));
          }

          const ansSubKarma = await axios.get(
            'http://localhost:5000/reddit/userSubKarma',
            {
              params: redditUserQuery,
            }
          );
          if (ansSubKarma.status === 200) {
            console.log("Sub Karma Info Receieved!")
            setSubKarmaList(ansSubKarma.data.subKarma);
            console.log(subKarmaList);
          }

          const ansTotalKarma = await axios.get(
            'http://localhost:5000/reddit/userTotalKarma',
            {
              params: redditUserQuery,
            }
          );
          if (ansTotalKarma.status === 200) {
            console.log("Total Karma Info Receieved!")

            // console.log(ansTotalKarma.data.commentKarma);
            // console.log(ansTotalKarma.data.linkKarma);
            // console.log(ansTotalKarma.data.awardKarma);
            // console.log(ansTotalKarma.data.totalKarma);

            setCommentKarma(ansTotalKarma.data.commentKarma);
            setLinkKarma(ansTotalKarma.data.linkKarma);
            setAwardKarma(ansTotalKarma.data.awardKarma);
            setTotalKarma(ansTotalKarma.data.totalKarma);

    
          }

          console.log('loading done');
        }
      }
      setLoading(false);
    };
    getData();
  }, [redditToken]);

  const getMaxScore = (list) => {
    if (loading) {
      return {};
    }
    var maxScore = 0;
    list.forEach(function (item, index) {
      if (item.score > maxScore) {
        maxScore = item.score;
      }
    });
    return maxScore;
  };

  const getMaxItem = (list, maxScore) => {
    if (loading) {
      return {};
    }
    var maxItem = {};
    list.forEach(function (item, index) {
      if (item.score === maxScore) {
        maxItem = item;
      }
    });
    return maxItem;
  };

  const getScores = (list) => {
    if (loading) {
      return [];
    }
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

  return loading ? (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <h1 style={{ color: '#3d3d3d' }}>Loading...</h1>
    </div>
  ) : (
    <div className={styles.box}>
      <Carousel
        variant='dark'
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
                    label='Post Scores'
                    xaxis='post score'
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
                    label='Comment Scores'
                    xaxis='Comment score'
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
              <Card style={{ borderColor: '#3d3d3d' }}>
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
              <Card style={{ borderColor: '#3d3d3d' }}>
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
              <Card style={{ borderColor: '#3d3d3d' }}>
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
          </Card>
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
            <Row>
              <Col>
                <h1>
                  {' '}
                  Wow you've said a lot of things in the past. Here's some of
                  the words you most frequently use:
                </h1>
              </Col>
              <Col>
                <TagCloud tags={tagCloud} minSize={32} maxSize={60} />
              </Col>
            </Row>
          </Card>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default RedditPage;
