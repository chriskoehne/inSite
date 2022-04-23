import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Switch from 'react-switch';
import axios from 'axios';
import styles from './Settings.module.css';
import useDidMountEffect from '../../hooks/useDidMountEffect';
import ReactTooltip from 'react-tooltip';
import Order from './Order';
import hasToolTips from '../../helpers/hasToolTips';

const Customization = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.hasOwnProperty('settings') &&
      JSON.parse(localStorage.getItem('settings')).darkMode === true
  );

  const [toolTips, setToolTips] = useState(
    localStorage.hasOwnProperty('settings') &&
      JSON.parse(localStorage.getItem('settings')).toolTips === true
  );

  useDidMountEffect(() => {
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

  useDidMountEffect(() => {
    const updateToolTips = async () => {
      try {
        const body = {
          email: localStorage.getItem('email'),
          toolTips: toolTips,
        };
        const res = await axios.post('/user/settings/toolTips', body);
        if (res.status === 200) {
          console.log(res);
        } else {
          console.log('Could not update toolTips!');
        }
      } catch (err) {
        console.log(err);
      }
    };
    updateToolTips();
  }, [toolTips]);

  const toggleDarkMode = (checked) => {
    let settings = JSON.parse(localStorage.getItem('settings'));
    settings.darkMode = checked;
    if (checked) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('settings', JSON.stringify(settings));
    setDarkMode(checked);
  };

  const toggleToolTips = (checked) => {
    let settings = JSON.parse(localStorage.getItem('settings'));
    settings.toolTips = checked;
    localStorage.setItem('settings', JSON.stringify(settings));
    setToolTips(checked);
  };

  return (
    <div id='customization' className={styles.customization}>
      <ReactTooltip />
      <h4>Customization</h4>
      <br />
      <h5
        style={{ marginBottom: '0' }}
        data-tip={hasToolTips() ? 'Globally toggle dark/light mode' : ''}
      >
        Dark Mode
      </h5>
      <br />
      <label>
        <Switch
          onChange={toggleDarkMode}
          offColor={'#dedede'}
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
      <h5
        style={{ marginBottom: '0' }}
        data-tip={hasToolTips() ? 'Globally toggle tool tips' : ''}
      >
        Tool Tips
      </h5>
      <br />
      <label>
        <Switch
          onChange={toggleToolTips}
          offColor={'#dedede'}
          onColor={'#f9c449'}
          checked={toolTips}
        />
      </label>
      <br />
      <br />
      <h5
        data-tip={
          hasToolTips()
            ? 'Change the order of cards on dashboard i.e. first card in this list corresponds with the top-left card'
            : ''
        }
      >
        {' '}
        Dashboard Cards Order{' '}
      </h5>
      <Order />
      <br />
      {/* <h5>Reddit Default shit</h5>
      setting
      <br />
      setting 2
      <br />
      setting
      <br /> */}
    </div>
  );
};

export default Customization;
