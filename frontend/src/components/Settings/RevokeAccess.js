import React, { useEffect, useState } from 'react';
import { SocialIcon } from "react-social-icons";
// import Switch from "react-switch";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
// import useDidMountEffect from "../../hooks/useDidMountEffect";

import styles from "./Settings.module.css";

const capitalized = {
  reddit: "Reddit",
  twitter: "Twitter",
  youtube: "YouTube",
  twitch: "Twitch"
};

const RevokeAccess = () => {
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState('');

  const [showReddit, setShowReddit] = useState(false);
  const [showTwitter, setShowTwitter] = useState(false);
  const [showYoutube, setShowYoutube] = useState(false);
  const [showTwitch, setShowTwitch] = useState(false);


  useEffect(async () => {
    let redditAns = await axios.post("/reddit/check", {
      params: { email: localStorage.getItem("email") },
    });
    if (redditAns.data.success) {
      setShowReddit(true);
    }
    let twitterAns = await axios.post("/twitter/check", {
      params: { email: localStorage.getItem("email") },
    });
    if (twitterAns.data.success) {
      setShowTwitter(true);
    }
    let youtubeAns = await axios.post("/youtube/check", {
      params: { email: localStorage.getItem("email") },
    });
    if (youtubeAns.data.success) {
      setShowYoutube(true);
    }
    let twitchAns = await axios.post("/twitch/check", {
      params: { email: localStorage.getItem("email") },
    });
    if (twitchAns.data.success) {
      setShowTwitch(true);
    }
  }, [showReddit, showTwitter, showYoutube, showTwitch]);

  const revoke = async () => {
    // revoke access for current and delete data?
    try {
        console.log("revoking for")
        console.log(current)
        const body = {
            email: localStorage.getItem('email'),
            social: current,
          };
        //   const res = await axios.get('/user/revoke', body);
          const res = await axios.get('/user/revoke', {
            params: { email: localStorage.getItem('email'), social: current },
          });
          console.log("revoke result is")
          console.log(res)
          console.log("removing token from localstorage")
          localStorage.removeItem( current + 'Token');
          console.log(localStorage)
          setShowModal(false);
          if (current === "youtube") {
              // redirect them to this site:
              // https://myaccount.google.com/permissions
              window.location.href = "https://myaccount.google.com/permissions";
          } else {
            window.location.reload(false);
          }
    } catch(err) {
        console.log("error in revoke access")
    }
  };

  return (
    <div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Revoke {capitalized[current]} Access?</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "black" }}>
          {" "}
          Are you sure you want to revoke inSite's access to{" "}
          {capitalized[current]}? All login credentials and data will be deleted
          for {capitalized[current]}.
          {(current === 'youtube') ? <div>You will need to revoke inSite access for youtube through your google permissions page as well. 
              You will be redirected to the appropriate page.</div> : <div/>}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            Not Now
          </Button>
          <Button variant="primary" onClick={() => revoke()}>
            I'm Sure
          </Button>
        </Modal.Footer>
      </Modal>
      <div id="revokeAccess" className={styles.permissions}>
        <h4>Account Access</h4>
        <h5>Revoke inSite access</h5>
        <h6>Click a social media logo to revoke access</h6>
        <div style={{ width: "300px" }}>
          {showReddit ? (
            <SocialIcon
              fgColor="white"
              network="reddit"
              style={{ height: "40px", width: "40px", marginRight: "24px" }}
              onClick={(e) => {
                e.preventDefault();
                setCurrent('reddit');
                setShowModal(true);
              }}
            />
          ) : (
            <div />
          )}
        </div>
        <div style={{ width: "300px" }}>
          {showTwitter ? (
            <SocialIcon
              fgColor="white"
              network="twitter"
              style={{ height: "40px", width: "40px", marginRight: "24px" }}
              onClick={(e) => {
                e.preventDefault();
                setCurrent('twitter');
                setShowModal(true);
              }}
            />
          ) : (
            <div />
          )}
        </div>
        <div style={{ width: "300px" }}>
          {showYoutube ? (
            <SocialIcon
              fgColor="white"
              network="youtube"
              style={{ height: "40px", width: "40px", marginRight: "24px" }}
              onClick={(e) => {
                e.preventDefault();
                setCurrent('youtube');
                setShowModal(true);
              }}
            />
          ) : (
            <div />
          )}
        </div>
        <div style={{ width: "300px" }}>
          {showTwitch ? (
            <SocialIcon
              fgColor="white"
              network="twitch"
              style={{ height: "40px", width: "40px", marginRight: "24px" }}
              onClick={(e) => {
                e.preventDefault();
                setCurrent('twitch');
                setShowModal(true);
              }}
            />
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
};

export default RevokeAccess;
