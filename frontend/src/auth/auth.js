/**
 * @fileoverview This file gives some reuseable functions for checking whether a user is correctly logged in or logging them out
 * An unauthenticated user will also be sent back to the welcome page.
 * @author Chris Koehne <cdkoehne@gmail.com>
 */

import axios from 'axios';

export async function authenticate(props) {
  try {
    await axios.post('http://localhost:5000/cookieCheck/');
    return 'authenticated';
  } catch (err) {
    props.navigate('/welcome');
  }
}

export async function unauthedOnly(props) {
  try {
    await axios.post('http://localhost:5000/cookieCheck/');
  } catch (err) {
    return;
  }
  props.navigate('/dashboard');
}

export async function logout(props) {
  try {
    let result = await axios.post('http://localhost:5000/logout/');
    localStorage.clear();
    console.log(result);
  } catch (err) {
    props.navigate('/welcome');
  }
}
