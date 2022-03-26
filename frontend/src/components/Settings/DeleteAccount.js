import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import React, { useState } from 'react';
import axios from 'axios';
import styles from './Settings.module.css';
import { logout } from '../../auth/auth';

const DeleteAccount = () => {
  const email = localStorage.getItem('email');
  const [modal, setModal] = useState(false);
  const handleCloseError = () => setModal(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setModal(true);
  };
  const handleClose = async (e) => {
    e.preventDefault();
    const body = {
      email: email,
    };
    try {
      const res = await axios.post('/userDelete/', body);
      if (res.status === 200) {
        setModal(false);
        logout();
      } else {
        console.log('I am a failure');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div id='deleteAccount' className={styles.deleteAccount}>
      <Modal show={modal} onHide={handleCloseError}>
        <Modal.Header>
          <Modal.Title>
            Are you sure you want to delete your account?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.centered}>
            <Button className={styles.buttons} onClick={handleClose}>
              Confirm Account Deletion
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <h4>Delete Account</h4>
      <div className='form-group'>
        <form onSubmit={handleSubmit}>
          <input
            type='submit'
            value='Delete Account'
            className='btn btn-secondary'
          />
        </form>
      </div>
    </div>
  );
};

export default DeleteAccount;