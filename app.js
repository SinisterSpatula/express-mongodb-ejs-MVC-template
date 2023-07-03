const express = require('express');
const createError = require('http-errors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const MongoStore = require('connect-mongo');
const path = require('path');
const morgan = require('morgan');
const connectDB = require('./config/db');
const User = require('./models/User');

connectDB();

//Add future route handlers here as your app functionality grows
const indexRouter = require('./routes/index');

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

// Create the Express application
var app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/**
 * This function is called when the `passport.authenticate()` method is called.
 */
passport.use(
  new LocalStrategy(function (username, password, cb) {
    User.findOne({ username: username })
      .then((user) => {
        if (!user) {
          return cb(null, false);
        }
        const isValid = validPassword(password, user.hash, user.salt);
        if (isValid) {
          return cb(null, user);
        } else {
          return cb(null, false);
        }
      })
      .catch((err) => {
        cb(err);
      });
  })
);

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(async function (id, cb) {
  try {
    const user = await User.findById(id);
    cb(null, user);
  } catch (err) {
    return cb(err);
  }
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      stringify: false,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

/**
 * -------------- ROUTES ----------------
 */

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Server listens on http://localhost:3000
app.listen(3000);

/**
 * -------------- HELPER FUNCTIONS ----------------
 */
function validPassword(password, hash, salt) {
  var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}
