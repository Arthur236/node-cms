const express = require('express');
const { isEmpty } = require('lodash');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../../models/User');

const router = express.Router();

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'auth';
  next();
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

passport.use(new LocalStrategy({
  usernameField: 'email',
}, (email, password, done) => {
  User.findOne({ email }, (err, user) => {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false, { message: 'No user found.' });
    }

    bcrypt.compare(password, user.password, (err, matched) => {
      if (err) {
        return err;
      }

      if (!matched) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    });
  });
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
  }));

router.get('/register', (req, res) => {
  res.render('auth/register');
});

router.post('/register', (req, res) => {
  const errors = {};

  if (!req.body.username) {
    errors.username = 'Username is required';
  }

  if (req.body.username.trim().length < 3) {
    errors.username = 'Username should be at least 3 letters long';
  }

  if (!req.body.email) {
    errors.email = 'Email is required';
  }

  if (!req.body.password) {
    errors.password = 'Password is required';
  }

  if (req.body.password.length < 6) {
    errors.password = 'Password should be at least 6 characters long';
  }

  if (req.body.password !== req.body.password2) {
    errors.password2 = 'The passwords do not match';
  }

  if (!isEmpty(errors)) {
    res.render('auth/register', {
      errors,
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    });
  } else {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, salt, (err, hash) => {

        const newUser = new User({
          username: req.body.username,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hash,
        });

        User.find({ username: req.body.username }).then((users) => {
          if (users.length < 1) {
            User.find({ email: req.body.email }).then((users) => {
              if (users.length < 1) {
                newUser.save().then((savedUser) => {
                  console.log(`${savedUser.username} was registered successfully`);
                  req.flash('success_message', `${savedUser.username} registered successfully`);

                  res.redirect('/auth/login');
                });
              } else {
                errors.email = `A user with email '${req.body.email}' already exists`;
                res.render('auth/register', {
                  errors,
                  username: req.body.username,
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  email: req.body.email,
                });
              }
            });
          } else {
            errors.username = `A user with username '${req.body.username}' already exists`;
            res.render('auth/register', {
              errors,
              username: req.body.username,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
            });
          }
        });
      });
    });
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
