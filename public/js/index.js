/*eslint-disable */
// +++++++++++++++++++++++++++++++++++++++++++
// Imports
// +++++++++++++++++++++++++++++++++++++++++++
import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';

import { signup } from './signup.js';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';

// +++++++++++++++++++++++++++++++++++++++++++
// DOM elements
// +++++++++++++++++++++++++++++++++++++++++++
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signUpForm = document.getElementById('form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

// +++++++++++++++++++++++++++++++++++++++++++
// Delegation
// +++++++++++++++++++++++++++++++++++++++++++

// Display the map if it exists
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

// Submit create user form
if (signUpForm)
  signUpForm.addEventListener('submit', e => {
    e.preventDefault();

    // Sign up form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    signup(name, email, password, passwordConfirm);
  });

// Submit login form
if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();

    // Log in form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });

// User logout
if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

// Update current user details
if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });

// Change current user password
if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    // Update btn text
    document.querySelector('.btn--save-password').textContent = 'Save password';

    // Clear fields after update
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
