import React, { useState } from 'react';
import axios from 'axios';
import { Row, Modal } from 'react-bootstrap';
import {useLocation} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';


const ChangePassword = (props) => {
  const { state } = useLocation();
  const [email, setEmail] = useState('');
  const [oldPassword, setPassword] = useState('');
  const [newPassword1, setPassword1] = useState('');
  const [newPassword2, setPassword2] = useState('');
  const [showModal, setShowModal] = useState('');
  const [id, setId] = useState('');
  const [errorText, setErrorText] = useState(''); // Set Error Text on Login Fail
  const [showErrorModal, setErrorModal] = useState('');



  const handleCloseError = () => setErrorModal(false);

  const handleClose = (e) => {
    e.preventDefault();
    props.navigate('/dashboard');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
 
    console.log("This is the email %s", email);
    console.log("This is the old password %s", oldPassword);
    console.log("This is the new password %s", newPassword1);
    console.log("This is the new password 2 %s", newPassword2);

    //axios stuff
    const body = {
      email: email,
      oldPassword: oldPassword,
      newPassword1: newPassword1,
      newPassword2: newPassword2,
    };
    

    axios
      .post('http://localhost:5000/changePassword/', body)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          console.log('the modal should popup now');
          setId(res.message);
          setShowModal(true);
        } else {
          console.log('there was an error in changing password');
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log("Error message is %s", error.response.data.message);
          setErrorModal(true);
          setErrorText(error.response.data.message);
        }
      });
  };
  
//clunky, but follow the above and add to the following if statements for the other social medias

  return (
    <div className={styles.box}>
      <Row xs={1} md={2} className='justify-content-center'>
      <div>
      <div className={styles.background}>
        <div className={styles.cp_background}>
          <h1>Change Password</h1>
            <Modal show={showModal}>
              <Modal.Header>
                <Modal.Title>Success!</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Password changed successfully!
                <form onSubmit={handleClose}>
                  <div className='form-group'>
                  </div>
                  <br></br>
                  <div className='form-group'>
                    <input
                      type='submit'
                      value='OK'
                      className='btn btn-primary'
                    />
                  </div>
                </form>
              </Modal.Body>
            </Modal>
            <Modal show={showErrorModal} onHide={handleCloseError}>
              <Modal.Header closeButton>
                <Modal.Title>Error</Modal.Title>
              </Modal.Header>
              <Modal.Body>{errorText}</Modal.Body>
            </Modal>
          <form onSubmit={handleSubmit}>
            <div className='form-group' id='email'>
              <label>Email: </label> 
              <input 
                type='text'
                className='form-control'
                placeholder='Email'
                onChange={(e) => setEmail(e.target.value)}
                
              />
            </div>
            <div className='form-group' id='oldPass'>
              <label>Old Password: </label> 
              <input 
                type='password'
                className='form-control'
                placeholder='Old Password'
                onChange={(e) => setPassword(e.target.value)}
                
              />
            </div>
            <div className='form-group' id='newPass'>
              <label>New Password: </label>
              <input
                type='password'
                className='form-control'
                placeholder='New Password'
                onChange={(e) => setPassword1(e.target.value)}
               
              />
            </div>
            <div className='form-group' id='newPass2'>
              <label>Verify New Password: </label>
              <input
                type='password'
                className='form-control'
                placeholder='Retype New Password'
                onChange={(e) => setPassword2(e.target.value)}
      
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
