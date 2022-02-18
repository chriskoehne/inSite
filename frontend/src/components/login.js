import React, { useState, useEffect } from 'react';
// import { Button, Container, Row, Col } from "react-bootstrap";
import axios from 'axios';
// import { Link } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import styles from './login.module.css';
import { unauthedOnly } from '../auth';

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState('');
  const [smsCode, setSMSCode] = useState('');
  const [id, setId] = useState('');

  useEffect(() => {
    async function callUnauthedOnly() {
      await unauthedOnly(props);
    }
    callUnauthedOnly();
  }, []);

  const handleClose = (e) => {
    e.preventDefault();
    console.log('verifying sms code');
    console.log(smsCode);
    const body = {
      email: email,
      id: id,
      code: smsCode,
    };
    axios.post('http://localhost:5000/verifyUser/', body).then((res) => {
      try {
        if (res.status === 200) {
          console.log('status was 200');
          console.log('cookie is');
          console.log(res.cookie);
          props.navigate('/dashboard', { state: { email: email } });
        } else {
          console.log('incorrect code');
        }
      } catch (err) {
        console.log('hereasdfasd');
        console.log(err);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //axios stuff
    const body = {
      email: email,
      password: password,
    };

    axios.post('http://localhost:5000/login/', body).then((res) => {
      console.log(res);
      if (res.status === 200) {
        console.log('the modal should popup now');
        setId(res.message);
        setShowModal(true);
      } else {
        console.log('there was an error in user creation');
      }
    });
  };

  return (
    <div>
      <div className={styles.background}>
        <div className={styles.login_background}>
          <div className={styles.inlineDiv}>
            <h1 className={styles.in}>in</h1>
            <h1 className={styles.site}>Site</h1>
          </div>
          <Modal show={showModal}>
            <Modal.Header>
              <Modal.Title>Verify phone number</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Your phone number provided was used to create a two factor user.
              Please enter the code sent to your phone to verify this
              connection.
              <form onSubmit={handleClose}>
                <div className='form-group'>
                  <label>Code: </label>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Code'
                    onChange={(e) => setSMSCode(e.target.value)}
                  />
                </div>
                <br></br>
                <div className='form-group'>
                  <input
                    type='submit'
                    value='Submit Code'
                    className='btn btn-primary'
                  />
                </div>
              </form>
            </Modal.Body>
          </Modal>
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label>Email: </label>
              <input
                type='text'
                className='form-control'
                placeholder='email'
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className='form-group'>
              <label>Password: </label>
              <input
                type='password'
                className='form-control'
                placeholder='password'
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <br></br>
            <div className='form-group'>
              <input type='submit' value='Login' className='btn btn-primary' />
            </div>
          </form>
          <a href='/createAccount' className={styles.createAcc}>
            New User?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
