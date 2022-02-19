import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Navbar, Row } from 'react-bootstrap';
import {useLocation} from 'react-router-dom';
import InsightCard from './InsightCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';
import { authenticate } from '../../auth/auth';

const Dashboard = (props) => {

  const { state } = useLocation();
  const [redditSuccess, setRedditSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('')
  // const email = props.navigate.arguments.email || 'Invalid login occurred'
  

  useEffect(() => { 
    async function callAuthenticate() {
      await authenticate(props);
      if (/^dashboard\/*$/.test(window.location.pathname)) {
        console.log("window pathname is not dhasboard, so we are returning")
        return;
      }
      console.log("window pathname is dashboard so we call get email")
      getEmail(); // Update the document title using the browser API
    }

    callAuthenticate();
  
  }, []);


  const getEmail = () => {
    if (state) {
      console.log("state is somehow still set?")
      setEmail(state.email)
    } else {
      console.log("is state still true?")
      setRedditSuccess(true); // we should add further check of the query params to ensure we have error handling bc it can respond with an error code
      const currentUrl = window.location.href;
      let start = currentUrl.indexOf('state') + 6
      const after = currentUrl.substring(start)
      let end = after.indexOf('&');
      let almost = after.substring(0, end)
      let email = almost.replace('%40', '@')
      
      start = currentUrl.indexOf('code') + 5
      almost = currentUrl.substring(start)
      let code = almost.substring(0, almost.length - 2)
      console.log("email:")
      console.log(email)
      console.log("code:")
      console.log(code)
      setEmail(email)
      setCode(code)
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
        <InsightCard title='Reddit' text='Reddit' isLoggedIn={redditSuccess} email={email} code={code} navigate={props.navigate} setExternalUrl={props.setExternalUrl}/>
        <InsightCard title='Twitter' text='Twitter' isLoggedIn={true} email={email} navigate={props.navigate}/>
        <InsightCard title='Instagram' text='Instagram' isLoggedIn={true} email={email} navigate={props.navigate}/>
        <InsightCard title='YouTube' text='YouTube' isLoggedIn={true} email={email} navigate={props.navigate}/>
      </Row>
    </div>
  );

};

export default Dashboard;
