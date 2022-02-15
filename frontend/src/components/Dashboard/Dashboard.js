// import React, { useState } from 'react';
import axios from 'axios';
import { Container, Navbar, Row } from 'react-bootstrap';
import {useLocation} from 'react-router-dom';
import InsightCard from './InsightCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';

const Dashboard = (props) => {

  const { state } = useLocation();
  // const email = props.navigate.arguments.email || 'Invalid login occurred'
  
  //check if user has reddit username 
  async function checkReddit(){
    const body = {
      email: state.email,
    };
    let res = await axios.get("http://localhost:5000/redditUser/", body);
    return res.datasuccess;
  }
  // const user = axios.

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
        <InsightCard title='Reddit' text='put Reddit stuff here' isLoggedIn={checkReddit()}/>
        <InsightCard title='Twitter' text='put Twitter stuff here' />
        <InsightCard title='Instagram' text='put Instagram stuff here' />
        <InsightCard title='YouTube' text='put YouTube stuff here' />
      </Row>
    </div>
  );
};

export default Dashboard;
