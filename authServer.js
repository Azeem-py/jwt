require('dotenv').config()

const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()

app.use(express.json())

const refreshTokens = []

app.post('/login', (req, res) => {
  //authentication logics

  const username = req.body.username
  if (!username) return res.status(400).send('Pls provide your username')
  const user = { name: username }

  const accessToken = generateAccessToken(user)
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  refreshTokens.push(refreshToken)

  res.json({ accessToken, refreshToken })
})

app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (!refreshToken) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    return res.json({ accessToken })
  })
})

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}

app.listen(4000)
