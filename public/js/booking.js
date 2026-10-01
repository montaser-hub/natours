/* eslint-disable */
import axios from 'axios';
import { showAlert, errorMessage } from './alert.js';

export const bookTour = async tourId => {
  try {
    const res = await axios.post(`/api/v1/bookings/checkout/${tourId}`);

    if (res.data.mode === 'stripe') {
      // Hosted Stripe Checkout; the booking is created by the webhook.
      location.assign(res.data.url);
    } else {
      location.assign('/my-tours?alert=booking');
    }
  } catch (err) {
    showAlert('error', errorMessage(err));
    return false;
  }
  return true;
};
