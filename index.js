require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const APIError = require('./utils/apiError');
const globalErrorHandler = require('./controllers/errorController');

// Middleware 
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// routes
const tour = require('./routes/tours');

// routes middlewares
app.use('/api/v1/tour', tour);

// Error for invalid path
app.all('*', (req, res, next) => {
    next(new APIError(`Cannot find ${req.originalUrl} on this server`, 404))
});

// Global error middleware
app.use(globalErrorHandler);

const DbURI = 'mongodb://localhost/natour';

// DB connexion
mongoose.connect(DbURI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

mongoose.connection.on('connected', () => {
console.log(`Mongoose connected to ${DbURI}`);
});

mongoose.connection.on('error', err => {
console.log(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
console.log('Mongoose disconnected');
});

const gracefulShutdown = (msg, callback) => {
mongoose.connection.close( () => {
console.log(`Mongoose disconnected through ${msg}`);
callback();
});
    
const readLine = require ('readline');
if (process.platform === 'win32'){
const rl = readLine.createInterface ({
input: process.stdin,
output: process.stdout
});
rl.on ('SIGINT', () => {
process.emit ("SIGINT");
});
}
}

// Express Listening
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
});