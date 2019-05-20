const restify   = require('restify');
const mongoose  = require('mongoose');
const dotenv    = require('dotenv');
const config    = require('./config');

const server = restify.createServer();
dotenv.config();

// Middleware
server.use(restify.plugins.bodyParser());

server.listen(config.PORT, () => {
  mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});
});

const db = mongoose.connection;

db.on('error', (err) => console.log(err));

db.once('open', () => {
  require('./routes/customers')(server);
  console.log(`Server started on port ${config.PORT}`);
})