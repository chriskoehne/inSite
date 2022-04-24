import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { SocialIcon } from 'react-social-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsFillTrashFill } from 'react-icons/bs';
import styles from './Notifications.module.css';

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
            00/00/0000
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
  const sms = ['reddit', 'twitter', 'youtube', 'twitch'];
  //setArray(oldArray => [...oldArray,newValue] );

  const handleDelete = (id) => {
    const tempRows = rows.filter((row) => row.id !== id);
    setRows(tempRows);
  };

  const clearNotifications = () => {
    setRows([]);
  };

  useEffect(() => {
    let tempRows = [];
    for (let i = 0; i < 10; i++) {
      tempRows.push({
        id: i,
        sm: sms[Math.floor(Math.random() * sms.length)],
        // content: 'oh baby',
        content: 'sussus amogus sussus amogus sussus amogus sussus amogus sussus amogus sussus amogus sussus amogus sussus amogus sussus amogus sussus amogus sussus amogus sussus amogus sussus amogus sussus amogus sussus amogus sussus amogus'
        // content:
        //   'The FitnessGram™ Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly, but gets faster each minute after you hear this signal. [beep] A single lap should be completed each time you hear this sound. [ding] Remember to run in a straight line, and run as long as possible. The second time you fail to complete a lap before the sound, your test is over. The test will begin on the word start. On your mark, get ready, start.',
      });
    }
    setRows(tempRows);
  }, []);

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
            content={row.content}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default Notifications;
