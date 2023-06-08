#!/usr/bin/env node
'use strict';

const express = require('express'); 
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require('dotenv').config()

const AuthRoute = require ('./routes/auth');
const Route =require('./routes/route');
const authenticate = require('./middleware/authenticate');


mongoose.connect(process.env.AZURE_COSMOS_CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true}); //USE THIS ON AZURE
//mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true}); //USE THIS FOR TEST ONLY

const db = mongoose.connection;

db.on('error', (err) =>{
    console.log(err)
});

db.once('open',()=>{
    console.log('DB connection Established')
});

//Constants
const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0"; 

//App
const app = express();
app.use(morgan('dev')); //combined o common for production
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static('public'))

app.get('/',(req, res) =>{
    res.sendFile('welcome.html',{root: __dirname + '/public'});
});

app.get('/login',(req, res) =>{
    res.sendFile('login.html',{root: __dirname + '/public'});
});

app.get('/signup',(req, res) =>{
    res.sendFile('signup.html',{root: __dirname + '/public'});
});

app.get('/user_env',authenticate,(req, res) =>{
    res.sendFile('user_env.html',{root: __dirname + '/public'});
});


app.listen(PORT, HOST, ()=>{
    console.log(`Running on http://${HOST}:${PORT}`);
});

app.use('/api', AuthRoute)
app.use('/api', Route)
