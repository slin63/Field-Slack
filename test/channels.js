process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Channel = require('../models/channel');
let UserGroup = require('../models/usergroup');
let User = require('../models/user');

mongoose.Promise = global.Promise;

let chai = require('chai');
let expect = require('chai').expect;
let chaiAsPromised = require('chai-as-promised');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);
chai.use(chaiAsPromised);

// https://stackoverflow.com/questions/37284600/how-to-test-a-node-api-that-uses-jwt-authentication-with-user-login-to-get-toke
// https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai


describe('ChannelTests', () => {
    // Before:
    //  Declare auth token for later tests
    //  Create user, usergroup

    before((done) => {
        var token = '';
        testUser = {
            name: 'testName',
            email: 'testEmail@g.edu',
            username: 'testUsername',
            password: 'testPW'
        }
        
        chai.request(server)
        .post('/users/register')
        .send(testUser)
        .end((err, res) => {
            // console.log('NEXT');
            expect(res).status.should.equal(200);
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


    after((done) => {
        var promise = User.remove({}).exec();

        promise.then(() => {
            return UserGroup.remove({}).exec();
        })
        .then(() => {
            return Channel.remove({}).exec();
        })
        .then(() => {
            done();
        })
        .catch((err) => {
            throw err;
            done();
        });
    });
});

