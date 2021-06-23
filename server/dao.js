'use strict';
//This file contains all the queries to access the database

const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');


//Open the datase
const db = new sqlite.Database('survey.db', (err) => {
  if (err) throw err;
});

//Get an admin, used to authenticate
exports.getAdmin = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM ADMIN WHERE username = ?';
    db.get(sql, [username], function (err, row) {
      if (err)
        reject(err);
      else if (row === undefined) {
        resolve(false);
      }
      else {
        const admin = { id: row.id, username: row.username };
        //I compare the hash of the received password with the hash in the DB
        bcrypt.compare(password, row.password).then(result => {
          if (result)
            resolve(admin);
          else
            resolve(false);
        });
      }
    });
  });
}

//Get an admin using its ID, used to serialize and deserialize (sessions)
exports.getAdminId = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM ADMIN WHERE id = ?';
    db.get(sql, [id], function (err, row) {
      if (err)
        reject(err);
      else if (row === undefined) {
        resolve(false);
      }
      else {
        const admin = { id: row.id, username: row.username };
        resolve(admin);
      }
    });
  });
}

//Get all the surveys
exports.getAllSurveys = () => {
  return new Promise((resolve, reject) => {
    const sql = `
                  SELECT S.id, S.title, S.adminId, A.username
                  FROM SURVEY S, ADMIN A
                  WHERE S.adminId = A.id
                 `;
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const allSurveys = rows.map((row) => (
        {
          id: row.id,
          title: row.title,
          adminId: row.adminId,
          author: row.username
        }
      ));
      resolve(allSurveys);
    });
  });
}

//Get just one survey and its questions through the id
exports.getSurvey = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `
                  SELECT Q.id, Q.text, Q.type, Q.minAns, Q.maxAns, O.description, O.id AS Oid
                  FROM QUESTION Q LEFT JOIN OPTION O ON O.questionId = Q.id
                  WHERE Q.surveyId = ?
                `;
    db.all(sql, [id], function (err, rows) {
      if (err) {
        reject(err);
        return;
      }
      const survey = rows.map((question) => ({
        questionId: question.id,
        questionText: question.text,
        type: question.type,
        min: question.minAns,
        max: question.maxAns,
        optionId: question.Oid,
        optionText: question.description
      }));
      resolve(survey);
    });

  });
}

//Create a new user and return its ID
exports.createUser = (name) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO USER (name) VALUES(?)';
    db.run(sql, [name], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
}

//Send and save the answers of a certain user in the DB
exports.saveAnswers = (answers) => {
  // answer = {answerText (if any), questionId, optionId (if any), userId}
  return new Promise((resolve, reject) => {
    let error = "";
    for (let i = 0; i < answers.length; i++) {
      let sql = 'INSERT INTO ANSWER (answerText, questionId, optionId, userId) VALUES(?, ?, ?, ?)';
      db.run(sql, [answers[i].answerText, answers[i].questionId, answers[i].optionId, answers[i].userId], function (err) {
        if (err) {
          error = err;
        }
      });
    }

    if (error === "") {
      resolve(true);
    }
    else {
      reject(error);
    }

  });
}

//Get all the surveys of a certain admin
exports.getAdminSurveys = (id) => {
  return new Promise((resolve, reject) => {
    const sql = ` SELECT S.id, S.title, COUNT(DISTINCT A.userId) AS submissions
                  FROM SURVEY S, QUESTION Q
                  LEFT JOIN ANSWER A ON A.questionId = Q.id
                  WHERE S.adminId = ? AND Q.surveyId = S.id
                  GROUP BY S.id, S.title
                `;
    db.all(sql, [id], function (err, rows) {
      if (err) {
        reject(err);
        return;
      }
      const surveys = rows.map((survey) => ({
        id: survey.id,
        title: survey.title,
        submissions: survey.submissions
      }));
      resolve(surveys);
    });
  });
}

//Create a new (empty) survey given its title and the ID of the admin who created it
exports.createSurvey = (id, title) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO SURVEY (title, adminId) VALUES(?, ?)`;
    db.run(sql, [title, id], function (err) {
      if (err) {
        reject(err);
        return;
      } else {
        resolve(this.lastID);
      }
    });
  });
}

//Add questions to a new survey
exports.addQuestions = (id, questions) => {
  return new Promise((resolve, reject) => {
    let error = "";
    let idForOptions;
    const sql = "INSERT INTO QUESTION (text, type, minAns, maxAns, surveyId) VALUES(?, ?, ?, ?, ?)";
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].type === 0) {
        db.run(sql, [questions[i].text, questions[i].type, questions[i].min, questions[i].max, id], function (err) {
          if (err) {
            error = err;
          } else {
            idForOptions = this.lastID;

            const sql2 = "INSERT INTO OPTION (description, questionId) VALUES(?, ?)";
            for (let j = 0; j < questions[i].options.length; j++) {
              db.run(sql2, [questions[i].options[j], idForOptions], function (err) {
                if (err) {
                  error = err;
                }
              });
            }
          }
        });
      } else {
        db.run(sql, [questions[i].text, questions[i].type, questions[i].min, questions[i].max, id], function (err) {
          if (err) {
            error = err;
          }
        });
      }
    }

    if (error === "") {
      resolve(true);
    }
    else {
      reject(error);
    }

  });
}

//Get all the users that has submitted a certain survey
exports.getUsersHasSubmitted = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `
                  SELECT DISTINCT A.userId, U.name
                  FROM QUESTION Q, USER U, ANSWER A
                  WHERE Q.surveyId = ? AND A.questionId = Q.id AND A.userId = U.id
                `;
    db.all(sql, [id], function (err, rows) {
      if (err) {
        reject(err);
        return;
      }
      const users = rows.map((user) => ({
        id: user.userId,
        name: user.name
      }));
      resolve(users);
    });

  });
}

//Get all the questions and relative answers of a certain survey submitted by a certain user
exports.getSubmission = (surveyId, userId) => {
  return new Promise((resolve, reject) => {

    const sql = `
                SELECT Q.id AS questionId, A.answerText, A.optionId
                FROM ANSWER A, QUESTION Q
                WHERE Q.surveyId = ? AND A.userId = ? AND A.questionId = Q.id
                `
    db.all(sql, [surveyId, userId], function (err, rows) {
      if (err) {
        reject(err);
        return;
      }
      const answers = rows.map((answer) => ({
        questionId: answer.questionId,
        answerText: answer.answerText,
        optionId: answer.optionId
      }))
      resolve(answers);
    });

  });
}
