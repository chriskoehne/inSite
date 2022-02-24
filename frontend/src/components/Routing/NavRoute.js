import React, {useState} from 'react';
import { Container, Navbar, Dropdown, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './NavRoute.module.css';
import { Navigate, Outlet } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';

const OurNavbar = (props) => {
  const email = props.props.email;
  const [modal, setModal] = useState(false);
  console.log("navbar props are:")
  console.log(props.props)
  //what the fuck is going on here?
  
  const handleCloseError = () => setModal(false); // Handles Error Modal Close

  const handleClose = (e) => {
    e.preventDefault();
    // make call to my backend functions
    // axios.post('http://localhost:5000/verifyUser/', body).then((res) => {
      
    // });
    setModal(false)
  };

  const changePassword = () => {
    //additional things
    props.props.navigate('/changePassword', { state: { email: email } })
  }

  const logout = () => {
    //additional things
    props.props.navigate('/logout')
  }

  const deleteAccount = () => {
    //additional things
    //call to backend
    setModal(true)
    // props.props.navigate('/welcome')
  }

  return (
    <Navbar className={styles.navbar}>
      <Modal show={modal}>
            <Modal.Header>
              <Modal.Title>Confirm Account Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleClose}>
                <div className='form-group'>
                  <input
                    type='submit'
                    value='Confirm'
                    className='btn btn-primary'
                  />
                </div>
              </form>
            </Modal.Body>
          </Modal>
      <Container>
        <Navbar.Brand href='/dashboard'>
          <div className={styles.inlineDiv}>
            <h2 className={styles.in}>in</h2>
            <h2 className={styles.site}>Site</h2>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className='justify-content-end'>
          <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-button-transparent">
                Settings
              </Dropdown.Toggle>

              <Dropdown.Menu>

                <Dropdown.Item onClick={changePassword}>Change password</Dropdown.Item>
                <Dropdown.Item onClick={logout}>Sign Out</Dropdown.Item>
                <Dropdown.Item onClick={deleteAccount}>Delete Account</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};



const NavRoute = (props) => {
  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page

  return (
    <div className={styles.box}>
      <OurNavbar props={props}/>
      <Outlet />
    </div>
  );
};

export default NavRoute;
