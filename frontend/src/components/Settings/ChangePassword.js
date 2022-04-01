import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'react-bootstrap';
import React, { useState } from 'react';
import axios from 'axios';
import styles from './Settings.module.css';
import ReactTooltip from 'react-tooltip';
import hasToolTips from '../../helpers/hasToolTips';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modal, setModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const email = localStorage.getItem('email');

  const handleClose = () => setModal(false); // Handles Error Modal Close

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(newPassword)) {
      setModalMessage(
        'Passwords must be at least 8 characters and contain at least one letter and one number'
      );
      setModal(true);
      return;
    }
    if (confirmPassword !== newPassword) {
      setModalMessage('Passwords do not match!');
      setModal(true);
      return;
    }

    const body = {
      email: email,
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    try {
      let res = await axios.post('/changePassword', body);
      console.log('res is');
      console.log(res);
      console.log('password update successful');
      setModalMessage(res.data.message);
      setModal(true);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  return (
    <div id='changePassword' className={styles.changePassword}>
      <ReactTooltip />
      <Modal show={modal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
      </Modal>
      <h4 data-tip={hasToolTips() ? 'Change your inSite account password' : ''}>
        Change Password
      </h4>
      <form className={styles.ChangePassword} onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Old Password: </label>
          <input
            type='password'
            className='form-control'
            placeholder='Old Password'
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <br />
        <div className='form-group'>
          <label>New Password: </label>
          <input
            data-tip={
              hasToolTips()
                ? 'Passwords must be at least 8 characters and contain at least one letter and one number'
                : ''
            }
            type='password'
            className='form-control'
            placeholder='New Password'
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <br />
        <div className='form-group'>
          <label>Verify New Password: </label>
          <input
            type='password'
            className='form-control'
            placeholder='Retype New Password'
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <br />
        <br />
        <div className='form-group'>
          <input
            type='submit'
            value='Change Password'
            className='btn btn-secondary'
          />
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
