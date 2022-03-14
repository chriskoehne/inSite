import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Row, Card, Col, Carousel, Button, ButtonGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import BarChart from '../Charts/BarChart';
import LineChart from '../Charts/LineChart';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import faker from '@faker-js/faker';
import styles from './Reddit.module.css';
import { TagCloud } from 'react-tagcloud';
import { getMonths, getDays, getLastThirty } from './RedditComments';

const c = require('./constants/constants');
// const redditColor = getComputedStyle(document.documentElement).getPropertyValue('--reddit');

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
  const [commentGraphDay, setCommentGraphDay] = useState(true);
  const [commentGraphThirty, setCommentGraphThirty] = useState(false);
  const [commentGraphMonth, setCommentGraphMonth] = useState(false);
  const [mostControversialPost, setmostControlversialPost] = useState({});
  const [mostControversialComment, setMostControversialComment] = useState({});
  //testing chartData stuff
  const [chartMonthData, setChartMonthData] = useState({
    datasets: [],
  });
  const [chartDayData, setChartDayData] = useState({
    datasets: [],
  });
  const [chartThirtyData, setChartThirtyData] = useState({
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState({});

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
            let pst = ansOverview.data.posts;
            let arrPost = [];
            pst.forEach((e) => {
              if (e.is_self) {
                arrPost.push(e);
              }
            });
            let mostControversial = arrPost[0];
            arrPost.forEach((e) => {
              if (mostControversial.upvote_ratio > e.upvote_ratio) {
                mostControversial = e;
              }
            });
            setmostControlversialPost(mostControversial);
          }
          const ansComments = await axios.get(
            'http://localhost:5000/reddit/userComments',
            {
              params: redditUserQuery,
            }
          );
          if (ansComments.status === 200) {
            let array = ansComments.data.overview.data.children;
            //setCommentByMonths
            let comm_str = '';
            array.forEach((comm) => {
              comm_str += comm.data.body;
            });
            getUncommon(comm_str);
            setTagCloud(getWordList(getUncommon(comm_str).join(' ')));
            // get comments by Month
            let mostControversial = array[0];
            //console.log(mostControversial.data);
            let monthsData = getMonths(array);
            let monthsDataset = {
              labels: monthsData.monthYear.reverse(),
              datasets: [
                {
                  label: 'Number of Comments',
                  data: monthsData.numComments.reverse(),
                  borderColor: '#ff4500',
                  backgroundColor: '#ff4500',
                  xaxis: 'Months',
                },
              ],
            };
            let dayDate = getDays(array);
            let dayDataset = {
              labels: dayDate.daysOfWeek.reverse(),
              datasets: [
                {
                  label: 'Number of Comments',
                  data: dayDate.numComments.reverse(),
                  borderColor: '#ff4500',
                  backgroundColor: '#ff4500',
                },
              ],
            };
            let thirtyDate = getLastThirty(array);
            let thirtyDataset = {
              labels: thirtyDate.lastThirty.reverse(),
              datasets: [
                {
                  label: 'Number of Comments',
                  data: thirtyDate.numComments.reverse(),
                  borderColor: '#ff4500',
                  backgroundColor: '#ff4500',
                },
              ],
            };
            setChartThirtyData(thirtyDataset);
            setChartDayData(dayDataset);
            setChartMonthData(monthsDataset);
            setMostControversialComment(mostControversial.data);
            setChartOptions({
              responsive: true,
              maintainAspectRatio: false,
              scale: {
                ticks: {
                  precision: 0,
                },
              },
            });
            //setCommentsMonth(monthsData.monthYear)
            //console.log(commentByMonth)
          }

          const ansSubKarma = await axios.get(
            'http://localhost:5000/reddit/userSubKarma',
            {
              params: redditUserQuery,
            }
          );
          if (ansSubKarma.status === 200) {
            // console.log("Sub Karma Info Receieved!")
            setSubKarmaList(ansSubKarma.data.subKarmaList);
            // console.log(subKarmaList);
          }

          const ansTotalKarma = await axios.get(
            'http://localhost:5000/reddit/userTotalKarma',
            {
              params: redditUserQuery,
            }
          );
          if (ansTotalKarma.status === 200) {
            // console.log("Total Karma Info Receieved!")

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

  const getMinScore = (list) => {
    if (loading) {
      return {};
    }
    var minScore = 0;
    list.forEach(function (item, index) {
      if (item.score < minScore) {
        if (list === posts && !item.title) {
          // skip non-post items
          return;
        }
        minScore = item.score;
      }
    });
    return minScore;
  };

  const getMinItem = (list, minScore) => {
    if (loading) {
      return {};
    }
    var minItem = {};
    list.forEach(function (item, index) {
      if (item.score === minScore) {
        if (list === posts && !item.title) {
          // skip non-post items
          return;
        }
        minItem = item;
      }
    });
    return minItem;
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

  const commentMonthClick = () => {
    setCommentGraphDay(false);
    setCommentGraphThirty(false);
    setCommentGraphMonth(true);
  };

  const commentWeekClick = () => {
    setCommentGraphDay(false);
    setCommentGraphThirty(true);
    setCommentGraphMonth(false);
  };

  const commentDayClick = () => {
    setCommentGraphDay(true);
    setCommentGraphThirty(false);
    setCommentGraphMonth(false);
  };

  const isDarkmode = () => {
    return document.body.classList.contains('dark') ? 'light' :'dark'
  }

  //clunky, but follow the above and add to the following if statements for the other social medias

  return loading ? (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <h1 style={{ color: 'var(--primary)' }}>Loading...</h1>
    </div>
  ) : (
    <div className={styles.box}>
      <Carousel
        variant={(isDarkmode())}
        className={styles.slideshow}
        activeIndex={index}
        onSelect={handleSelect}
      >
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
            <Row>
              <Col>
                <Row>Total Karma: {totalKarma}</Row>
                <Row>Post Karma: {linkKarma}</Row>
                <Row>Comment Karma: {commentKarma}</Row>
                <Row>Award Karma: {awardKarma}</Row>
                <Row>Number of Posts: {posts.length}</Row>
                <Row>Number of Comments: {comments.length}</Row>
                <Row>
                  {Object.keys(subKarmaList).map((key, index) => (
                    <p key={index}>
                      {' '}
                      Subreddit: {subKarmaList[key].sr}, comment karma:{' '}
                      {subKarmaList[key].comment_karma}, post karma:{' '}
                      {subKarmaList[key].link_karma}
                    </p>
                  ))}
                </Row>
              </Col>
            </Row>
          </Card>
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
            <Row className={styles.chartContainer}>
              <BarChart
                height={'60vh'}
                data={getScores(posts)}
                maxVal={getMaxScore(posts)}
                label='Post Scores'
                xaxis='post score'
              />
              <div style={{ paddingTop: '2%' }}>
                Here we see a graphical representation of a user's post scores.
                Each bucket represents the number of posts that fall within the
                range for the score.
              </div>
            </Row>
          </Card>
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
            <Row className={styles.chartContainer}>
              <BarChart
                height={'60vh'}
                data={getScores(comments)}
                maxVal={getMaxScore(comments)}
                label='Comment Scores'
                xaxis='Comment score'
              />
              <div style={{ paddingTop: '2%' }}>
                Here we see a graphical representation of a user's comment
                scores. Each bucket represents the number of comments that fall
                within the range for the score.
              </div>
            </Row>
          </Card>
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
            <Row>
              <Col>
                Most Upvoted Post - {getMaxScore(posts)} Karma{' '}
                {/* TODO karma or upvotes */}
                <Card className={styles.textCard}>
                  <Card.Body>
                    <Card.Title>
                      {getMaxItem(posts, getMaxScore(posts)).title}
                    </Card.Title>
                    <Card.Text>
                      {getMaxItem(posts, getMaxScore(posts)).selftext}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                Most Upvoted Comment - {getMaxScore(comments)} Karma
                <Card className={styles.textCard}>
                  <Card.Body>
                    <Card.Title>
                      {getMaxItem(comments, getMaxScore(comments)).link_title}
                    </Card.Title>
                    <Card.Text>
                      {getMaxItem(comments, getMaxScore(comments)).body}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            {/* <Row>
              Most Upvoted Message - {getMaxScore(comments)} Karma
              <Card className={styles.textCard}>
                <Card.Body>
                  <Card.Title>
                    {getMaxItem(messages, getMaxScore(messages)).link_title}
                  </Card.Title>
                  <Card.Text>
                    {getMaxItem(messages, getMaxScore(messages)).body}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Row> */}
            <Row>
              <Col>
                Most Downvoted Post - {getMinScore(posts)} Karma
                <Card className={styles.textCard}>
                  <Card.Body>
                    <Card.Title>
                      {getMinItem(posts, getMinScore(posts)).title}
                    </Card.Title>
                    <Card.Text>
                      {getMinItem(posts, getMinScore(posts)).selftext}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                Most Downvoted Comment - {getMinScore(comments)} Karma
                <Card className={styles.textCard}>
                  <Card.Body>
                    <Card.Title>
                      {getMinItem(comments, getMinScore(comments)).link_title}
                    </Card.Title>
                    <Card.Text>
                      {getMinItem(comments, getMinScore(comments)).body}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            {/* <Row>
              Most Downvoted Message - {getMinScore(comments)} Karma
              <Card className={styles.textCard}>
                <Card.Body>
                  <Card.Title>
                    {getMinItem(messages, getMinScore(messages)).link_title}
                  </Card.Title>
                  <Card.Text>
                    {getMinItem(messages, getMinScore(messages)).body}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Row> */}
            <Row>
              <Col>
                Most Controversial Post
                <Card className={styles.textCard}>
                  <Card.Body>
                    <Card.Title>{mostControversialPost.title}</Card.Title>
                    <Card.Text>{mostControversialPost.selftext}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                Most Controversial Comment
                <Card className={styles.textCard}>
                  <Card.Body>
                    <Card.Title>
                      {mostControversialComment.link_title}
                    </Card.Title>
                    <Card.Text>{mostControversialComment.body}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card>
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
            <Row>
              <Col>
                <h3>
                  Wow, you've said a lot of things in the past. <br></br>
                  Here's some of the words you most frequently use:
                </h3>
                <div className={styles.cloudCentered}>
                  <TagCloud tags={tagCloud} minSize={32} maxSize={60} />
                </div>
              </Col>
            </Row>
          </Card>
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
            <Row>
              <h1>Comments over time</h1>

              <div className={styles.chartContainer}>
                {commentGraphMonth ? (
                  <LineChart
                    height={'50vh'}
                    width={'75vw'}
                    color={'#ff4500'}
                    data={chartMonthData}
                  />
                ) : null}
                {commentGraphDay ? (
                  <LineChart
                    height={'50vh'}
                    width={'75vw'}
                    color={'#ff4500'}
                    data={chartDayData}
                  />
                ) : null}
                {commentGraphThirty ? (
                  <LineChart
                    height={'50vh'}
                    width={'75vw'}
                    color={'#ff4500'}
                    data={chartThirtyData}
                  />
                ) : null}
              </div>
              <ButtonGroup aria-label='Basic example'>
                <Button variant='secondary' onClick={commentDayClick}>
                  Past Week
                </Button>
                <Button variant='secondary' onClick={commentWeekClick}>
                  Past Month
                </Button>
                <Button variant='secondary' onClick={commentMonthClick}>
                  Past Year
                </Button>
              </ButtonGroup>
            </Row>
          </Card>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default RedditPage;
