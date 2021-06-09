'use strict';

const express = require('express');
const passport = require('passport');
const session = require('express-session');
const { check } = require('express-validator');
const LocalStrategy = require('passport-local').Strategy;
const morgan = require('morgan'); // logging middleware
const DAO = require("./dao");

// init express
const app = new express();
app.use(morgan('dev'));
app.use(express.json());
const port = 3001;

/*
  ***********************************************************
  ************ BEGIN AUTHENTICATION FUNCTIONS ***************
  ***********************************************************
  The next few functions are used to manage the authentications 
  of admins on the web app
*/

//This function is used to find the user with the given credentials
//It returns done(), that could be the authenticated user (OK) or 'false' and a message (NOT OK)
passport.use(new LocalStrategy(
  function (username, password, done) {
    DAO.getAdmin(username, password).then((admin) => {
      //If the credentials are wrong
      if (!admin) {
        return done(null, false, { message: 'Wrong credentials. Admin not found.' });
      }

      //Admin found
      return done(null, admin);
    });
  }));

//To enable sessions we need some middleware (provided by express-session)
//First of all we need to enable sessions in Express
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false
}));

//Initialization of Passport to use sessions
app.use(passport.initialize());
app.use(passport.session());

//After the creation of sessions I can put the admin's id in it
//I should put the username also but it's always better to store meaningless information in the session

//With serializeUser we put the id in the session
passport.serializeUser((admin, done) => {
  done(null, admin.id);
});

//With deserializeUser we use the id in the session to keep the current logged-in admin authenticated
passport.deserializeUser((id, done) => {
  DAO.getAdminId(id).then((admin) => {
    done(null, admin);
  })
    .catch((err) => {
      done(err, null);
    });
});

//This route is used to receive login requests 
app.post('/api/login', [
  check('username').isString(),
  check('password').isString()],
  passport.authenticate('local'), (req, res) => {
      res.json(req.admin);
  });

/*
  ***********************************************************
  ************ END OF AUTHENTICATION FUNCTIONS **************
  ***********************************************************
*/

//This function is used to check if a request comes from an authenticated admin
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated())
    return next();
  
  return res.status(401).json({ error: 'not authenticated'});
}

//The server is listening...
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});