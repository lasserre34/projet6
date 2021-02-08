const mongoose = require('mongoose')
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const dotenv = require('dotenv').config() ;
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const sauceRoutes = require('./routes/sauce')
const userRoutes = require('./routes/user')
 
mongoose.connect(`mongodb+srv://${process.env.USERNAME_DB}:${process.env.PASSWORD_DB}@cluster0.22skx.mongodb.net/projet6?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use(bodyParser.json());
// helmet 
app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
  

// SECURITER FORCE BRUTE
const apiLimiter =
rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
 max: 100 ,
})

  app.use('/images', apiLimiter, express.static(path.join(__dirname, 'images')));
  app.use('/api/auth', apiLimiter,  userRoutes );
  app.use('/api', apiLimiter, sauceRoutes);
 
  module.exports = app;