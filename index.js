import 'regenerator-runtime/runtime';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import Cors from 'cors';
import path from 'path';
import logger from 'morgan';
import debug from 'debug';
import mongoose from 'mongoose';
import 'dotenv/config';
import routes from './routers';

const log = debug('server');

const PORT = process.env.PORT || 4000;

// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length;

// if (cluster.isMaster) {
//   log(`Master ${process.pid} is running`);

//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker /* , code, signal */) => {
//     log(`worker ${worker.process.pid} died`);
//   });
// } else {
mongoose.connect('mongodb://localhost:27017/fansclub', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

mongoose.connection.on('connected', () => {
  log('MongoDB connected');
});

mongoose.connection.on('disconnected', () => {
  log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  log('MongoDB reconnected');
});

mongoose.connection.on('error', err => {
  log(`MongoDB error: ${err}`);
});

const app = express();
app.use(express.static(path.resolve('react', 'build')));
app.use(Cors());
// app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger('dev'));

app.use(Cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
  console.log(__dirname);
  console.log('got the req address :: ', path.join(__dirname, 'react', 'build', 'index.html'));
  res.sendFile(path.resolve('react', 'build', 'index.html'));
});

app.get('/club', (req, res) => {
  console.log(__dirname);
  console.log('got the req address :: ', path.join(__dirname, 'react', 'build', 'index.html'));
  res.sendFile(path.resolve('react', 'build', 'index.html'));
});

app.get('/v/*', (req, res) => {
  console.log(__dirname);
  console.log('got the req address :: ', path.join(__dirname, 'react', 'build', 'index.html'));
  res.sendFile(path.resolve('react', 'build', 'index.html'));
});

app.get('/auth/*', (req, res) => {
  console.log(__dirname);
  console.log('got the req address :: ', path.join(__dirname, 'react', 'build', 'index.html'));
  res.sendFile(path.resolve('react', 'build', 'index.html'));
});

app.use('/api/v1', routes.v1);

// app.use('/user', routes.user);
// app.use('/club', routes.club);
// app.use('/tiles', routes.tiles);
// app.use('/geo', routes.geo);

app.listen(PORT, () => log(`Listening on port ${PORT}`));

// log(`Worker ${process.pid} started`);
// }
