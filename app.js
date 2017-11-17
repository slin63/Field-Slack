const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const dbconfig = require('./config/database')
const webconfig = require('./config/web')


let port = webconfig.port;
let db = dbconfig.database;

// Check if we're running tests
if (process.env.NODE_ENV == 'test') {
    port = webconfig.port_test;
    db = dbconfig.database_test;
}

// Connect to the MongoDB database via the configuration settings
mongoose.connect(db)

// On successful connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database ' + db);
});

// On connection error
mongoose.connection.on('error', (err) => {
    console.log('Database error: ' + err);
});

const server = express();

// Cors Middleware
server.use(cors());

// Set static folder
server.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json());

// Passport Middleware
server.use(passport.initialize());
server.use(passport.session());

// Include the passport configuration
require('./config/passport')(passport);

// Routers
const users = require('./routes/users');
const usergroups = require('./routes/usergroups');
const channels = require('./routes/channels');

// Any URL based on '/users/*' files pointed to by users
server.use('/users', users);
server.use('/usergroups', usergroups);
server.use('/channels', channels);

// Index Route
server.get('/', (req, res) => {
    res.send('Invalid Endpoint');
});

server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

// Start Server
server.listen(port, () => {
    console.log('Server started on port ' + port);
});

module.exports = server