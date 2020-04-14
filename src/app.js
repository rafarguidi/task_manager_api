const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

app.use(express.json()) //recebe informações JSON e armazena no BODY
app.use(userRouter)
app.use(taskRouter)

module.exports = app