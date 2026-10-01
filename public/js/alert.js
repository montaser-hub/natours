/* eslint-disable */

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.remove();
};

// type is 'success' or 'error'
export const showAlert = (type, msg, seconds = 5) => {
  hideAlert();
  const el = document.createElement('div');
  el.className = `alert alert--${type}`;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  el.textContent = msg; // textContent: server messages are never parsed as HTML
  document.body.prepend(el);
  window.setTimeout(hideAlert, seconds * 1000);
};

export const errorMessage = err =>
  (err.response && err.response.data && err.response.data.message) ||
  'Something went wrong. Please try again.';
