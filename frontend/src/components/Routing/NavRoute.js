import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './NavRoute.module.css';
import { Outlet } from 'react-router-dom';
import { BsBellFill } from 'react-icons/bs';
import ReactTooltip from 'react-tooltip';
import hasToolTips from '../../helpers/hasToolTips';

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
        <Nav>
          <Nav.Link
            style={{ color: 'white', marginRight: '2vw'}}
            href='/notifications'
            data-tip={hasToolTips() ? 'View your notifications' : ''}
          >
            <BsBellFill />
          </Nav.Link>

          <Nav.Link
            style={{ color: 'white', marginRight: '2vw'}}
            href='/faq'
            data-tip={
              hasToolTips() ? 'Frequently Asked Questions about inSite' : ''
            }
          >
            FAQ
          </Nav.Link>
          <Nav.Link
            style={{ color: 'white', marginRight: '1vw'}}
            href='/settings'
            data-tip={
              hasToolTips()
                ? 'Configure your settings, such as dark mode, card order, and social media authorizations'
                : ''
            }
          >
            settings
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

const NavRoute = (props) => {
  /**
   * If authorized, return an outlet that will render child elements
   * If not, return element that will navigate to login page
   */

  return (
    <div className={styles.box}>
      <ReactTooltip />
      <OurNavbar props={props} />
      <Outlet />
    </div>
  );
};

export default NavRoute;
