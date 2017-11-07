const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const dbconfig = require('./config/database')
const webconfig = require('./config/web')

// Connect to the MongoDB database via the configuration settings
mongoose.connect(dbconfig.database)

// On successful connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database ' + dbconfig.database);
});

// On connection error
mongoose.connection.on('error', (err) => {
    console.log('Database error: ' + err);
});

const app = express();

// Include users router
const users = require('./routes/users');

// Port number
const port = webconfig.port;
// const port = process.env.PORT || 8080; // For deployment to Heroku

// Cors Middleware
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Include the passport configuration
require('./config/passport')(passport);

// Any URL based on '/users/*' files pointed to by users
app.use('/users', users);

// Index Route
app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

// Start Server
app.listen(port, () => {
    console.log('Server started on port ' + port);
});