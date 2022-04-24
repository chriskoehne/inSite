import React, { useState } from 'react';
import { SocialIcon } from 'react-social-icons';
import Switch from 'react-switch';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import useDidMountEffect from '../../hooks/useDidMountEffect';

import styles from './Settings.module.css';

const capitalized = {
  reddit: 'Reddit',
  twitter: 'Twitter',
  twitch: 'Twitch',
  youtube: 'YouTube',
};

const Permissions = () => {
  const [permissions, setPermssions] = useState(
    JSON.parse(localStorage.getItem('settings')).permissions
  );
  const [showAuthorizeModal, setShowAuthorizeModal] = useState(false);
  const [showDeauthorizeModal, setShowDeauthorizeModal] = useState(false);
  const [current, setCurrent] = useState('');

  const toggle = (sm) => {
    setCurrent(sm);
  };

  useDidMountEffect(() => {
    if (current === '') {
      return;
    }
    if (permissions[current]) {
      setShowDeauthorizeModal(true);
    } else {
      setShowAuthorizeModal(true);
    }
  }, [current]);

  useDidMountEffect(() => {
    const updatePermissions = async () => {
      try {
        const body = {
          email: localStorage.getItem('email'),
          permissions: permissions,
        };
        const res = await axios.post('/user/settings/permissions', body);
        if (res.status === 200) {
          // console.log(res)
        } else {
          console.log('Could not update permissions!');
        }
      } catch (err) {
        console.log(err);
      }
    };
    updatePermissions();
  }, [permissions]);

  const authorizeSM = async () => {
    setPermssions({ ...permissions, [current]: true });
    let settings = JSON.parse(localStorage.getItem('settings'));
    settings.permissions[current] = true;
    localStorage.setItem('settings', JSON.stringify(settings));
    setCurrent('');
    setShowAuthorizeModal(false);
  };

  const deauthorizeSM = async () => {
    setPermssions({ ...permissions, [current]: false });
    let settings = JSON.parse(localStorage.getItem('settings'));
    settings.permissions[current] = false;
    localStorage.setItem('settings', JSON.stringify(settings));
    setCurrent('');
    setShowDeauthorizeModal(false);
  };

  return (
    <div>
      <Modal
        show={showAuthorizeModal}
        onHide={() => setShowAuthorizeModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Store {capitalized[current]} data</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{color: 'black'}}>
          {' '}
          Are you sure you want to give inSite permission to store{' '}
          {capitalized[current]} data? Data will be stored the next time you
          authorize {capitalized[current]}.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => setShowAuthorizeModal(false)}
          >
            Not Now
          </Button>
          <Button variant='primary' onClick={() => authorizeSM()}>
            I'm Sure
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showDeauthorizeModal}
        onHide={() => setShowDeauthorizeModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Remove {capitalized[current]} data</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{color: 'black'}}>
          {' '}
          Are you sure you want to stop inSite from storing{' '}
          {capitalized[current]} data? This will delete all currently stored
          data.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => setShowDeauthorizeModal(false)}
          >
            Not Now
          </Button>
          <Button variant='primary' onClick={() => deauthorizeSM()}>
            I'm Sure
          </Button>
        </Modal.Footer>
      </Modal>
      <div id='permissions' className={styles.permissions}>
        <h4>Permissions</h4>
        <h5>Allow inSite to store date from social medias?</h5>
        <h6>
          (Please see the FAQ page for more information about what inSite uses
          this data for){' '}
        </h6>
        <div style={{ width: '300px' }}>
          <div className={styles.permissionsItem}>
            <SocialIcon
              fgColor='white'
              network='reddit'
              style={{ height: '40px', width: '40px', marginRight: '24px' }}
              onClick={(e) => {
                e.preventDefault();
              }}
            />
            <label style={{ paddingTop: '6px' }}>
              <Switch
                onChange={() => toggle('reddit')}
                offColor={'#bebebe'}
                onColor={'#ff4500'}
                checked={permissions.reddit}
                /*TODO: Fix spacing */
              />
            </label>
          </div>
        </div>
        <div style={{ width: '300px' }}>
          <div className={styles.permissionsItem}>
            <SocialIcon
              fgColor='white'
              network='twitter'
              style={{ height: '40px', width: '40px', marginRight: '24px' }}
              onClick={(e) => {
                e.preventDefault();
              }}
            />
            <label style={{ paddingTop: '6px' }}>
              <Switch
                onChange={() => toggle('twitter')}
                offColor={'#bebebe'}
                onColor={'#05aced'}
                checked={permissions.twitter}
                /*TODO: Fix spacing */
              />
            </label>
          </div>
        </div>
        <div style={{ width: '300px' }}>
          <div className={styles.permissionsItem}>
            <SocialIcon
              fgColor='white'
              network='twitch'
              style={{ height: '40px', width: '40px', marginRight: '24px' }}
              onClick={(e) => {
                e.preventDefault();
              }}
            />
            <label style={{ paddingTop: '6px' }}>
              <Switch
                onChange={() => toggle('twitch')}
                offColor={'#bebebe'}
                onColor={'#e94475'}
                checked={permissions.twitch}
                /*TODO: Fix spacing */
              />
            </label>
          </div>
        </div>
        <div style={{ width: '300px' }}>
          <div className={styles.permissionsItem}>
            <SocialIcon
              fgColor='white'
              network='youtube'
              style={{ height: '40px', width: '40px', marginRight: '24px' }}
              onClick={(e) => {
                e.preventDefault();
              }}
            />
            <label style={{ paddingTop: '6px' }}>
              <Switch
                onChange={() => toggle('youtube')}
                offColor={'#bebebe'}
                onColor={'#ff0000'}
                checked={permissions.youtube}
                /*TODO: Fix spacing */
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permissions;
