import React, { useState, useEffect } from 'react';
// import { Button, Container, Row, Col } from "react-bootstrap";
// import Popup from 'reactjs-popup';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import styles from './createAccount.module.css';

const CreateAccount = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [phone, setPhone] = useState('');
  const [formatPhone, setFormatPhone] = useState(''); //Different from phone (Visual Purposes Only)
  const [smsCode, setSMSCode] = useState('');
  const [errorText, setErrorText] = useState('');
  const [showErrorModal, setErrorModal] = useState('');
  const [verifyText, setVerifyText] = useState('');

  useEffect(() => {
    if (!showModal) {
      setVerifyText('');
    }
  }, [showModal]);

  const handleCloseError = () => setErrorModal(false); // Handles Error Modal Close
  const handleClose = async (e) => {
    e.preventDefault();
    console.log('verifying sms code');
    const body = {
      email: email,
      code: smsCode,
    };
    try {
      const res = await axios.post('/verifyUser/', body);
      if (res.status === 200) {
        localStorage.setItem('email', email);
        props.navigate('/dashboard', { state: { email: email } });
      } else {
        setVerifyText('Incorrect code!');
      }
    } catch (err) {
      setVerifyText('Incorrect code!');
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //axios stuff
    const body = {
      email: email,
      password: password,
      phone: phone,
    };
    console.log('lasdas');
    if (
      !email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      setErrorText('Email is not valid');
      setErrorModal(true);
      return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      setErrorText(
        'Passwords must be at least 8 characters and contain at least one letter and one number'
      );
      setErrorModal(true);
      return;
    }
    if (confirmPassword !== password) {
      setErrorText('Passwords do not match');
      setErrorModal(true);
      return;
    } else {
      axios
        .post('/userCreation/', body)
        .then((res) => {
          console.log('now res is');
          console.log(res);
          if (res.status === 200) {
            console.log('the modal should popup now');
            setShowModal(true);
          } else {
            // console.log('there was an error in user creation');
            setErrorText('there was an error in user creation');
            setErrorModal(true);
          }
        })
        .catch((error) => {
          if (error.response) {
            console.log('error catch');
            console.log(error.response.data.message);
            setErrorModal(true);
            setErrorText(error.response.data.message);
          }
        });
    }
  };

  // Formats Phone Number
  function formatPhoneNumber(value) {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  }

  return (
    <div>
      <div className={styles.background}>
        <div className={styles.createAcc_background}>
          <h1>Create Account</h1>
          <Modal show={showModal}>
            <Modal.Header>
              <Modal.Title>Verify phone number</Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.modalText}>
              The phone number provided was used to create a two factor user.
              Please enter the code sent to your phone to verify this
              connection.
              <div style={{color: 'red'}}> {verifyText} </div>
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
          <Modal show={showErrorModal} onHide={handleCloseError}>
            <Modal.Header closeButton>
              <Modal.Title>SIGNUP ERROR</Modal.Title>
            </Modal.Header>
            <Modal.Body>{errorText}</Modal.Body>
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
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className='form-group'>
              <label>Confirm Password: </label>
              <input
                type='password'
                className='form-control'
                placeholder='password'
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
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
                  const phoneNum = formatPhoneNumber(e.target.value);
                  setFormatPhone(phoneNum);
                  setPhone(e.target.value);
                }}
                value={formatPhone}
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
            <a href='/login' className={styles.return}>
              Returning user?
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
