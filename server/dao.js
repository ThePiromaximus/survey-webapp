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
    db.get(sql, [username], (err, row) => {
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
    db.get(sql, [id], (err, row) => {
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
    db.all(sql, [id], (err, rows) => {
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
    })

  })
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
    let error;
    for(let i = 0; i < answers.length; i++){
      let sql = 'INSERT INTO ANSWER (answerText, questionId, optionId, userId) VALUES(?, ?, ?, ?)';
      db.run(sql, [answers[i].answerText, answers[i].questionId, answers[i].optionId, answers[i].userId], function(err){
        if(err){
          error = err;
        }
      });
    }

    if(!error){
      resolve(true);
    }
    else{
      reject(error);
    }
    
  });
}

