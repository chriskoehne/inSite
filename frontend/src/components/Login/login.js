import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import styles from './login.module.css';

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [errorText, setErrorText] = useState(''); // Set Error Text on Login Fail
  const [showErrorModal, setErrorModal] = useState('');

  useEffect(() => {
    if (!showModal) {
      setVerifyText('');
    }
  }, [showModal]);

  const handleCloseError = () => setErrorModal(false); // Handles Error Modal Close

  const handleSubmit = (e) => {
    e.preventDefault();
    //axios stuff
    const body = {
      email: email,
      password: password,
      secret: secretCode,
    };

    axios
      .post('/login/', body)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          console.log('good status');
          // setId(res.data.user.id);
          
          if (res.data.user.settings.darkMode) {
            document.body.classList.add('dark');
          }
          localStorage.setItem(
            'settings',
            JSON.stringify(res.data.user.settings)
          );
          localStorage.setItem('email', res.data.user.email);
          props.navigate('/dashboard', { state: { email: email } });
        } else {
          console.log('there was an error in login');
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data.message);
          setErrorModal(true);
          setErrorText(error.response.data.message);
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
          <Modal show={showErrorModal} onHide={handleCloseError}>
            <Modal.Header closeButton>
              <Modal.Title>Login Error</Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.modalText}>{errorText}</Modal.Body>
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
            <div className='form-group'>
              <label>Secret Code: </label>
              <input
                type='password'
                className='form-control'
                placeholder='secret'
                onChange={(e) => setSecretCode(e.target.value)}
              />
            </div>
            <br></br>
            <div className='form-group'>
              <input type='submit' value='Login' className='btn btn-primary' />
            </div>
          </form>
          <a href='/createAccount' className={styles.createAcc}>
            New user?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
