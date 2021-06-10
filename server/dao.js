'use strict';
//This file contains all the queries to access the database

const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');


//Open the datase
const db = new sqlite.Database('survey.db', (err) => {
  if(err) throw err;
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
          const admin = {id: row.id, username: row.username};
          //I compare the hash of the received password with the hash in the DB
         bcrypt.compare(password, row.password).then(result => {
            if(result)
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
            if(err)
                reject(err);
            else if(row === undefined){
                resolve(false);
            }
            else{
                const admin = {id: row.id, username: row.username};
                resolve(admin);
            }
        });
    });
}

