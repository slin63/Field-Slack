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

// example file:
// https://github.com/mjhea0/node-mocha-chai-tutorial/blob/master/test/test-server.js
// https://stackoverflow.com/questions/37284600/how-to-test-a-node-api-that-uses-jwt-authentication-with-user-login-to-get-toke
// https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai


describe('ChannelTests', () => {
    var token = '';
    var user_group_code = '';
    var channel_id_to_delete = '';
    var channel_id = '';
    var user_id = '';
    // Before:
    //  Declare auth token for later tests
    //  Create user, usergroup
    before((done) => {
        testUser = {
            name: 'testName',
            email: 'testEmail@g.edu',
            username: 'testUsername',
            password: 'testPW'
        }
        testUserGroup = {
            name: 'testGroup',
            description: 'testDescription',
            is_private: 'isPrivate'
        }
        // Register the user
        chai.request(server)
            .post('/users/register')
            .send(testUser)
            
        // Authenticate the user
        .then( (res) => { 
            expect(res).to.have.status(200);

            return chai.request(server) // Return this for the next .then()
                .post('/users/authenticate')
                .send(testUser)
        })

        // Save their token, create userGroup with JWT token
        .then( (res) => {
            expect(res).to.have.status(200);
            expect(res.body.token).to.be.not.null;
            token = res.body.token;
            user_id = res.body.user.id;
            
            return chai.request(server)
                .post('/usergroups/create')
                .set('Authorization', token)
                .send(testUserGroup)
        })

        // Check that the usergroup creation succeeded and save the user group code. Call done()
        .then( (res) => {
            expect(res).to.have.status(200);
            expect(res.body.user_group).to.be.not.null;
            user_group_code = res.body.user_group.user_group_code;
            done();
        })

        .catch( (err) => {
            throw err;
        })
    });

    beforeEach((done) => {
        done();
    });

    it('should add a new channel to user_group_code on /channels POST', (done) => {
        let newChannel = {
            name: "TestChannel",
            description: "TestDescription",
            user_group_code: user_group_code,
            messages: []
        }
        chai.request(server)
            .post('/channels')
            .set('Authorization', token)
            .send(newChannel)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('channel');
                res.body.channel.user_group_code.should.be.eql(user_group_code);
                res.body.should.have.property('user_group');
                res.body.user_group.user_group_code.should.be.eql(user_group_code);
                res.body.user_group.channels.should.have.length(1, "Channel not added to group!");
                channel_id_to_delete = res.body.channel._id;
                done();
            });
    });

    it('should get ALL a group\'s channels on /channels/usergroup_channels GET', (done) => {
        let newChannel = {
            name: "TestChannel2",
            description: "TestDescription",
            messages: [],
            user_group_code: user_group_code
        }
        chai.request(server)
            .post('/channels')
            .set('Authorization', token)
            .send(newChannel)
        .then( (res) => {
            channel_id = res.body.channel._id;
            expect(res).to.have.status(200);
            
            return chai.request(server)
                .get('/channels/usergroup_channels')
                .set('Authorization', token)
                .query({ user_group_code: user_group_code })
        })
        .then( (res) => {
            expect(res).to.have.status(200);
            expect(res.body.channels).to.have.length(2);
            done();
        })
        .catch( (err) => {
            throw err;
        })
    });

    it('should get all channels given a usegroup_code on /channels/usergroup GET', (done) => {
        chai.request(server)
            .get('/channels/usergroup')
            .set('Authorization', token)
            .query({ user_group_code: user_group_code })
        .then( (res) => {
            expect(res).to.have.status('200');
            expect(res.body).to.have.property('channels');
            expect(res.body.channels).to.have.length(2);
            done();
        })
        .catch( (err) => {
            throw err;
        })
    })

    it('should delete a channel and delete that channel ref from the userGroup on /channels DELETE', (done) => {
        query = {
            user_group_code: user_group_code,
            channel_id: channel_id_to_delete
        }
        chai.request(server)
            .del('/channels')
            .set('Authorization', token)
            .query(query)
            .then( (res) => {
                expect(res).to.have.status(200)
                expect(res.body.user_group.channels).to.have.length(1);
                done();
            }) 
            .catch( (err) => {
                throw err;
            })
    });

    it('should update a channel\'s description on /channels PUT', (done) => {
        const newDescription = "newDescription";
        data = {
            channel_id: channel_id,
            channel_edits: {
                description: newDescription
            }
        }
        chai.request(server)
            .put('/channels')
            .set('Authorization', token)
            .send(data)
            .then( (res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('channel');
                expect(res.body.channel.description).to.eql(newDescription);
                expect(res.body.channel.user_group_code).to.eql(user_group_code);
                done();
            }) 
            .catch( (err) => {
                throw err;
            });
    });

    it('should add a message to a channel on /channels/messages POST', (done) => {
        const msg = 'Message Content, 1234, 4567, 45,67';
        const newMessage = {
            user_name: 'USER_NAME',
            timestamp: Date(),
            content: msg,
            user_group_code: user_group_code
        }
        data = {
            channel_id: channel_id,
            new_message: newMessage
        }

        chai.request(server)
            .post('/channels/messages')
            .set('Authorization', token)
            .send(data)
            .then( (res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('channel');
                expect(res.body.channel.messages[0].content).to.eql(msg);
                expect(res.body.channel.messages[0].user_name).to.eql('USER_NAME');
                expect(res.body.channel.messages[0].user_group_code).to.eql(user_group_code);
                done();
            })
            .catch( (err) => {
                throw err;
                done(); 
            });
    });

    it('should retrieve all ONE messages on /channels/messages GET', (done) => {
        query = {
            channel_id: channel_id
        }
        chai.request(server)
            .get('/channels/messages')
            .set('Authorization', token)
            .query(query)
            .then( (res) => {
                expect(res).to.have.status(200)
                expect(res.body.messages).to.have.length(1);
                done();
            }) 
            .catch( (err) => {
                throw err;
            });
    });

    it('should return ONE message on /channel/messages/:search_string GET', (done) => {
        const search_string = '1234';
        query = {
            channel_id: channel_id,
            search_string: search_string
        }
        chai.request(server)
            .get('/channels/messages')
            .set('Authorization', token)
            .query(query)
            .then( (res) => {
                expect(res).to.have.status(200)
                console.log(res.body.messages);
                expect(res.body.messages).to.have.length(1);
                done()
            })
            .catch( (err) => {
                throw err;
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

