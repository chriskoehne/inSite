import React from "react";
import logo from './logo.svg';
import './App.css';
import { Route } from "react-router-dom";
import { useHistory } from "react-router-dom";

import Login from './components/login';
import Home from './components/home';
import CreateAccount from './components/createAccount';

const App = () => {
  const history = useHistory();
  return (
    <div>
       <Route exact path="/">
         <Login 
         history = {history}/>
        </Route>
        <Route exact path="/home">
         <Home 
         history = {history}/>
        </Route>
        <Route exact path="/createAccount">
         <CreateAccount 
         history = {history}/>
        </Route>
     </div>
  );
};

export default App;
