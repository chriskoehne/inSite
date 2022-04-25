import React, { useEffect, useState } from "react";
import { SocialIcon } from "react-social-icons";
import Switch from "react-switch";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
// import useDidMountEffect from "../../hooks/useDidMountEffect";

import styles from "./Settings.module.css";

const EmailNotifs = () => {
  const [optIn, setOptIn] = useState(false);

  useEffect(async () => {
    const result = await axios.get("/user/emailStatus/", {
      params: { email: localStorage.getItem("email") },
    });
    console.log("result of getting user info");
    console.log(result);
    setOptIn(result.data.info.status);

  }, []);

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
    await axios.post("/user/toggleEmail", body);
  };

  return (
    <div>
      <div id="emailNotifs" className={styles.permissions}>
        <h4>Email Notifications</h4>
        <h5>Opt in to email notifications</h5>
        <h6>Toggle notifications</h6>
        <div style={{ width: "300px" }}>
          <label style={{ paddingTop: "6px" }}>
            <Switch
              onChange={() => toggle()}
              offColor={"#bebebe"}
              onColor={"#ff4500"}
              checked={optIn}
              /*TODO: Fix spacing */
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default EmailNotifs;
