import React, { Component } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import Popup from 'reactjs-popup';
import axios from "axios";
import { Modal } from 'react-bootstrap';

export default class CreateAccount extends Component {
  constructor(props) {
    super(props);

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangePhone = this.onChangePhone.bind(this);
    this.onChangeSMSCode = this.onChangeSMSCode.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      email: "",
      password: "",
      phone: "",
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

  onChangePhone(e) {
      this.setState({
          phone: e.target.value,
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
    const body = {
      email: this.state.email,
      code: this.state.smsCode
    };
    axios.post("http://localhost:5000/verifyUser/", body).then((res) => {
    if (res.status == 200) {
      this.props.history.push('/home');
      
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
      phone: this.state.phone,
    };

    axios.post("http://localhost:5000/userCreation/", body).then((res) => {
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
        <h1>Create Account</h1>
        <Modal show={this.state.showModal}>
        <Modal.Header>
          <Modal.Title>Verify phone number</Modal.Title>
        </Modal.Header>
        <Modal.Body>The phone number provided was used to create a two factor user. Please enter the code sent to your phone to verify this connection.
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
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Email: </label>
            <input
              type="text"
              className="form-control"
              placeholder="email"
              onChange={this.onChangeEmail}
            />
          </div>
          <div className="form-group">
            <label>Password: </label>
            <input
              type="text"
              className="form-control"
              placeholder="password"
              onChange={this.onChangePassword}
            />
          </div>
          <div className="form-group">
            <label>Phone: </label>
            <input
              type="text"
              className="form-control"
              placeholder="phone"
              onChange={this.onChangePhone}
            />
          </div>
          <br></br>
          <div className="form-group">
            <input type="submit" value="Create Account" className="btn btn-primary" />
          </div>
        </form>
      </div>
    );
  }
}
