import React, { useState } from 'react';
// import { Button, Container, Row, Col } from "react-bootstrap";
import axios from 'axios';
// import { Link } from "react-router-dom";
import { Modal } from 'react-bootstrap';

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState('');
  const [smsCode, setSMSCode] = useState('');

  const handleClose = (e) => {
    e.preventDefault();
    console.log('verifying sms code');
    console.log(smsCode);
    const body = {
      email: email,
      code: smsCode,
    };
    axios.post('http://localhost:5000/verifyUser/', body).then((res) => {
      if (res.status === 200) {
        console.log('status was 200');
        props.navigate('/dashboard', {state:{email: email}});
      } else {
        console.log('incorrect code');
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

        setShowModal(true);
      } else {
        console.log('there was an error in user creation');
      }
    });
  };

  return (
    <div>
      <h1>login</h1>
      <Modal show={showModal}>
        <Modal.Header>
          <Modal.Title>Verify phone number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your phone number provided was used to create a two factor user.
          Please enter the code sent to your phone to verify this connection.
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
            type='text'
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
      <a href='/createAccount'>Create Account</a>
    </div>
  );
};

export default Login;
