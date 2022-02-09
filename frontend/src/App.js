import React from "react";
import logo from './logo.svg';
import './App.css';
import { Route } from "react-router-dom";

import Login from './components/login';
import Home from './components/home';
import CreateAccount from './components/createAccount';

const App = () => {
  return (
    <div>
       <Route exact path="/">
         <Login />
        </Route>
        <Route exact path="/home">
         <Home />
        </Route>
        <Route exact path="/createAccount">
         <CreateAccount />
        </Route>
     </div>
  );
};

export default App;
