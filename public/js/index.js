/* eslint-disable */
import { displayMap } from './map';
import { login, signup, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './booking';
import { createReview } from './review';
import { showAlert } from './alert';

const $ = selector => document.querySelector(selector);
const value = id => document.getElementById(id).value;

// Wraps an async form handler: disables the button + shows progress text.
const withBusy = async (button, busyText, action) => {
  const original = button.textContent;
  button.disabled = true;
  button.textContent = busyText;
  try {
    return await action();
  } finally {
    button.disabled = false;
    button.textContent = original;
  }
};

// MAP
const mapBox = document.getElementById('map');
if (mapBox) displayMap(JSON.parse(mapBox.dataset.locations));

// LOGIN
const loginForm = $('.form--login');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = loginForm.querySelector('button');
    withBusy(btn, 'Logging in…', () => login(value('email'), value('password')));
  });
}

// SIGNUP
const signupForm = $('.form--signup');
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = signupForm.querySelector('button');
    withBusy(btn, 'Creating account…', () =>
      signup({
        name: value('name'),
        email: value('email'),
        password: value('password'),
        passwordConfirm: value('password-confirm')
      })
    );
  });
}

// LOGOUT
const logOutBtn = $('.nav__el--logout');
if (logOutBtn) logOutBtn.addEventListener('click', logout);

// ACCOUNT: name / email / photo
const userDataForm = $('.form-user-data');
if (userDataForm) {
  const photoInput = document.getElementById('photo');
  const preview = $('.form__user-photo');

  // Live preview of the chosen photo before saving
  photoInput.addEventListener('change', () => {
    const [file] = photoInput.files;
    if (file) preview.src = URL.createObjectURL(file);
  });

  userDataForm.addEventListener('submit', async e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', value('name'));
    form.append('email', value('email'));
    if (photoInput.files[0]) form.append('photo', photoInput.files[0]);

    const result = await withBusy($('.btn--save-data'), 'Saving…', () =>
      updateSettings(form, 'data')
    );
    // Reflect a new name/photo in the header without a full reload
    if (result) {
      const { user } = result.data;
      document
        .querySelectorAll('.nav__user-img, .form__user-photo')
        .forEach(img => (img.src = `/img/users/${user.photo}`));
      const navName = $('.nav__el .nav__user-img + span');
      if (navName) navName.textContent = user.name.split(' ')[0];
    }
  });
}

// ACCOUNT: password
const userPasswordForm = $('.form-user-password');
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    const ok = await withBusy($('.btn--save-password'), 'Updating…', () =>
      updateSettings(
        {
          currentPassword: value('password-current'),
          password: value('password'),
          passwordConfirm: value('password-confirm')
        },
        'password'
      )
    );
    if (ok) userPasswordForm.reset();
  });
}

// BOOKING
const bookBtn = document.getElementById('book-tour');
if (bookBtn) {
  bookBtn.addEventListener('click', () =>
    withBusy(bookBtn, 'Processing…', () => bookTour(bookBtn.dataset.tourId))
  );
}

// REVIEW
const reviewForm = $('.form--review');
if (reviewForm) {
  reviewForm.addEventListener('submit', e => {
    e.preventDefault();
    const rating = reviewForm.querySelector('input[name="rating"]:checked');
    if (!rating) return showAlert('error', 'Please choose a star rating.');
    withBusy(reviewForm.querySelector('button'), 'Submitting…', () =>
      createReview(reviewForm.dataset.tourId, Number(rating.value), value('review'))
    );
  });
}

// One-off alert passed from the server (e.g. after booking)
const { alert } = document.body.dataset;
if (alert) showAlert('success', alert, 8);
