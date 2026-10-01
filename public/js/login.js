/* eslint-disable */
import axios from 'axios';
import { showAlert, errorMessage } from './alert.js';

// Only follow same-site relative paths from ?next= (prevents open redirects).
const nextUrl = () => {
  const next = new URLSearchParams(location.search).get('next');
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/';
};

export const login = async (email, password) => {
  try {
    await axios.post('/api/v1/users/login', { email, password });
    showAlert('success', 'Logged in successfully!');
    window.setTimeout(() => location.assign(nextUrl()), 1000);
  } catch (err) {
    showAlert('error', errorMessage(err));
  }
};

export const signup = async data => {
  try {
    await axios.post('/api/v1/users/signup', data);
    showAlert('success', 'Account created! Welcome to Natours.');
    window.setTimeout(() => location.assign('/?alert=welcome'), 1000);
  } catch (err) {
    showAlert('error', errorMessage(err));
  }
};

export const logout = async () => {
  try {
    await axios.get('/api/v1/users/logout');
    location.assign('/');
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};
