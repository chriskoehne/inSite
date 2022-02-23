import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './NavRoute.module.css';
import { Navigate, Outlet } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';

const OurNavbar = (props) => {
  return (
    <Navbar className={styles.navbar}>
      <Container>
        <Navbar.Brand href='/dashboard'>
          <div className={styles.inlineDiv}>
            <h2 className={styles.in}>in</h2>
            <h2 className={styles.site}>Site</h2>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className='justify-content-end'>
          <Navbar.Text style={{ color: 'white' }}>settings</Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const NavRoute = () => {
  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return (
    <div className={styles.box}>
      <OurNavbar />
      <Outlet />
    </div>
  );
};

export default NavRoute;
