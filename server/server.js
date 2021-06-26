'use strict';
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const { check, validationResult, body } = require('express-validator');
const LocalStrategy = require('passport-local').Strategy;
const morgan = require('morgan'); // logging middleware
const DAO = require("./dao");

const app = new express();
const port = 3001;
app.use(morgan('dev'));
app.use(express.json());

/*
  ***********************************************************
  ************ BEGIN AUTHENTICATION FUNCTIONS ***************
  ***********************************************************
  The next few functions are used to manage the authentications 
  of admins on the web app
*/

//This function is used to find the user with the given credentials
//It returns done(), that could be the authenticated user (OK) or 'false' and a message (NOT OK)
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
},
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

//Initialization of Passport to use sessions
app.use(passport.initialize());
app.use(passport.session());

//This route is used to receive login requests 
app.post('/api/login', [
  check('username').isString({min: 0}),
  check('password').isString({min: 0})
], function (req, res, next) {
  if(validationResult(req).isEmpty()){
    passport.authenticate("local", (err, admin, info) => {
      if (err) return next(err);
  
      if (!admin) {
        // display wrong login messages
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(admin, (err) => {
        if (err) return next(err);
        return res.json(admin);
      });
    })(req, res, next);
  }else {
    //Status 422: Unprocessable Entity, the request was well-formed but was unable to be followed due to semantic errors.
    return res.status(422).json({ errors: validationResult(req).array() })
  }
  
});

//Check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
      res.status(200).json(req.user);
  }
  else
      res.status(401).json({message: 'not authenticated'});
});

//This function is used to check if a request comes from an authenticated admin
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'not authenticated' });
}
/*
  ***********************************************************
  ************ END OF AUTHENTICATION FUNCTIONS **************
  ***********************************************************
*/

//Logout
app.delete('/api/logout', (req, res) => {
  req.logout();
  res.end();
});

//This function is used to listen for getAllSurveys() API
app.get('/api/surveys', async (req, res) => {
  await DAO.getAllSurveys().then(surveys => res.json(surveys)).catch(() => res.status(500).json("Database unreachable"));
});

//This function is used to listen for getSurvey() API
app.get('/api/survey=:survey', [check('survey').isInt({ min: 0 })], async (req, res) => {
  if (validationResult(req).isEmpty()) {
    await DAO.getSurvey(req.params.survey).then(questions => res.json(questions)).catch(() => res.status(500).json("Database unreachable"));
  } else {
    //Status 422: Unprocessable Entity, the request was well-formed but was unable to be followed due to semantic errors.
    return res.status(422).json({ errors: validationResult(req).array() })
  }

});

//This function is used to listen for createUser() API
app.post('/api/user', [check('name').isString({ min: 0 })], async (req, res) => {
  if (validationResult(req).isEmpty()) {
    await DAO.createUser(req.body.name).then(userId => res.json(userId)).catch(() => res.status(500).json("Database unreachable"));
  } else {
    //Status 422: Unprocessable Entity, the request was well-formed but was unable to be followed due to semantic errors.
    return res.status(422).json({ errors: validationResult(req).array() })
  }

});

//This function is used to listen for saveAnswers() API
app.post('/api/survey',[
    body().isArray(),
    body('*.questionId').isInt({min: 0}),
    body('*.userId').isInt({min: 0})
  ],
  async (req, res) => {
    if (validationResult(req).isEmpty()) {
      //req.body contains the array of answers given by a certain user in a certain survey
      await DAO.saveAnswers(req.body).then(() => res.status(200).end()).catch(() => res.status(500).json("Database unreachable"));
    } else {
      //Status 422: Unprocessable Entity, the request was well-formed but was unable to be followed due to semantic errors.
      return res.status(422).json({ errors: validationResult(req).array() })
    }
});

//This function is used to listen for getAdminSurveys() API
app.get('/api/admin=:admin', isLoggedIn, [check('admin').isInt({ min: 0 })], async (req, res) => {
  if (validationResult(req).isEmpty()) {
    await DAO.getAdminSurveys(req.params.admin).then(surveys => res.json(surveys)).catch(() => res.status(500).json("Database unreachable"));
  } else {
    //Status 422: Unprocessable Entity, the request was well-formed but was unable to be followed due to semantic errors.
    return res.status(422).json({ errors: validationResult(req).array() })
  }
});

//This function is used to listen for createSurvey() API
app.post('/api/admin=:admin/survey', isLoggedIn, [check('admin').isInt({ min: 0 }), check('title').isString({ min: 0 })], async (req, res) => {
  if (validationResult(req).isEmpty()) {
    await DAO.createSurvey(req.params.admin, req.body.title).then(surveyId => res.json(surveyId)).catch(() => res.status(500).json("Database unreachable"));
  } else {
    //Status 422: Unprocessable Entity, the request was well-formed but was unable to be followed due to semantic errors.
    return res.status(422).json({ errors: validationResult(req).array() })
  }
});

//This function is used to listen for sendQuestions() API
app.post('/api/admin/survey/questions', isLoggedIn, 
    [
      check('id').isInt({ min: 0 }),
      body('questions').isArray(),
      body('questions.*.text').isString({min: 0}),
      body('questions.*.type').isInt({min: 0, max: 2})
    ], 
  async (req, res) => {
  if (validationResult(req).isEmpty()) {
    await DAO.addQuestions(req.body.id, req.body.questions).then(() => res.status(200).end()).catch(() => res.status(500).json("Database unreachable"));
  } else {
    //Status 422: Unprocessable Entity, the request was well-formed but was unable to be followed due to semantic errors.
    return res.status(422).json({ errors: validationResult(req).array() })
  }
});

//This function is used to listen for getUsersHasSubmitted() API
app.get('/api/survey=:survey/users', isLoggedIn, [check('survey').isInt({ min: 0 })], async (req, res) => {
  if (validationResult(req).isEmpty()) {
    await DAO.getUsersHasSubmitted(req.params.survey).then(users => res.json(users)).catch(() => res.status(500).json("Database unreachable"));
  } else {
    //Status 422: Unprocessable Entity, the request was well-formed but was unable to be followed due to semantic errors.
    return res.status(422).json({ errors: validationResult(req).array() })
  }

});

//This function is used to listen for getSubmission() API
app.get('/api/survey=:survey/user=:user', isLoggedIn, 
  [check('survey').isInt({ min: 0 }), check('user').isInt({ min: 0 })],
  async (req, res) => {
    if (validationResult(req).isEmpty()) {
      await DAO.getSubmission(req.params.survey, req.params.user).then(submission => res.json(submission)).catch(() => res.status(500).json("Database unreachable"));
    } else {
      //Status 422: Unprocessable Entity, the request was well-formed but was unable to be followed due to semantic errors.
      return res.status(422).json({ errors: validationResult(req).array() })
    }

  });

//The server is listening...
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});