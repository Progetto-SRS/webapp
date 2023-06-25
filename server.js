#!/usr/bin/env node
'use strict';

const express = require('express'); 
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var RateLimit = require('express-rate-limit');
const helmet = require('helmet')




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

var limiter = RateLimit({
    windowMs: 1*60*1000, // 1 minute
    max: 1000000000
  });


  app.use(helmet.frameguard())
  app.use(helmet())

  app.use(
    helmet({
    contentSecurityPolicy: {
        directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "https://use.fontawesome.com/releases/v6.3.0/js/all.js", "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js", "https://cdn.jsdelivr.net/npm/sweetalert2@11"],
        "style-src": ["'self'", "'unsafe-hashes'", "https://fonts.googleapis.com/", "https://cdn.jsdelivr.net/", "'sha256-Jc7XaRBVYMy6h6FvjL32miHrOGOxYV+OP4swZ/9Gysw='", "'sha256-W3tWEOJiO3ZTcqvnkpTB5C2PlIns5RvN9Izb9rlyatk='", "'sha256-O/GGR/+AnJgPWWvk5AiFjzoqSwcI2JErAgAg5tDDckI='", "'sha256-R+j6NQzJkNwWKkGgaf5bHf7ahm3K74JapNVlxqCeBYk='", "'sha256-Insxnoa2NVdEsedbK1Vic5YdAwRJL0Z/3mGjQSg8CAg='", "'sha256-O2+tCymNJNXAt1PNeGpUdjx9tYTHtsUHA3yHgvt0o98='", "'sha256-C1Wm2thZBI0ZnFrVeGrUcPYUjGDDKSysR0ReamqR6+o='", "'sha256-z4w21HkwFSjKJ11qtfcblSXcVk5tq8MSm9mptoIdIjo='", "'sha256-6kyk1L/KT1ROqx+M13bVf8aiRv6D/5SWn/9W2F1uiKg='", "'sha256-iycC9+figSze82zUgT8sJhE7Jd36IKLDjNwTVxRFoW0='" 
                       , "'sha256-b2cYTrXOXPMAX1LENRu9Od4jkDpHrTe/Q1oNTy89rKk='", "'sha256-U6lgpdmyJsluTDoH4kwD0JSWt4D6/aNxbWiSEu1sth0='", "'sha256-DMyIUGEpI2cVY8f6ETa2uyEDZsagiosmJzY/VH73bAA='", "'sha256-SyJySKAQlV+CjUj10UhuDMZkFacN+tMR56xQ1opONvs='", "'sha256-nentKI3AonBil9U9z40gQWY9+GPH6+nYAr9p6EOCfbU='", "'sha256-vEd8tvEGbf045lmYg1z2/HzDFur6PYcB8ktZecS58dw='",
                    "'sha256-q4EY/AXymGxhYVm0SvOALBywrUMguozfaOWrsdIzjHA='", "'sha256-zHXAmDrNxTAQhDr6lPfPQduSjn2o9s87I4BrhUzdzOk='", "'sha256-pOfy5lld0TbaymjgQBa5+sjHuNbErQdWG+QRWyNOBbc='", "'sha256-38EBcaq+4zBMvV3b/V/OH8kNCe6lPH+GqRwcTS7sIlU='",
                    "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='", "'sha256-FmR4/cBSyYRQNX8qrRAFeDOZPwBSrTtHuFilHpqzeY8='", "'sha256-4bg1Ux96rR/xvo2/PjxBv++eiI5IQbfNEhbsCfnOi+g='","'sha256-0EZqoz+oBhx7gF4nvY2bSqoGyy4zLjNF+SDQXGp/ZrY='","'sha256-k9NYjv0q6TBIF0NaYyWneWIh2m+EHtifJL2B3n+inh4='","'sha256-B1jkmC3FZBu7IAEae40GAnNizFTgKipeerH6tYSRYy8='","'sha256-SzIiWi8iV2OvVRQr0zxoPak8EUYS1qc4eHCkbcZPS7U='","'sha256-xyfZyrjU0RE7mLhhX81xmb3hJQ1bQvuOgyJmoRQvHuM='","'sha256-xyfZyrjU0RE7mLhhX81xmb3hJQ1bQvuOgyJmoRQvHuM='","'sha256-PGDxms1YBzynm3tEXhJbwKDCURmhpFJiSBUtPt44rvw='","'sha256-xyfZyrjU0RE7mLhhX81xmb3hJQ1bQvuOgyJmoRQvHuM='","'sha256-ydkwuGx+QND5hp7PkSuSpOuN5QJiQN8MNtu7qoC3VdQ='","'sha256-hiNL7VVeComdAwUNQK6sNJuMx4k2tIawZ7/TzmIfU6Q='"],
        "font-src": ["'self'", "https://fonts.googleapis.com/", "https://fonts.gstatic.com/"],
        "form-action": ["'self'"],
        //"img-src": ["'self", "http://www.w3.org/2000/svg", ".\public\img"],
        "connect-src": ["self", "https://dev-functions-srs.azurewebsites.net/", "https://dev-app-srs.azurewebsites.net/","https://test-app-srs.azurewebsites.net/","https://test-functions-srs.azurewebsites.net/", "https://prod-app-srs.azurewebsites.net/", "https://prod-functions-srs.azurewebsites.net/"], //"http://localhost:8080"
        },
    },
    })
);
  


/*  const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');

  app.use(expressCspHeader({
      directives: {
          'default-src': [SELF],
          'script-src': [SELF, INLINE, 'https://use.fontawesome.com/releases/v6.3.0/js/all.js','https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js','https://use.fontawesome.com/releases/v6.3.0/js/all.js', 'https://cdn.jsdelivr.net/npm/sweetalert2@11'], 
          'style-src': [SELF, INLINE, 'https://fonts.googleapis.com','https://fonts.gstatic.com','https://cdn.jsdelivr.net',],
          'worker-src': [NONE],
          'img-src': [SELF],

          'block-all-mixed-content': true,
          'font-src' : [SELF, 'https://fonts.googleapis.com','https://fonts.gstatic.com'],
          'connect-src':[SELF, 'https://dev-functions-srs.azurewebsites.net']
      }
  }));*/

app.use(limiter);
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
