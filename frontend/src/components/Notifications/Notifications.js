import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { SocialIcon } from 'react-social-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsFillTrashFill } from 'react-icons/bs';
import styles from './Notifications.module.css';
import moment from 'moment';
import axios from 'axios';

const Notification = (props) => {
  const sm = props.sm;
  let icon;
  let official;

  switch (sm) {
    case 'reddit':
      icon = (
        <SocialIcon
          fgColor='white'
          url='https://www.reddit.com/'
          target='blank'
          rel='noreferrer'
        />
      );
      official = 'Reddit';
      break;
    case 'twitter':
      icon = (
        <SocialIcon
          fgColor='white'
          url='https://www.twitter.com/'
          target='blank'
          rel='noreferrer'
        />
      );
      official = 'Twitter';
      break;
    case 'twitch':
      icon = (
        <SocialIcon
          fgColor='white'
          url='https://www.twitch.tv/'
          target='blank'
          rel='noreferrer'
        />
      );
      official = 'Twitch';
      break;
    case 'youtube':
      icon = (
        <SocialIcon
          fgColor='white'
          url='https://www.youtube.com/'
          target='blank'
          rel='noreferrer'
        />
      );
      official = 'YouTube';
      break;
    default:
      console.log('default case');
  }

  return (
    <Card
      style={{ borderColor: `var(--${sm})` }}
      className={styles.notificationCard}
    >
      <Card.Body>
        <div className={styles.row}>
          <div className={`${styles.colcenter} ${styles.left}`}>{icon}</div>
          <div className={`${styles.colcenter} ${styles.middle}`}>
            <Card.Title>{official}</Card.Title>
            <div style={{ color: 'gray' }}>
              {props.time}
              <div />
              <i>{props.sent}</i>
            </div>
            <Card.Text>{props.content}</Card.Text>
          </div>
          <div className={`${styles.colcenter} ${styles.right}`}>
            <h3>
              <BsFillTrashFill
                className={styles.trashButton}
                onClick={() => {
                  props.handleDelete(props.id);
                }}
              />
            </h3>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const Notifications = (props) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const sms = ['reddit', 'twitter', 'youtube', 'twitch'];
  //setArray(oldArray => [...oldArray,newValue] );

  const handleDelete = async (id) => {
    const tempRows = rows.filter((row) => row.id !== id);
    const res = axios.delete('/user/notifications/one', {
      data: { email: localStorage.getItem('email'), notifId: id },
    });
    // const res = await axios.put('/user/notifications/one', {
    //   email: localStorage.getItem('email'),
    //   notifId: id,
    // });
    console.log(res);
    setRows(tempRows);
  };

  const clearNotifications = async () => {
    const res = axios.delete('/user/notifications/all', {
      data: { email: localStorage.getItem('email') },
    });
    setRows([]);
  };

  useEffect(() => {
    const doTheThing = async () => {
      const params = {
        email: localStorage.getItem('email'),
      };
      const result = await axios.get('/user/notifications', {
        params: params,
      });
      if (result.status === 200) {
        const notifications = result.data.reverse();
        console.log(notifications);
        let tempRows = [];

        for (const notification of notifications) {
          tempRows.push({
            id: notification._id,
            sm: notification.sm,
            time: Date.parse(notification.time),
            sent:
              notification.sentEmail || notification.sentSMS === true
                ? 'sent'
                : 'not sent',
            content: notification.content,
          });
        }
        setRows(tempRows);
        setLoading(false);
      }
    };
    doTheThing();
  }, []);

  const display = () => {
    if (loading) {
      return (
        <div className={styles.alignClearButton}>
          <h2>Loading...</h2>
        </div>
      );
    }
    return (
      <div style={{ height: '100%' }}>
        <div className={styles.alignClearButton}>
          <Button onClick={clearNotifications} className={styles.clearButton}>
            Clear Notifications
          </Button>
        </div>
        <div className={styles.centered}>
          {rows.map((row) => (
            <Notification
              id={row.id}
              key={row.id}
              sm={row.sm}
              time={moment(row.time).local().format('MMMM Do, h:mm a')}
              sent={row.sent}
              content={row.content}
              handleDelete={handleDelete}
            />
          ))}
          <h2>You're all caught up!</h2>
        </div>
      </div>
    );
  };

  return <div>{display()}</div>;
};

export default Notifications;
