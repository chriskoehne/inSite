import React, { useState } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import styles from "./login.module.css";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState("");
  const [smsCode, setSMSCode] = useState("");
  const [errorText, setErrorText] = useState(""); // Set Error Text on Login Fail
  const [showErrorModal, setErrorModal] = useState("");
  const [id, setId] = useState("");

  const handleCloseError = () => setErrorModal(false); // Handles Error Modal Close

  const handleClose = (e) => {
    e.preventDefault();
    console.log("verifying sms code");
    console.log(smsCode);
    const body = {
      email: email,
      id: id,
      code: smsCode,
    };
    axios.post("http://localhost:5000/verifyUser/", body).then((res) => {
      try {
        if (res.status === 200) {
          console.log("status was 200");
          console.log("cookie is");
          console.log(res.cookie);
          localStorage.setItem("email", email);
          props.navigate("/dashboard", { state: { email: email } });
        } else {
          console.log("caught something")
          setShowModal(false);
          setErrorText("Incorrect verification code");
          setErrorModal(true);
          console.log("incorrect code");
        }
      } catch (err) {
        console.log("hereasdfasd");
        console.log(err);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //axios stuff
    const body = {
      email: email,
      password: password,
    };

    axios
      .post("http://localhost:5000/login/", body)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          console.log("the modal should popup now");
          setId(res.message);
          setShowModal(true);
        } else {
          console.log("there was an error in user creation");
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data.message);
          setErrorModal(true);
          setErrorText(error.response.data.message);
        }
      });
  };

  return (
    <div>
      <div className={styles.background}>
        <div className={styles.login_background}>
          <div className={styles.inlineDiv}>
            <h1 className={styles.in}>in</h1>
            <h1 className={styles.site}>Site</h1>
          </div>
          <Modal show={showModal}>
            <Modal.Header>
              <Modal.Title>Verify phone number</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Your phone number provided was used to create a two factor user.
              Please enter the code sent to your phone to verify this
              connection.
              <form onSubmit={handleClose}>
                <div className="form-group">
                  <label>Code: </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Code"
                    onChange={(e) => setSMSCode(e.target.value)}
                  />
                </div>
                <br></br>
                <div className="form-group">
                  <input
                    type="submit"
                    value="Submit Code"
                    className="btn btn-primary"
                  />
                </div>
              </form>
            </Modal.Body>
          </Modal>
          <Modal show={showErrorModal} onHide={handleCloseError}>
            <Modal.Header closeButton>
              <Modal.Title>Login Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>{errorText}</Modal.Body>
          </Modal>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email: </label>
              <input
                type="text"
                className="form-control"
                placeholder="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="form-group">
              <label>Password: </label>
              <input
                type="password"
                className="form-control"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <br></br>
            <div className="form-group">
              <input type="submit" value="Login" className="btn btn-primary" />
            </div>
          </form>
          <a href="/createAccount" className={styles.createAcc}>
            New user?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
