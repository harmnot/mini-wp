const bcrypt = require("bcryptjs");

function hashingPassword(user) {
  return new Promise(function(resolve, reject) {
    bcrypt.genSalt(+process.env.SALT, (err, salt) => {
      if (err) {
        reject(err);
      } else {
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) {
            reject(err);
          } else {
            resolve(hash);
          }
        });
      }
    });
  });
}

function comparePassword(requestBody, passwordHash) {
  return new Promise(function(resolve, reject) {
    bcrypt.compare(requestBody, passwordHash, (err, isMatch) => {
      if (err) {
        reject(err);
      } else {
        resolve(isMatch);
      }
    });
  });
}

module.exports = { hashingPassword, comparePassword };
