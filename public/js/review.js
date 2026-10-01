/* eslint-disable */
import axios from 'axios';
import { showAlert, errorMessage } from './alert.js';

export const createReview = async (tourId, rating, review) => {
  try {
    await axios.post(`/api/v1/tours/${tourId}/reviews`, { rating, review });
    location.assign(`${location.pathname}?alert=review`);
    return true;
  } catch (err) {
    showAlert('error', errorMessage(err));
    return false;
  }
};
