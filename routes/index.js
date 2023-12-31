const express = require('express');
const router = express.Router();
const passport = require('passport');
const crypto = require('crypto');
const User = require('../models/User');

/**
 * -------------- Main Index Route: https://localhost:3000/ ----------------
 */

router.get('/', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/protected-route');
  } else {
    res.send(
      '<h1>Home</h1><p>Please <a href="/register">register</a> or <a href="/login">login</a></p>'
    );
  }
});

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get('/login', (req, res, next) => {
  const form =
    '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

// Since we are using the passport.authenticate() method, we should be redirected no matter what
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login-failure',
    successRedirect: 'login-success',
  }),
  (err, req, res, next) => {
    if (err) next(err);
  }
);

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get('/register', (req, res, next) => {
  const form =
    '<h1>Register Page</h1><form method="post" action="register">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';
  res.send(form);
});

router.post('/register', (req, res, next) => {
  const saltHash = genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
    username: req.body.username,
    hash: hash,
    salt: salt,
  });

  newUser.save().then((user) => {
    console.log(user);
  });

  res.redirect('/login');
});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 *
 * Also, look up what behaviour express session has without a maxage set
 */
router.get('/protected-route', (req, res, next) => {
  // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
  if (req.isAuthenticated()) {
    res.send('<h1>You are authenticated</h1><p><form action="/logout" method="POST"><button style="width: 60px; height: 30px; font-size: 12px;" type="submit">Logout</button></form></p>');
  } else {
    res.send(
      '<h1>You are not authenticated</h1><p><a href="/login">Login</a> or <a href="/register">Register</a></p>'
    );
  }
});

// Visiting this route logs the user out
router.post('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/protected-route');
  });
});

router.get('/login-success', (req, res, next) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
});

router.get('/login-failure', (req, res, next) => {
  res.send('You entered the wrong password.');
});

/**
 * -------------- HELPER FUNCTIONS ----------------
 */

function genPassword(password) {
  var salt = crypto.randomBytes(32).toString('hex');
  var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

  return {
    salt: salt,
    hash: genHash,
  };
}

module.exports = router;
