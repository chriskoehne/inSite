import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Navbar, Row } from 'react-bootstrap';
import {useLocation} from 'react-router-dom';
import InsightCard from './InsightCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';

const Dashboard = (props) => {

  const { state } = useLocation();
  const [redditSuccess, setRedditSuccess] = useState(false);
  // const email = props.navigate.arguments.email || 'Invalid login occurred'
  
  // console.log("logging")
  // console.log(props)
  // console.log(params)

  const getEmail = () => {
    if (state) {
      return state.email
    } else {
      setRedditSuccess(true);
      const currentUrl = window.location.href;
      let start = currentUrl.indexOf('state') + 6
      const after = currentUrl.substring(start)
      let end = after.indexOf('&');
      let almost = after.substring(0, end)
      let email = almost.replace('%40', '@')
      console.log(email)
      return email
      //get it from the url
    }
  }
  
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
          <Navbar.Collapse className='justify-content-end'>
            <Navbar.Text style={{ color: 'white' }}>settings</Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      <Row xs={1} md={2} className={styles.cardRow}>
        <InsightCard title='Reddit' text='Reddit' isLoggedIn={redditSuccess} email={getEmail()} navigate={props.navigate} setExternalUrl={props.setExternalUrl}/>
        <InsightCard title='Twitter' text='put Twitter stuff here' />
        <InsightCard title='Instagram' text='put Instagram stuff here' />
        <InsightCard title='YouTube' text='put YouTube stuff here' />
      </Row>
    </div>
  );

};

export default Dashboard;
