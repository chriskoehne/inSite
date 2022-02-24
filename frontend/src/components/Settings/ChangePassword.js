import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Navbar, Row, Button, Modal } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./ChangePassword.module.css";
import { Alert } from "react-alert";
//const c = require('./constants/constants');

//import Dropdown from './Dropdown'

const ChangePassword = (props) => {
  const { state } = useLocation();
  const [oldPassword, setPassword] = useState("");
  const [newPassword1, setPassword1] = useState("");
  const [newPassword2, setPassword2] = useState("");
  const [modal, setModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const email = state.email;
  //const [newPass, setPassword] = useState('');
  //const [newPass2, setPhone] = useState('');
  //const [email, setEmail] = useState('');
  //const [password, setPassword] = useState('');

  const handleClose = () => setModal(false); // Handles Error Modal Close

  const handleSubmit = (e) => {
    e.preventDefault();
    // var dash = require('../Dashboard/Dashboard.js');
    // var email = 'shankrohan@gmail.com';
    //if (state) {
    //setEmail(state.email);
    //}
    console.log("This is the email %s", email);
    console.log("This is the old password %s", oldPassword);
    console.log("This is the new password %s", newPassword1);
    console.log("This is the new password 2 %s", newPassword2);

    //axios stuff
    const body = {
      email: email,
      oldPassword: oldPassword,
      newPassword1: newPassword1,
      newPassword2: newPassword2,
    };

    axios
      .post("http://localhost:5000/changePassword", body)
      .then((res) => {
        console.log("res is");
        console.log(res);
        console.log("password update successful");
        setModalMessage(res.data.message);
        setModal(true);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data.message);
        }
      });
  };

  return (
    <div className={styles.box}>
      <Modal show={modal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
      </Modal>
      <Row xs={1} md={2} className="justify-content-center">
        <div>
          <div className={styles.background}>
            <div className={styles.cp_background}>
              <h1>Change Password</h1>

              <form onSubmit={handleSubmit}>
                <div className="form-group" id="oldPass">
                  <label>Old Password: </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Old Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-group" id="newPass">
                  <label>New Password: </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="New Password"
                    onChange={(e) => setPassword1(e.target.value)}
                  />
                </div>
                <div className="form-group" id="newPass2">
                  <label>Verify New Password: </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Retype New Password"
                    onChange={(e) => setPassword2(e.target.value)}
                  />
                </div>
                <br></br>
                <div className="form-group">
                  <input
                    type="submit"
                    value="Change Password"
                    className="btn btn-secondary"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </Row>
    </div>
  );
};

export default ChangePassword;
