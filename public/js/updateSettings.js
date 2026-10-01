/* eslint-disable */
import axios from 'axios';
import { showAlert, errorMessage } from './alert.js';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  const url =
    type === 'password'
      ? '/api/v1/users/updateMyPassword'
      : '/api/v1/users/updateMe';

  try {
    const res = await axios.patch(url, data);
    showAlert(
      'success',
      `${type === 'password' ? 'Password' : 'Settings'} updated successfully!`
    );
    return res.data;
  } catch (err) {
    showAlert('error', errorMessage(err));
    return null;
  }
};
