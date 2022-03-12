import React, { useState } from 'react';
import { Container, Button, Nav, Navbar, Dropdown, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './NavRoute.module.css';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { logout } from '../../auth/auth';

const OurNavbar = (props) => {
  document.body.classList.remove('dark');
  const email = localStorage.getItem('email');

  const [modal, setModal] = useState(false);


  const handleCloseError = () => setModal(false); // Handles Error Modal Close

  const handleClose = (e) => {
    e.preventDefault();
    // make call to my backend functions
    const body = {
      email: email,
    };
    axios.post('http://localhost:5000/userDelete/', body).then((res) => {
      if (res.status == 200) {
        setModal(false);
        props.props.navigate('/logout');
      } else {
        console.log('I am a failure');
      }
    });
  };

  const changePassword = () => {
    //additional things
    props.props.navigate('/changePassword');
  };

  const navLogout = () => {
    logout(props.props);
  };

  const deleteAccount = () => {
    //additional things
    //call to backend
    setModal(true);
    // props.props.navigate('/welcome')
  };

  return (
    <Navbar className={styles.navbar}>
      {/* <Modal show={modal} onHide={handleCloseError}>
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
      </Modal> */}
      <Container>
        <Navbar.Brand href='/dashboard'>
          <div className={styles.inlineDiv}>
            <h2 className={styles.in}>in</h2>
            <h2 className={styles.site}>Site</h2>
          </div>
        </Navbar.Brand>
        <Nav.Link style={{color: 'var(--secondary)'}} href="/settings">settings</Nav.Link>
        {/* <Navbar.Toggle />
        <Navbar.Collapse className='justify-content-end'>
          <Dropdown>
            <Dropdown.Toggle
              variant='secondary'
              id='dropdown-button-transparent'
            >
              Settings
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={changePassword}>
                Change Password
              </Dropdown.Item>
              <Dropdown.Item onClick={navLogout}>Sign Out</Dropdown.Item>
              <Dropdown.Item onClick={deleteAccount}>
                Delete Account
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse> */}
      </Container>
    </Navbar>
  );
};

const NavRoute = (props) => {
  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page

  return (
    <div className={styles.box}>
      <OurNavbar props={props} />
      <Outlet />
    </div>
  );
};

export default NavRoute;
