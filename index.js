const restify   = require('restify');
const mongoose  = require('mongoose');
const dotenv    = require('dotenv');
const config    = require('./config');
const rjwt      = require('restify-jwt-community');

const server = restify.createServer();
dotenv.config();

// Middleware
server.use(restify.plugins.bodyParser());

// Protect routes
server.use(rjwt({ secret: process.env.JWT_SECRET }).unless({ path: ['/auth']}));

server.listen(config.PORT, () => {
  mongoose.set('useFindAndModify', false);
  mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});
});

const db = mongoose.connection;

db.on('error', (err) => console.log(err));

db.once('open', () => {
  require('./routes/customers')(server);
  require('./routes/users')(server);
  console.log(`Server started on port ${config.PORT}`);
})