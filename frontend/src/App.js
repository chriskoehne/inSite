import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import NavRoute from './components/Routing/NavRoute';
import ProtectedRoute from './components/Routing/ProtectedRoute';
import UnprotectedRoute from './components/Routing/UnprotectedRoute';
import Login from './components/Login/login';
import Home from './components/Home/home';
import CreateAccount from './components/CreateAccount/createAccount';
import Dashboard from './components/Dashboard/Dashboard';
import Welcome from './components/Welcome/Welcome';
import ChangePassword from './components/Settings/ChangePassword';
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

      <Route exact path='/welcome' element={<UnprotectedRoute />}>
        <Route index element={<Welcome navigate={navigate}/>} />
      </Route>

      <Route exact path='/login' element={<UnprotectedRoute />}>
        <Route index element={<Login navigate={navigate}/>} />
      </Route>

      <Route exact path='/cookieCheck' element={<ProtectedRoute />}>
        <Route index element={<CookieCheck navigate={navigate}/>} />
      </Route>

      <Route exact path='/logout' element={<ProtectedRoute />}>
        <Route index element={<Logout navigate={navigate}/>} />
      </Route>

      <Route path='/home' element={<Home navigate={navigate} />} />

      <Route exact path='/createAccount' element={<UnprotectedRoute />}>
        <Route index element={<CreateAccount navigate={navigate}/>} />
      </Route>

      <Route exact path='/dashboard/*' element={<ProtectedRoute />}>
        <Route element={<NavRoute navigate={navigate}/>}>
          <Route index element={<Dashboard navigate={navigate} />} />
        </Route>
      </Route>

      <Route exact path='/reddit' element={<ProtectedRoute />}>
        <Route element={<NavRoute navigate={navigate}/>}>
          <Route index element={<RedditPage navigate={navigate} />} />
        </Route>
      </Route>

      <Route exact path='/twitter' element={<ProtectedRoute />}>
        <Route element={<NavRoute navigate={navigate}/>}>
          <Route index element={<TwitterPage navigate={navigate} />} />
        </Route>
      </Route>

      <Route exact path='/youtube' element={<ProtectedRoute />}>
        <Route element={<NavRoute navigate={navigate}/>}>
          <Route index element={<YoutubePage navigate={navigate} />} />
        </Route>
      </Route>

      <Route exact path='/instagram' element={<ProtectedRoute />}>
        <Route element={<NavRoute navigate={navigate}/>}>
          <Route index element={<InstagramPage navigate={navigate} />} />
        </Route>
      </Route>

      <Route path='*' element={<Navigate replace to='/welcome' />} />
      
      <Route exact path='/changePassword' element={<ProtectedRoute />}>
        <Route element={<NavRoute navigate={navigate}/>}>
        <Route index element={<ChangePassword navigate={navigate}/>} />
        </Route>
      </Route>
      
      
    </Routes>
  );
};

export default App;
