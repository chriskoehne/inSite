import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Login from './components/login';
import Home from './components/home';
import CreateAccount from './components/createAccount';

const App = () => {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route path='/' element={<Login navigate={navigate} />} />
      <Route path='/home' element={<Home navigate={navigate} />} />
      <Route
        path='/createAccount'
        element={<CreateAccount navigate={navigate} />}
      />
    </Routes>
  );
};

export default App;
