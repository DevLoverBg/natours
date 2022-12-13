# Natours Application

This full stack web application is specially designed for persons who love travelling and going on tour vacations.

This app can be found at [https://natours-devlover.up.railway.app/](https://natours-devlover.up.railway.app/).
The documentation of the API for this app can be found at [https://documenter.getpostman.com/view/13036021/TWDfEZ3P](https://documenter.getpostman.com/view/13036021/TWDfEZ3P)
The API and the app itself are hosted on the same server.

## Overview

This web application allows it's users to book tour vacations.

A tour refers to a series of locations, specially picked to excite the adventurous spirit of the individual who books it.

A visiting user who has not yet created an account on the app can simply see all the current tours as well as detailed information about each tour.

Once signed up or logged in, they can then book any tour of their choice.

## Purpose

This app is a pet project, built for the express purpose of honing my skills in full stack web development.

## Bugs and Delays

- The App is now hosted in Railway. Because Herocu stops theyr free trail

## Solved

- Error message `jwt malformed` is displayed when trying to logout from /user page, if loggin out from other pages the error is not displayed
  - **Solved redirecting the user to the home page**
- The payment succeeded but the tours page keep displaying the message `stripe.js:13 Uncaught ReferenceError: Stripe is not defined at stripe.js:13:16` on console

  - **Solved after the improvement on Stripe process using webhooks**

## Possible Improvements

✅ Implement a sign up form

- On tour detail page allow user to add the review
- Implement "My Review" pages (using React)
- Implement restriction to users review only tours they have booked
- Confirm user email address after first creating account
- Implement maximum login attempts
- Implement two-factor authentication
- Implement the "Manage" page for administrators to CRUD tours, users, reviews and bookings

## Main Tools And Technologies Used

- HTML (Create the structure and content of the web pages).
- CSS (Styling of the web pages).
- PUG (Template engine for generating the web pages dynamically).
- JAVASCRIPT (Interactivity, as well as making requests to the API from the client-side).
- NODE (Run JavaScript code on the server-side).
- EXPRESS (Node framework, meant to simplify the process of building complex server-side applications).
- MONGODB (Database for data persistence).
- MONGOOSE (Interacting with mongodb).
- MAPBOX (Displaying the different locations of each tour).
- STRIPE (Making payments on the app).
- JSON WEB TOKEN (Authenticating users)
- NODEMAILER (Sending emails to users of the app)
- MAILTRAP (Trapping the emails we send in our development environment, so they don't actually get sent to the user's email address)
- SENDGRID (Sending actual emails to the users in production).

## Setting Up Your Local Environment

If you wish to play around with the code base in your local environment, do the following

```
* Clone this repo to your local machine.
* Using the terminal, navigate to the cloned repo.
* Install all the neccessary dependencies, as stipulated in the package.json file.
* If you don't already have one, set up accounts with: MONGODB, MAPBOX, STRIPE, SENDGRID and MAILTRAP. Please ensure to have at least basic knowledge of how these services work.
* In your .env file, set environment variables for the following:
    * DATABASE=your mongodb database url
    * DATABASE_PASSWORD=your mongodb password
    * SECRET=your json web token secret
    * JWT_EXPIRES_IN=90d
    * JWT_COOKIE_EXPIRES_IN=90
    * EMAIL_USERNAME=your mailtrap username
    * EMAIL_PASSWORD=your mailtrap password
    * EMAIL_HOST=smtp.mailtrap.io
    * EMAIL_PORT=2525
    * EMAIL_FROM=your real life email address
    * SENDGRID_USERNAME=apikey
    * SENDGRID_PASSWORD=your sendgrid password
    * STRIPE_SECRET_KEY=your stripe secret key
    * STRIPE_WEBHOOK_SECRET=your stripe web hook secret
* Start the server.
* Your app should be running just fine.
```

## Main Features

- [Users](#users)
- [Tours](#tours)
- [Bookings](#bookings)

## Users

- Users can sign up with the application.
- Users can log into the application.
- Users can log out of the appication.
- Users can update their password.
- Users can reset their password
- Users can update their general information.
- Users can see their profile page.
- A user can be either a regular user or an admin or a lead-guide or a guide.
- When you sign up, you are a regular user by default.

## Tours

- Tours can be created by an admin user or a lead-guide.
- Tours can be seen by every user.
- Tours can be updated by an admin user or a lead-guide.
- Tours can be deleted by an admin user or a lead-guide.

## Bookings

- Only regular users can book tours (make a payment).
- Regular users can see all the tours thay have booked.
- An admin user or a lead-guide can see every booking on the app.
- An admin user or a lead-guide can delete any booking.
- An admin user or a lead-guide can create a booking (manually, without payment).
- An admin user or a lead-guide can not create a bookng for thesame user twice.
- An admin user or a lead-guide can edit any booking.

## Problems Encountered and Solutions

- The JSON Web Token cookie was not being created on browser. After some checking I realised that I was serving the site from `localhost:3000` and making CORS requests to `127.0.0.1:3000`. After changing the CORS request origin to `localhost:3000` on `app.js` the cookie is being generated with no issues.

- When using `import/export` on `.js` file, the following error was being displayed: _"Parsing error: 'import' and 'export' may appear only with 'sourceType: module'"_, to fix the error I added `javascriptreact` to plugins in `.eslintrc.json`. Source [stackoverflow](https://stackoverflow.com/questions/39158552/ignore-eslint-error-import-and-export-may-only-appear-at-the-top-level).

- `__dirname` is not defined in ES module scope. To solve import and use the `dirname() method` from the `path module`. The `dirname() method` takes a path as a parameter and returns the directory name of the path.

```javascript
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Now it is possible to use the __dirname variable
```

## Notice

The app is actually quite more complex than is indicated in this documentation.
Nevertheless, this summary is enough to help you understand the major features of the app.
You are welcome to make improvements on the app.
Please use the link specified at the beginning of the document to preview the app.
