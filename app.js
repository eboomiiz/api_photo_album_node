const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const passport = require('passport')

//การรักษาความปลอดภัยให้ wppapp
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require('cors')
const corsOptions = {
  origin: ['https://my-photos-album.netlify.app','http://localhost:3000'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

//require config
const config = require('./config/index')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const introductionRouter = require('./routes/introduction')
const albumphotoRouter = require('./routes/albumphoto')
const photoRouter = require('./routes/photo')
const apiRouter = require('./routes/apiversion')

//import middleware
const errorHandler = require('./middleware/errorHandler')

const app = express();

//การรักษาความปลอดภัย
app.use(cors(corsOptions))

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });

  //  apply to all requests
  app.use(limiter);

app.use(helmet());

mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(logger('dev'));
app.use(express.json({
    limit: '50mb'
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//init passport
app.use(passport.initialize())

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/introduction', introductionRouter)
app.use('/albumphoto', albumphotoRouter)
app.use('/photo', photoRouter)
app.use('/apiversion', apiRouter)

app.use(errorHandler)

module.exports = app;
