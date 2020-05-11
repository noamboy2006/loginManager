const path = require('path').resolve()
const express = require('express')
const crypto = require('crypto')
const request = require('sync-request')
const env = require('./env.json')
const sqlite3 = require('sqlite3').verbose()

const app = express()

app.use('/', express.static(path))
app.use(express.urlencoded())
app.use(express.json())

app.post('/signup', (req, res) => {
  const captcha = request('POST', encodeURI('https://www.google.com/recaptcha/api/siteverify?secret=' + env.captcha + '&response=' + req.body['g-recaptcha-response']))
  const id = req.body.id
  const pw = req.body.pw
  if (!JSON.parse(captcha.getBody('utf-8')).success) {
    res.send('🖕')
    return
  }
  if (id.length < 6 || id.length > 16 || !(/^[a-zA-Z0-9_-]+$/.test(id))) {
    res.send('🖕🖕')
    return
  }
  if (pw.length < 8 || pw.length > 16 || !(/^[a-zA-Z0-9_\-?!@#$%^&]+$/.test(pw)) || (/^[a-zA-Z]+$/.test(pw)) || (/^[0-9]+$/.test(pw)) || (/^[_\-?!@#$%^&]+$/.test(pw))) {
    res.send('🖕🖕🖕')
    return
  }
  const db = new sqlite3.Database('./db.db', (err) => { if (err) return console.error(err.message) })
  db.run('INSERT INTO login(id, pw) VALUES(?, ?)', [id, crypto.createHash('sha256').update(pw).digest('hex')], function (err) {
    if (err) return console.log(err.message)
  })
  db.close((err) => { if (err) return console.error(err.message) })
  res.send('회원가입이 정상적으로 완료되었습니다.')
})

app.post('/login', (req, res) => {
  const captcha = request('POST', encodeURI('https://www.google.com/recaptcha/api/siteverify?secret=' + env.captcha + '&response=' + req.body['g-recaptcha-response']))
  const id = req.body.id
  const pw = req.body.pw
  if (!JSON.parse(captcha.getBody('utf-8')).success) {
    res.send('🖕')
    return
  }
  if (id.length < 6 || id.length > 16 || !(/^[a-zA-Z0-9_-]+$/.test(id))) {
    res.send('🖕🖕')
    return
  }
  if (pw.length < 8 || pw.length > 16 || !(/^[a-zA-Z0-9_\-?!@#$%^&]+$/.test(pw)) || (/^[a-zA-Z]+$/.test(pw)) || (/^[0-9]+$/.test(pw)) || (/^[_\-?!@#$%^&]+$/.test(pw))) {
    res.send('🖕🖕🖕')
    return
  }
  const db = new sqlite3.Database('./db.db', (err) => { if (err) return console.error(err.message) })
  const query = `SELECT * FROM login WHERE id="${req.body.id}" AND pw="${crypto.createHash('sha256').update(pw).digest('hex')}"`
  db.all(query, [], (err, rows) => {
    if (err) throw err
    if (rows.length !== 1) {
      res.redirect('./login.html')
    } else res.send('로그인 성공! 하지만 로그인 해도 아무것도 할 수 있는게 없어요. 허헣')
  })
  db.close((err) => { if (err) return console.error(err.message) })
})

app.listen(8081)
