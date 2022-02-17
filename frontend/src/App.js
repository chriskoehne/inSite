import React, { useState } from 'react';
// import logo from './logo.svg';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Login from './components/login';
import Home from './components/home';
import CreateAccount from './components/createAccount';
import Dashboard from './components/Dashboard/Dashboard';
import Welcome from './components/Welcome/Welcome';
import './App.css';


const App = () => {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route path='/' element={<Navigate replace to='/welcome' />} />
      <Route exact path='/welcome' element={<Welcome navigate={navigate} />} />
      <Route path='/login' element={<Login navigate={navigate} />} />
      <Route path='/home' element={<Home navigate={navigate} />} />
      <Route
        path='/createAccount'
        element={<CreateAccount navigate={navigate} />}
      />
      <Route path='/dashboard/*' element={<Dashboard navigate={navigate}/>} />
      {/* <Route path='/dashboard?state=:state&code=:code' element={<Dashboard navigate={navigate} state={state} code={code}/>} /> */}
      <Route path='*' element={<Navigate replace to='/welcome' />} />
      
    </Routes>
  );
};

export default App;
