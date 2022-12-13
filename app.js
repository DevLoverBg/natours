// +++++++++++++++++++++++++++++++++++++++++++
// NATOURS APP
// Ver.: 1.0.0
// Original Design: Jonas Schmedtmann
// Coded by DevLover
// +++++++++++++++++++++++++++++++++++++++++++

// +++++++++++++++++++++++++++++++++++++++++++
// Imports
// +++++++++++++++++++++++++++++++++++++++++++
const hpp = require('hpp');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const xss = require('xss-clean');
const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const viewRouter = require('./routes/viewRoutes');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');
const globalErrorHandler = require('./controllers/errorController');

// +++++++++++++++++++++++++++++++++++++++++++
// Start express application
// +++++++++++++++++++++++++++++++++++++++++++
const app = express();

app.enable('trust proxy');

// +++++++++++++++++++++++++++++++++++++++++++
// PUG engine setup
// +++++++++++++++++++++++++++++++++++++++++++
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// +++++++++++++++++++++++++++++++++++++++++++
// Global Middlewares
// +++++++++++++++++++++++++++++++++++++++++++
// Implement cors
app.use(cors());

app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());

// Serving static files (works closely with PUG)
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Http request logger for development environment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

app.post('/webhook-checkout', bookingController.webhookCheckout);
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Compress text send to client

// Serving static files
app.use(express.static(`${__dirname}/public`));

//Compresion middleware
app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  // console.log(req.cookies);
  next();
});

// +++++++++++++++++++++++++++++++++++++++++++
// Routes
// +++++++++++++++++++++++++++++++++++++++++++

// Views routes
app.use('/', viewRouter);

// API routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Dealing with unknown urls
app.use(globalErrorHandler);

module.exports = app;
