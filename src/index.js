const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT


app.use(express.json()) //recebe informações JSON e armazena no BODY
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
  console.log('Servidor rodando na porta ' + port)
})