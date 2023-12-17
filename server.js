require('dotenv').config() //this is to load the token secrets in our .env file

const express = require('express')

const jwt = require('jsonwebtoken')

const app = express()

const posts = [
  {
    username: 'Kyle',
    title: 'Post 1',
  },

  {
    username: 'David',
    title: 'Post 2',
  },

  {
    username: 'Azeem',
    title: 'Post 3',
  },
]

// this is a middleware that verifies token and make sure it is valid
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(403)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.send('invalid token')

    req.user = user
    next()
  })
}

app.use(express.json())

app.get('/posts', authenticateToken, (req, res) => {
  console.log(req.user.name)
  return res.json(posts.filter((post) => post.username === req.user.name))
})

app.listen(3000)
