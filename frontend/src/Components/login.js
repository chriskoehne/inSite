import React, { Component } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import styles from './login.module.css';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onChangeSMSCode = this.onChangeSMSCode.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      email: "",
      password: "",
      showModal: false,
      smsCode: ""
    };
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  onChangeSMSCode(e) {
      this.setState({
          smsCode: e.target.value,
      });
  }

  handleClose(e) {
    e.preventDefault();
    console.log("verifying sms code");
    console.log(this.state)
    console.log(this.state.smsCode)
    const body = {
      email: this.state.email,
      code: this.state.smsCode
    };
    axios.post("http://localhost:5000/verifyUser/", body).then((res) => {
    if (res.status == 200) {
      console.log("status was 200")
      // this.props.history.push('/home');
      
    } else {
        console.log("incorrect code")
    }
  });
  }

  onSubmit(e) {
    e.preventDefault();

    //axios stuff
    const body = {
      email: this.state.email,
      password: this.state.password,
    };

    axios.post("http://localhost:5000/login/", body).then((res) => {
      console.log(res)
      if (res.status == 200) {
        console.log("the modal should popup now");

        this.setState({
          showModal: true
        });
        
      } else {
          console.log("there was an error in user creation")
      }
    });
  }

  render() {
    return (
      <div>
        <div className={styles.background}>
          <div className={styles.login_background}>
            <h1>inSite</h1>
            <Modal show={this.state.showModal}>
            <Modal.Header>
              <Modal.Title>Verify phone number</Modal.Title>
            </Modal.Header>
            <Modal.Body>Your phone number provided was used to create a two factor user. Please enter the code sent to your phone to verify this connection.
            <form onSubmit={this.handleClose}>
              <div className="form-group">
                <label>Code: </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Code"
                  onChange={this.onChangeSMSCode}
                />
              </div>
              <br></br>
              <div className="form-group">
                <input type="submit" value="Submit Code" className="btn btn-primary" />
              </div>
            </form>
            </Modal.Body>
            {/* <Modal.Footer>
              <Button variant="primary" onClick={this.handleClose}>
                Submit
              </Button>
            </Modal.Footer> */}
          </Modal>
          <div>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label>Email: </label>
                <input
                  type="text"
                  className="form-control"
                  onChange={this.onChangeEmail}
                />
              </div>
              <div className="form-group">
                <label>Password: </label>
                <input
                  type="password"
                  className="form-control"
                  onChange={this.onChangePassword}
                />
              </div>
              <br />
              <div className="form-group">
                <input type="submit" value="LOGIN" className="btn btn-primary" />
              </div>
            </form>
            </div>
            <a href="/createAccount">Create Account</a>
          </div>
        </div>
      </div>
    );
  }
}
