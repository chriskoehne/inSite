import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Card, Col, Carousel, Button, ButtonGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import BarChart from '../Charts/BarChart';
import LineChart from '../Charts/LineChart';
import { useNavigate } from 'react-router';
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  defaults,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
// import faker from '@faker-js/faker';
import styles from './Reddit.module.css';
import { TagCloud } from 'react-tagcloud';
import { getMonths, getDays, getLastThirty } from './RedditComments';
import useDidMountEffect from '../../hooks/useDidMountEffect';
import { getUncommon, getWordList, isFalsy } from './helperFunctions';
import ReactTooltip from 'react-tooltip';
import hasToolTips from '../../helpers/hasToolTips';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
defaults.color = document.body.classList.contains('dark') ? '#e3e3e3' : 'grey';

const RedditPage = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState({});
  const [tagCloud, setTagCloud] = useState([]);
  const [redditToken, setRedditToken] = useState('');
  const [comments, setComments] = useState([]);
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
  const [mostControversialPost, setmostControversialPost] = useState({});
  const [mostControversialComment, setMostControversialComment] = useState({});
  const [karmaHistory, setKarmaHistory] = useState([]);
  const [historyLabels, setHistoryLabels] = useState([]);
  const [karmaScores, setKarmaScores] = useState([]);
  //chartComment
  const [chartCommentData, setChartCommentData] = useState({
    datasets: [],
  });
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
  const [chartHistoryData, setChartHistoryData] = useState({
    datasets: [],
  });
  
  // const [chartOptions, setChartOptions] = useState({});

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
    const getStoredRedditData = async () => {
      try {
        if (!JSON.parse(localStorage.getItem('settings')).permissions.reddit) {
          console.log('no permissions');
          return false;
        }
        const ans = await axios.get('/user/reddit', {
          params: { email: localStorage.getItem('email') },
        });
        if (
          ans.status === 200 &&
          ans.data.message !== null &&
          !isFalsy(ans.data.message) &&
          !isFalsy(ans.data.message.overview)
        ) {
          const redditData = ans.data.message;
          console.log(redditData.karma)
          setPosts(redditData.overview.posts);
          setComments(redditData.overview.comments);
          setSubKarmaList(redditData.subKarma);
          setCommentKarma(redditData.karma.commentKarma);
          setLinkKarma(redditData.karma.linkKarma);
          setAwardKarma(redditData.karma.awardKarma);
          setTotalKarma(redditData.karma.totalKarma);
          console.log('loading done 1');
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    };

    const doTheThing = async () => {
      setLoading(true);

      if (await getStoredRedditData()) {
        setLoading(false);
      } else if (!hasToken()) {
        navigate('/dashboard');
        return;
      } else {
        setRedditToken(JSON.parse(localStorage.getItem('redditToken')).token);
      }
    };
    doTheThing();
    //TODO: replace below following process in https://betterprogramming.pub/stop-lying-to-react-about-missing-dependencies-10612e9aeeda
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useDidMountEffect(() => {
    let postArr = [];
    posts.forEach((e) => {
      if (e.is_self) {
        postArr.push(e);
      }
    });
    // most controversial post
    let mostControversialP = postArr[0];
    postArr.forEach((e) => {
      if (mostControversialP.upvote_ratio > e.upvote_ratio) {
        mostControversialP = e;
      }
    });
    setmostControversialPost(mostControversialP);
  }, [posts]);

  useDidMountEffect(() => {
    //setCommentByMonths
    let commentStr = '';
    comments.forEach((comm) => {
      commentStr += comm.body;
    });
    setTagCloud(getWordList(getUncommon(commentStr).join(' ')));
    // get comments by Month
    let mostControversial = comments[0];
    //console.log(mostControversial.data);
    let monthsData = getMonths(comments);
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
    let dayDate = getDays(comments);
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
    let thirtyDate = getLastThirty(comments);
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
    setMostControversialComment(mostControversial);
    
  }, [comments]);

  useDidMountEffect(() => {
    let labels = [];
    let subKarmaDataset = [
      {
        label: 'Comment Karma',
        borderColor: '#ff4500',
        backgroundColor: '#ff4500',
      },
      {
        label: 'Post Karma',
        borderColor: 'black',
        backgroundColor: 'white',
        borderWidth: 1,
      },
    ];
    let comKarma = [];
    let postKarma = [];
    Object.keys(subKarmaList).forEach((key, index) => {
      labels.push('r/' + subKarmaList[key].sr);
      comKarma.push(subKarmaList[key].comment_karma);
      postKarma.push(subKarmaList[key].link_karma);
    });
    subKarmaDataset[0].data = comKarma;
    subKarmaDataset[1].data = postKarma;
    // console.log(subKarmaDataset);
    setChartCommentData({ labels: labels, datasets: subKarmaDataset });
    // console.log(subKarmaList);
  }, [subKarmaList]);

  useEffect(() => {
    if (!redditToken) {
      return;
    }

    const getData = async () => {
      // console.log('getting reddit data');
      setLoading(true);
      const redditMeQuery = {
        accessToken: redditToken,
      };
      if (me && !me.name) {
        const ansMe = await axios.get('/reddit/me', {
          params: redditMeQuery,
        });
        if (ansMe.status === 200) {
          // console.log('reddit me worked');
          setMe(ansMe.data);
          //because me contains vital information, such as a username, maybe we should nest all of the calls? or perhaps get one big blob of data from one backend call?
          const redditUserQuery = {
            accessToken: redditToken,
            username: ansMe.data.name,
            email: localStorage.getItem('email'),
          };
          const ansOverview = await axios.get('/reddit/userOverview', {
            params: redditUserQuery,
          });
          if (ansOverview.status === 200) {
            // console.log('reddit overview worked');
            setPosts(ansOverview.data.posts);
            setComments(ansOverview.data.comments);
          }

          const ansSubKarma = await axios.get('/reddit/userSubKarma', {
            params: redditUserQuery,
          });
          if (ansSubKarma.status === 200) {
            setSubKarmaList(ansSubKarma.data.subKarmaList);
          }

          const ansTotalKarma = await axios.get('/reddit/userTotalKarma', {
            params: redditUserQuery,
          });
          if (ansTotalKarma.status === 200) {

            const history = ansTotalKarma.data.redditHistory.karmaHistory;
            let labels = []
            let karmaScores = []
            setKarmaHistory(ansTotalKarma.data.redditHistory.karmaHistory);
            setCommentKarma(ansTotalKarma.data.commentKarma);
            setLinkKarma(ansTotalKarma.data.linkKarma);
            setAwardKarma(ansTotalKarma.data.awardKarma);
            setTotalKarma(ansTotalKarma.data.totalKarma);

            
            history.forEach(obj => {
              
              let date = new Date(obj.time);
              labels.push(date.toLocaleString());
              karmaScores.push(obj.karma);
            });
            let historyDataset = {
              labels: labels,
              datasets: [
                {
                  label: 'Total Karma',
                  data: karmaScores,
                  borderColor: '#ff4500',
                  backgroundColor: '#ff4500',
                },
              ],
            };

            setChartHistoryData(historyDataset);
          }
        }
      }
      setLoading(false);
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redditToken]);

  const getMaxItem = (list) => {
    if (loading) {
      return {};
    }
    let maxItem = {};
    let maxScore = -Infinity;
    for (let item of list) {
      if (item.score > maxScore) {
        maxItem = item;
        maxScore = item.score;
      }
    }
    return maxItem;
  };

  const getMinItem = (list) => {
    if (loading) {
      return {};
    }
    let minItem = {};
    let minScore = Infinity;
    for (let item of list) {
      if (list === posts && !item.title) {
        continue;
      }
      if (item.score < minScore) {
        minItem = item;
        minScore = item.score;
      }
    }
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

  const isDarkMode = () => {
    return document.body.classList.contains('dark') ? 'light' : 'dark';
  };

  // console.log(chartCommentData);
  // console.log(chartThirtyData);
  let options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

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
        variant={isDarkMode()}
        className={styles.slideshow}
        activeIndex={index}
        onSelect={handleSelect}
      >
        <Carousel.Item className={styles.slideshowCard}>
          <Card
            style={{ justifyContent: 'center' }}
            className={styles.socialsCard}
          >
            <Row>
              <h2>Karma Overview</h2>
              <br />
              <br />
              <br />
              <Col>
                <h4
                  data-tip={
                    hasToolTips()
                      ? "Karma: A user's score, totaling their amount of upvotes against their downvotes. Mostly it's about reputation"
                      : ''
                  }
                >
                  Total Karma: {totalKarma}
                </h4>
                <br />
                <Row>
                  <Col
                    data-tip={
                      hasToolTips()
                        ? "Karma: A user's score, totaling their amount of upvotes against their downvotes. Mostly it's about reputation"
                        : ''
                    }
                  >
                    <h5>Post Karma: {linkKarma}</h5>
                  </Col>
                  <Col
                    data-tip={
                      hasToolTips()
                        ? "Karma: A user's score, totaling their amount of upvotes against their downvotes. Mostly it's about reputation"
                        : ''
                    }
                  >
                    <h5>Comment Karma: {commentKarma}</h5>
                  </Col>
                  <Col
                    data-tip={
                      hasToolTips()
                        ? "Karma: A user's score, totaling their amount of upvotes against their downvotes. Mostly it's about reputation"
                        : ''
                    }
                  >
                    <h5>Award Karma: {awardKarma}</h5>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h5>Number of Posts: {posts.length}</h5>
                  </Col>
                  <Col>
                    <h5>Number of Comments: {comments.length}</h5>
                  </Col>
                </Row>
                <br />
                <Row>
                  <h3>Top Subreddits</h3>
                  {Object.keys(subKarmaList).map((key, index) => (
                    <p key={index}>
                      {' '}
                      r/{subKarmaList[key].sr}: comment karma:{' '}
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
              <Bar
                height={'50vh'}
                width={'75vw'}
                color={'#ff4500'}
                data={chartCommentData}
                options={options}
              />
              <div style={{ paddingTop: '2%' }}>
                Here we see a graphical representation of a user's Karma score
                by Subreddit
              </div>
            </Row>
          </Card>
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
            <Row className={styles.chartContainer}>
              <BarChart
                height={'60vh'}
                color={'#ff4500'}
                data={getScores(posts)}
                maxVal={getMaxItem(posts).score}
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
                color={'#ff4500'}
                data={getScores(comments)}
                maxVal={getMaxItem(comments).score}
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
                Most Upvoted Post - {getMaxItem(posts).score} Karma{' '}
                {/* TODO karma or upvotes */}
                <Card className={styles.textCard}>
                  <Card.Body>
                    <Card.Title>{getMaxItem(posts).title}</Card.Title>
                    <Card.Text>
                      <iframe
                        title='most upvoted post'
                        id='reddit-embed'
                        style={{ height: '200px' }}
                        src={
                          'https://www.redditmedia.com' +
                          getMaxItem(posts).permalink +
                          '?depth=1&amp;showmore=false&amp;embed=true&amp;'
                        }
                        sandbox='allow-scripts allow-same-origin allow-popups'
                        className={styles.embeddedComment}
                      ></iframe>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                Most Upvoted Comment - {getMaxItem(comments).score} Karma
                <Card className={styles.textCard}>
                  <Card.Body>
                    <Card.Title>{getMaxItem(comments).link_title}</Card.Title>
                    <Card.Text>
                      <iframe
                        title='most upvoted comment'
                        id='reddit-embed'
                        style={{ height: '200px' }}
                        src={
                          'https://www.redditmedia.com' +
                          getMaxItem(comments).permalink +
                          '?depth=1&amp;showmore=false&amp;embed=true&amp;showmedia=false'
                        }
                        sandbox='allow-scripts allow-same-origin allow-popups'
                        className={styles.embeddedComment}
                      ></iframe>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                Most Downvoted Post - {getMinItem(posts).score} Karma
                <Card className={styles.textCard}>
                  <Card.Body>
                    <Card.Title>{getMinItem(posts).title}</Card.Title>
                    <Card.Text>
                      <iframe
                        title='most downvoted post'
                        id='reddit-embed'
                        style={{ height: '200px' }}
                        src={
                          'https://www.redditmedia.com' +
                          getMinItem(posts).permalink +
                          '?depth=1&amp;showmore=false&amp;embed=true&amp;'
                        }
                        sandbox='allow-scripts allow-same-origin allow-popups'
                        className={styles.embeddedComment}
                      ></iframe>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                Most Downvoted Comment - {getMinItem(comments).core} Karma
                <Card className={styles.textCard}>
                  <Card.Body>
                    <Card.Title>{getMinItem(comments).link_title}</Card.Title>
                    <Card.Text>
                      <iframe
                        title='most downvoted comment'
                        id='reddit-embed'
                        style={{ height: '200px' }}
                        src={
                          'https://www.redditmedia.com' +
                          getMinItem(comments).permalink +
                          '?depth=1&amp;showmore=false&amp;embed=true&amp;showmedia=false'
                        }
                        sandbox='allow-scripts allow-same-origin allow-popups'
                        className={styles.embeddedComment}
                      ></iframe>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                Most Controversial Post
                <Card className={styles.textCard}>
                  <Card.Body>
                    <Card.Title>{mostControversialPost.title}</Card.Title>
                    <iframe
                      title='most controversial post'
                      id='reddit-embed'
                      src={
                        'https://www.redditmedia.com' +
                        mostControversialPost.permalink +
                        '?depth=1&amp;showmore=false&amp;embed=true&amp;'
                      }
                      sandbox='allow-scripts allow-same-origin allow-popups'
                      className={styles.embeddedComment}
                    ></iframe>
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
                    <iframe
                      title='most controversial comment'
                      id='reddit-embed'
                      src={
                        'https://www.redditmedia.com' +
                        mostControversialComment.permalink +
                        '?depth=1&amp;showmore=false&amp;embed=true&amp;showmedia=false'
                      }
                      sandbox='allow-scripts allow-same-origin allow-popups'
                      className={styles.embeddedComment}
                    ></iframe>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card>
        </Carousel.Item>
        <Carousel.Item className={styles.slideshowCard}>
          <Card
            style={{ justifyContent: 'center' }}
            className={styles.socialsCard}
          >
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
        {console.log(chartHistoryData)}
        <Carousel.Item className={styles.slideshowCard}>
          <Card className={styles.socialsCard}>
            <Row className={styles.chartContainer}>
              <Line
                height={'50vh'}
                width={'75vw'}
                color={'#ff4500'}
                data={chartHistoryData}
                options={options}
              />
              <div style={{ paddingTop: '2%' }}>
                Here we see a graphical representation of a user's total karma score over time
              </div>
            </Row>
          </Card>
        </Carousel.Item>
      </Carousel>
      
      <ReactTooltip />
    </div>
  );
};

export default RedditPage;
