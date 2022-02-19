import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Login from './components/login';
import Home from './components/home';
import CreateAccount from './components/createAccount';
import Dashboard from './components/Dashboard/Dashboard';
import Welcome from './components/Welcome/Welcome';
import CookieCheck from './components/testing/CookieCheck';
import RedditPage from './components/Reddit/RedditPage';
import InstagramPage from './components/Instagram/InstagramPage';
import TwitterPage from './components/Twitter/TwitterPage';
import YoutubePage from './components/Youtube/YoutubePage';
import './App.css';
import Logout from './components/testing/Logout';

const App = () => {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route path='/' element={<Navigate replace to='/welcome' />} />
      <Route exact path='/welcome' element={<Welcome navigate={navigate} />} />
      <Route path='/login' element={<Login navigate={navigate} />} />
      <Route path='/cookieCheck' element={<CookieCheck navigate={navigate} />}/>
      <Route path='/logout' element={<Logout navigate={navigate} />}/>
      <Route path='/home' element={<Home navigate={navigate} />} />
      <Route
        path='/createAccount'
        element={<CreateAccount navigate={navigate} />}
      />
      <Route path='/dashboard/*' element={<Dashboard navigate={navigate}/>} />
      <Route path='/reddit' element={<RedditPage navigate={navigate}/>}/>
      <Route path='/twitter' element={<TwitterPage navigate={navigate}/>}/>
      <Route path='/youtube' element={<YoutubePage navigate={navigate}/>}/>
      <Route path='/instagram' element={<InstagramPage navigate={navigate}/>}/>
      <Route path='*' element={<Navigate replace to='/welcome' />} />
    </Routes>
  );
};

export default App;
