import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Navbar, Row, Button } from 'react-bootstrap';
import {useLocation} from 'react-router-dom';
import InsightCard from './InsightCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';
import { Alert } from 'react-alert'

//import Dropdown from './Dropdown'


const ChangePassword = (props) => {
  //const [oldPassword, setPassword] = useState('');
  //const [newPassword, setEmail] = useState('');
  const [newPass, setPassword] = useState('');
  const [newPass2, setPhone] = useState('');

  function checkPasswords(value1, value2) {
    if (value1 != value2) {
      alert("Your passwords do not match!")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();


    


  };

  const handleBackDash = () => {
    props.navigate('/dashboard/*');
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
          <Button onClick={handleBackDash} variant="secondary">Back to Dashboard</Button>{' '}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Row xs={1} md={2} className='justify-content-center'>
      <div>
      <div className={styles.background}>
        <div className={styles.cp_background}>
          <h1>Change Password</h1>
          
          <form onSubmit={checkPasswords(newPass, newPass2)}>
            <div className='form-group' id='oldPass'>
              <label>Old Password: </label> 
              <input
                type='password'
                className='form-control'
                placeholder='Old Password'
                
              />
            </div>
            <div className='form-group' id='newPass'>
              <label>New Password: </label>
              <input
                type='password'
                className='form-control'
                placeholder='New Password'
               
              />
            </div>
            <div className='form-group' id='newPass2'>
              <label>Verify New Password: </label>
              <input
                type='password'
                className='form-control'
                placeholder='Retype New Password'
      
              />
            </div>
            <br></br>
            <div className='form-group'>
              <input
                type='submit'
                value='Change Password'
                className='btn btn-secondary'
              />
            </div>
          </form >
        </div>
      </div>
    </div>
      </Row>
    </div>
  );

};

export default ChangePassword;
