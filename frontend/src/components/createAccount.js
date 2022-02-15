import React, { useState } from 'react';
// import { Button, Container, Row, Col } from "react-bootstrap";
// import Popup from 'reactjs-popup';
import axios from 'axios';
import { Modal } from 'react-bootstrap';

const CreateAccount = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState('');
  const [phone, setPhone] = useState('');
  const [smsCode, setSMSCode] = useState('');

  const handleClose = (e) => {
    e.preventDefault();
    console.log('verifying sms code');
    const body = {
      email: email,
      code: smsCode,
    };
    axios.post('http://localhost:5000/verifyUser/', body).then((res) => {
      if (res.status === 200) {
        props.navigate('/dashboard');
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
      phone: phone,
    };

    axios.post('http://localhost:5000/userCreation/', body).then((res) => {
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
      <h1>Create Account</h1>
      <Modal show={showModal}>
        <Modal.Header>
          <Modal.Title>Verify phone number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          The phone number provided was used to create a two factor user. Please
          enter the code sent to your phone to verify this connection.
          <form onSubmit={handleClose}>
            <div className='form-group'>
              <label>Code: </label>
              <input
                type='text'
                className='form-control'
                placeholder='Code'
                onChange={(e) => {
                  setSMSCode(e.target.value);
                }}
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
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className='form-group'>
          <label>Phone: </label>
          <input
            type='text'
            className='form-control'
            placeholder='phone'
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          />
        </div>
        <br></br>
        <div className='form-group'>
          <input
            type='submit'
            value='Create Account'
            className='btn btn-primary'
          />
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;

