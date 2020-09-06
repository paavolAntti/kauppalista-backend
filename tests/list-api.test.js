const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const api = supertest(app)

const initialUsers = [
    {
        'username': 'testiukko00',
        'name': 'Testi Ukko',
        'password': 'salasana'
    },
    {
        'username': 'testiukko01',
        'name': 'Testi Ukko2',
        'password': 'password'
    },
]

// Alustetaan testitietokanta ennen testejä ja luodaan testikäyttäjät
beforeEach(async () => {
    await User.deleteMany({})

    let userObj = new User(initialUsers[0])
    await userObj.save()

    userObj = new User(initialUsers[1])
    await userObj.save()
})

test('users are returned as json', async () => {
    await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all users are returned', async () => {
    const res = await api.get('/api/users')

    expect(res.body).toHaveLength(initialUsers.length)
})

test('users include testiukko00 and testiukko01', async () => {
    const res = await api.get('/api/users')
    
    const contents = res.body.map(r => r.username)
    console.log(contents)

    expect(contents).toContain('testiukko00')
    expect(contents).toContain('testiukko01')   
})

afterAll(() => {
    mongoose.connection.close()
})