const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
  const response = await request(app).post('/users').send({
    name: 'Rafael',
    email: 'rafael@teste.com',
    password: 'Senh@Test3!'
  }).expect(201)

  //Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  //Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: 'Rafael',
      email: 'rafael@teste.com'
    },
    token: user.tokens[0].token
  })

  expect(user.password).not.toBe('123#ewqe')
})

test('Should login existing user', async () =>{
  const response = await request(app).post('/users/login'). send({
    email: userOne.email,
    password: userOne.password
  }).expect(200)

  const user = await User.findById(userOneId)

  expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexisting user', async () =>{
  await request(app).post('/users/login'). send({
    email: 'fakeuser@teste.com',
    password: 'add234r#'
  }).expect(400)
})

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  const user = await User.findById(userOneId)
  expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/Joker-icon.png')
    .expect(200)

  const user = await User.findById(userOneId)
  expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'Leonardo',
      email: 'teste@asd.com',
      password: '123#ewqe',
      age: 30
    })
    .expect(200)
  
  const user = await User.findById(userOneId)
  expect(user.name).toBe('Leonardo')
})

test('Should not update invalid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'Leonardo',
      location: 'Campos'
    })
    .expect(400)
})

test('Should not delete user if unauthenticated', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should not update user with invalid name', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: []
    })
    .expect(400)

  const user = await User.findById(userOne._id)
  expect(user.name).toBe('Mike')
})

test('Should not update user with invalid email', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      email: 'emailInvalido'
    })
    .expect(400)

  const user = await User.findById(userOne._id)
  expect(user.email).toBe('teste@asd.com')
})

test('Should not update user with invalid password', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      password: 'abc'
    })
    .expect(400)
})

test('Should not update user if unauthenticated', async () => {
  await request(app)
    .patch('/users/me')
    .send({
      email: 'email@teste.com'
    })
    .expect(401)

})

// User Test Ideas
//
// Should not signup user with invalid name/email/password