import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row, Nav } from 'react-bootstrap';

import styles from './Settings.module.css';
import { logout } from '../../auth/auth';
import Customization from './Customization';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';
import Permissions from './Permissions';

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
        <Nav.Link className={styles.settingsLinks} href='/settings#permissions'>
          Permissions
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

const Logout = (props) => {
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

const Settings = (props) => {
  console.log(props);
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
          <Permissions />
          <hr />
          <Logout />
          <hr />
          <DeleteAccount navigate={props.navigate} />
          <hr />
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
