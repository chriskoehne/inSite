import React, { Component } from "react";
import { Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

export default class CreateAccount extends Component {
    constructor(props) {
        super(props);
    
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    
        this.state = {
          email: "",
          password: "",
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
    
      onSubmit(e) {
        e.preventDefault();
    
        //axios stuff
        const body = {
            "email": this.state.email,
            "password": this.state.password
        }
        
        axios
        .post("http://localhost:5000/userCreation/", body)
        .then((res) => console.log(res.data));
        console.log("created user?")
    
        this.setState({
          name: "",
          password: "",
        });
      }
    
      render() {
        return (
          <div>
            <h1>Create Account</h1>
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
              <br></br>
              <div className="form-group">
                <input type="submit" value="Login" className="btn btn-primary" />
              </div>
            </form>
          </div>
        );
      }
}