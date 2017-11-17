process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Channel = require('../models/channel');
let User = require('../models/user');


let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

// https://stackoverflow.com/questions/37284600/how-to-test-a-node-api-that-uses-jwt-authentication-with-user-login-to-get-toke
// https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai

// Before:
//  Clear usergroups, users, channels
//  Create user, usergroup



describe('ChannelTests', () => {
    var token = '';
    before((done) => {
        testUser = {
            name: 'testName',
            email: 'testEmail@g.edu',
            username: 'testUsername',
            password: 'testPW'
        }
        chai.request(server)
            .post('/users/register')
            .send(testUser)
            .end( (err, res) => {
                res.status.should.equal(200);

                chai.request(server)
                    .post('/users/authenticate')
                    .send(testUser)
                    .end( (err, res) => {
                        token = res.body.token;
                        res.status.should.equal(200);
                        done();
                    });
            });
    });

    after((done) => {
        User.remove({}, (err) => { 
            done();
        });
    })

    beforeEach((done) => {
        Channel.remove({}, (err) => { 
            done();
        });
    });

    describe('/POST channel', () => {
        it('should create a new channel', (done) => {
            let newChannel = {
                name: "TestChannel",
                description: "TestDescription",
                messages: []
            }
            console.log(token);
            chai.request(server)
                .post('/channels/create')
                .set('Authorization', token)
                .send(newChannel)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('channel');
                    done();
                });
        });
        
    });
});

