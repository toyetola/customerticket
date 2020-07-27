const adminController = require('../app/controllers/adminController')
const supertest = require('supertest');
const app = require('../test-server');
const request = supertest(app)
const mongoose = require('mongoose')
const databaseName = 'test'
var token = "";

/* beforeAll(async () => {
  const url = `mongodb+srv://oyetola:oyetola24@main.bxiul.gcp.mongodb.net/test-mockpremierleague?retryWrites=true&w=majority`
  await mongoose.connect(url, { useNewUrlParser: true })
}) */

describe('Sample Test', () => {
    it('should test that true === true', () => {
      expect(true).toBe(true)
    })
})

describe('Test if land url loads', ()=>{
  //jest.useFakeTimers()

  it("should test if app loads", async done => {

    const response = await request.get('/');
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Welcome, start submitting your ticket: SUBMIT A TICKET.')
    done()
  
  });
})


describe('Test if login works', () => {

    beforeEach(async () => {
        const url = `mongodb+srv://oyetola:oyetola24@main.bxiul.gcp.mongodb.net/test-cusomerticket?retryWrites=true&w=majority`
        await mongoose.connect(url, { useNewUrlParser: true })
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Login successful');
    })

    it("should test if user can be registered", async done => {
        const response = await request.post('/api/admin/registerAgent').send({name:"menoni", email:"ask@gmail.com", password:"qwerty12", confirm_password:"qwerty12", role:"admin"})
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('success');
        done()
      }, 10000) 

    it("should test if user can login", async done => {
        const response = await request.post('/api/user/login').send({email:"askme@gmail.com", password:"qwerty12"})
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Login successful');
        if(expect(response.body.message).toBe('Login successful')){
            token = response.body.token
        } 
        done();
    }, 10000)

    

});



