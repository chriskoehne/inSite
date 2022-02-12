import React from "react";
import logo from './logo.svg';
import './App.css';
import { useNavigate, Route, Routes } from 'react-router-dom';

import Login from './Components/login';
import Home from './Components/home';
import CreateAccount from './Components/createAccount';

const App = () => {
  const navigate = useNavigate();
  return (

      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/home' element={<Home/>} />
        <Route path='/createAccount' element={<CreateAccount/>} />
      </Routes>
  );
};
export default App;