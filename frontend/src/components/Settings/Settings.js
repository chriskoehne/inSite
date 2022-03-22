import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Container, Row, Modal, Nav } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import Switch from 'react-switch';
import axios from 'axios';
import styles from './Settings.module.css';
import { logout } from '../../auth/auth';

const SettingsDrawer = (props) => {
  return (
    <div className={styles.sidebar}>
      <h3 style={{ color: 'var(--link-highlight)' }}>Settings</h3>
      <Nav.Item>
        <Nav.Link
          className={styles.settingsLinks}
          href='/settings#customization'
        >
          Customization
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          className={styles.settingsLinks}
          href='/settings#changePassword'
        >
          Change Password
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className={styles.settingsLinks} href='/settings#deauthorize'>
          Deauthorize Social Media
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className={styles.settingsLinks} href='/settings#logout'>
          Logout
        </Nav.Link>
      </Nav.Item>
      <br />
      <br />
      <br />
      <Nav.Item>
        <Nav.Link
          className={styles.settingsLinks}
          href='/settings#deleteAccount'
        >
          Delete Account
        </Nav.Link>
      </Nav.Item>
    </div>
  );
};

const Customization = () => {
  const [darkmode, setDarkmode] = useState(
    localStorage.hasOwnProperty('darkmode') &&
      localStorage.getItem('darkmode') === 'true'
  );

  useEffect(() => {
    const updateDarkmode = async () => {
      try {
        const body = {
          email: localStorage.getItem('email'),
          darkmode: darkmode,
        };
        const res = await axios.post('/user/settings/darkmode', body);
        if (res.status === 200) {
          // console.log(res)
        } else {
          console.log('Could not update darkmode!');
        }
      } catch (err) {
        console.log(err);
      }
    };
    updateDarkmode();
  }, [darkmode]);

  const toggle = (checked) => {
    setDarkmode(checked);
    if (checked) {
      localStorage.setItem('darkmode', true);

      document.body.classList.add('dark');
    } else {
      localStorage.setItem('darkmode', false);
      document.body.classList.remove('dark');
    }
  };

  return (
    <div id='customization' className={styles.customization}>
      <h4>Customization</h4>
      <span>
        Dark Mode
        <br />
        <label>
          <Switch
            onChange={toggle}
            offColor={'#DEDEDE'}
            onColor={'#2c2c2c'}
            checked={darkmode}
            /*TODO: Fix spacing */
            checkedIcon={
              <svg viewBox='-8 -20 30 30'>
                <text>🌙</text>
              </svg>
            }
            uncheckedIcon={
              <svg viewBox='-8 -20 30 30'>
                <text>🔆</text>
              </svg>
            }
          />
        </label>
      </span>
      <br />
      <br />
      <h5>Reddit Default shit</h5>
      setting
      <br />
      setting
      <br />
      setting
      <br />
    </div>
  );
};

const Deauthorize = () => {
  return (
    <div id='deauthorize' className={styles.deauthorize}>
      <h4>Deauthorize Social Media</h4>
      <h5>piss</h5>
      <h5>piss</h5>
      <h5>piss</h5>
      <h5>piss</h5>
      <h5>piss</h5>
      <h5>piss</h5>
    </div>
  );
};

const Logout = () => {
  return (
    <div id='logout' className={styles.logout}>
      <h4>Logout</h4>
      <div className='form-group'>
        <form onSubmit={logout}>
          <input type='submit' value='Log Out' className='btn btn-secondary' />
        </form>
      </div>
    </div>
  );
};

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
      <Modal show={modal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
      </Modal>
      <h4>Change Password</h4>
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

const Settings = (props) => {
  return (
    <Container fluid>
      <Row>
        <Col
          as={SettingsDrawer}
          xs={12}
          md={3}
          lg={2}
          className={styles.sidebar}
        />
        <Col className={styles.content}>
          <Customization />
          <hr />
          <ChangePassword />
          <hr />
          <Deauthorize />
          <hr />
          <Logout />
          <hr />
          <DeleteAccount />
          <hr />
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
