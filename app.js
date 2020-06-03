let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let channelsRouter = require('./routes/channels');
let recipeRankingRouter = require('./routes/recipe_ranking');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/channels', channelsRouter);
app.use('/api/recipe_ranking', recipeRankingRouter);

module.exports = app;

// docker run -d --name redis-test -p 6379:6379  -v /path/to/redisconf/redis.conf:/redis.conf redis redis-server /redis.conf