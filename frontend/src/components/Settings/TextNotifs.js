import React, { useEffect, useState } from "react";
import { SocialIcon } from "react-social-icons";
import Switch from "react-switch";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
// import useDidMountEffect from "../../hooks/useDidMountEffect";

import styles from "./Settings.module.css";

const TextNotifs = () => {
  const [number, setNumber] = useState("");
  const [optIn, setOptIn] = useState(false);

  useEffect(async () => {
    const result = await axios.get("/user/phoneStatus/", {
      params: { email: localStorage.getItem("email") },
    });
    console.log("result of getting user info");
    console.log(result);
    setOptIn(result.data.info.status);
    setNumber(result.data.info.phone);

  }, []);

  const updateNumber = async () => {
    const body = {
        email: localStorage.getItem("email"),
        number: number
    }
    await axios.post("/user/setPhone", body);
  };

  const toggle = async () => {
    var body;
    if (optIn) {
      setOptIn(false);
      body = {
        email: localStorage.getItem("email"),
        status: false,
      };
    } else {
      setOptIn(true);
      body = {
        email: localStorage.getItem("email"),
        status: true,
      };
    }
    //make call
    await axios.post("/user/togglePhone", body);
  };

  return (
    <div>
      <div id="textNotifs" className={styles.permissions}>
        <h4>Text Notifications</h4>
        <h5>Opt in to text message notifications</h5>
        <h6>Toggle notifications or change phone number</h6>
        <div style={{ width: "300px" }}>
          <label style={{ paddingTop: "6px" }}>
            <Switch
              onChange={() => toggle()}
              offColor={"#bebebe"}
              onColor={"#f9c449"}
              checked={optIn}
              /*TODO: Fix spacing */
            />
          </label>
          <label>Phone Number: </label>
          <input
            type="text"
            className="form-control"
            placeholder={number}
            onChange={(e) => {
              setNumber(e.target.value);
            }}
          />
          <Button
            // className={`${styles.buttons} ${styles.redditB}`}
            onClick={updateNumber}
          >
            Update Phone Number
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TextNotifs;
