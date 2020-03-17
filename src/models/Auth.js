const db = require('../utils/db')

module.exports = {
  checkUsername: function (username) {
    const table = 'users'
    return new Promise(function (resolve, reject) {
      db.query(`SELECT COUNT (*) AS total FROM ${table} WHERE username='${username}'`, function (err, result, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(result[0].total)
        }
      })
    })
  },
  getUserByUsername: function (username) {
    const table = 'users'
    return new Promise(function (resolve, reject) {
      db.query(`SELECT * FROM ${table} WHERE username='${username}'`, function (err, result, fields) {
        if (err) {
          reject(err)
        } else {
          if (resolve.length) {
            resolve(result[0])
          } else {
            resolve(false)
          }
        }
      })
    })
  },
  createVerificationCode: function (id, code) {
    const table = 'users'
    return new Promise(function (resolve, reject) {
      db.query(`UPDATE ${table} SET verification_code='${code}' WHERE id=${id}`, function (err, result, fields) {
        if (err) {
          reject(err)
        } else {
          if (result.affectedRows) {
            resolve(true)
          } else {
            resolve(false)
          }
        }
      })
    })
  },
  verifyUser: async function (username, code) {
    const table = 'users'
    const check = await this.checkUsername(username)
    return new Promise(function (resolve, reject) {
      if (!check) {
        resolve(false)
      } else {
        db.query(`UPDATE ${table} SET verification_code=${null}, is_active=1, is_verified=1 WHERE 
        username=${username} AND verification_code='${code}'`, function (err, result, fields) {
          if (err) {
            reject(err)
          } else {
            if (result.affectedRows) {
              resolve(true)
            } else {
              resolve(false)
            }
          }
        })
      }
    })
  },
  checkVerifiedUser: function (id) {
    const table = 'users'
    return new Promise(function (resolve, reject) {
      db.query(`SELECT COUNT (*) AS total FROM ${table} WHERE id=${id} AND is_verified=1`, function (err, result, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(result[0].total)
        }
      })
    })
  },
  checkActivatedUser: function (id) {
    const table = 'users'
    return new Promise(function (resolve, reject) {
      db.query(`SELECT COUNT (*) AS total FROM ${table} WHERE id=${id} AND is_active=1`, function (err, result, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(result[0].total)
        }
      })
    })
  }
}
