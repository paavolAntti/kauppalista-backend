const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')
const api = supertest(app)


describe('user related tests', () => {
    // Alustetaan testitietokanta ennen testejä ja luodaan testikäyttäjät
    beforeEach(async () => {
        await User.deleteMany({})

        let userObj = new User(helper.initialUsers[0])
        await userObj.save()

        userObj = new User(helper.initialUsers[1])
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
    
        expect(res.body).toHaveLength(helper.initialUsers.length)
    })
    
    test('users include testiukko00 and testiukko01', async () => {
        const res = await api.get('/api/users')
        
        const contents = res.body.map(r => r.username)
        console.log(contents)
    
        expect(contents).toContain('testiukko00')
        expect(contents).toContain('testiukko01')   
    })

    test('user can be added with valid parameters', async () => {
        await api.post('/api/users')
            .send(helper.newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('user cant be added with same existing username', async () => {
        let e = null
        await api
            .post('/api/users')
            .send(helper.newUser)
        try {
            const user = new User(helper.newUser)
            await user.validate()
        } catch (error) {
            e = error
        }
        expect(e.message).toContain('expected `username` to be unique')
            

    })

})

describe('login related tests', () => {
    test('login with valid username and password ok', async () => {
        await api
            .post('/api/users')
            .send(helper.loginUser)
        

        const res = await api
            .post('/api/login')
            .send({username: helper.loginUser.username, password: helper.loginUser.password})
            .expect(200)

        expect(res.body.token).toBeDefined()
    })
})


afterAll(() => {
    mongoose.connection.close()
})