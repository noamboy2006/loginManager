const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db.db', (err) => { if (err) return console.error(err.message) })
// const sql = `CREATE TABLE login (
//   id varchar(20),
//   pw varchar(128),
//   token varchar(64),
//   email varchar(128),
//   auth BIT
// )`
db.all(sql, [], (err, rows) => {
  if (err) {
    throw err
  }
  rows.forEach((row) => {
    console.log(row)
  })
})
db.close((err) => { if (err) return console.error(err.message) })
