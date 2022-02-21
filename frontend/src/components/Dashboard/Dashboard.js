import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Navbar, Row, Dropdown } from 'react-bootstrap';
import {useLocation} from 'react-router-dom';
import InsightCard from './InsightCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';
import ChangePassword from './ChangePassword';
//import Logos from './Logos'
//import Dropdown from './Dropdown'


const Dashboard = (props) => {

  const { state } = useLocation();
  const [redditSuccess, setRedditSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('')

  // const email = props.navigate.arguments.email || 'Invalid login occurred'
  
  // console.log("logging")
  // console.log(props)
  // console.log(params)
  useEffect(() => {
    // Update the document title using the browser API
    getEmail();
  });

  const getEmail = () => {
    if (state) {
      setEmail(state.email)
    } else {
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

  const handleChangePassword = () => {
    props.navigate('/ChangePassword');
  };

  const handleSignOut = () => {
    props.navigate('/welcome');
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
          <Navbar.Collapse className='justify-content-end'>
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-button-transparent">
              Settings
            </Dropdown.Toggle>

            <Dropdown.Menu>

              <Dropdown.Item onClick={handleChangePassword} href="#/action-1">Change password</Dropdown.Item>
              <Dropdown.Item onClick={handleSignOut} href="#/action-2">Sign Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      <Row xs={1} md={2} className={styles.cardRow}>
        <InsightCard title='Reddit' text='Reddit' isLoggedIn={redditSuccess} email={email} code={code} navigate={props.navigate} setExternalUrl={props.setExternalUrl}/>
        <InsightCard title='Twitter' text='put Twitter stuff here' isLoggedIn={true}/>
        <InsightCard title='Instagram' text='put Instagram stuff here' isLoggedIn={true}/>
        <InsightCard title='YouTube' text='put YouTube stuff here' isLoggedIn={true}/>
      </Row>
    </div>
  );

};

export default Dashboard;
