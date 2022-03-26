import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import Switch from 'react-switch';
import axios from 'axios';
import styles from './Settings.module.css';

import Order from './Order';

const Customization = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.hasOwnProperty('settings') &&
      JSON.parse(localStorage.getItem('settings')).darkMode === true
  );

  useEffect(() => {
    const updateDarkMode = async () => {
      try {
        const body = {
          email: localStorage.getItem('email'),
          darkMode: darkMode,
        };
        const res = await axios.post('/user/settings/darkMode', body);
        if (res.status === 200) {
          // console.log(res)
        } else {
          console.log('Could not update darkMode!');
        }
      } catch (err) {
        console.log(err);
      }
    };
    updateDarkMode();
  }, [darkMode]);

  const toggle = (checked) => {
    setDarkMode(checked);
    if (checked) {
      localStorage.setItem('darkMode', true);

      document.body.classList.add('dark');
    } else {
      localStorage.setItem('darkMode', false);
      document.body.classList.remove('dark');
    }
  };

  return (
    <div id='customization' className={styles.customization}>
      <h4>Customization</h4>
      <br />
      <h5 style={{ marginBottom: '0' }}>Dark Mode</h5>
      <br />
      <label>
        <Switch
          onChange={toggle}
          offColor={'#DEDEDE'}
          onColor={'#2c2c2c'}
          checked={darkMode}
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
      <br />
      <br />
      <h5> Dashboard Cards Order </h5>
      <Order />
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

export default Customization;
