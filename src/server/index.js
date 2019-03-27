require('rootpath')();
const express = require('express');
// require('./agentsController/agentsController.js');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
// ///

const os = require('os');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./_helpers/error-handler');
const jwt = require('./_helpers/jwt');

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(jsonParser);
app.use(urlencodedParser);
app.use(express.static('dist'));
app.use(cors());
// app.use(jwt());
app.use('/api/users', require('./users/users.controller'));

app.post('/api/getClients', jsonParser, (req, res) => {
  console.log('??');
  res.end();
});
app.use(errorHandler);

// app.post('/api/users/register', jsonParser, (req, res) => {
//   console.log(req.body);
//   const { firstName, lastName, username, password } = req.body;
//   console.log(firstName, lastName, username, password);
//   res.status(200);
//   res.send({ status: 'okkkkkkkkkk' });
//   res.end();
// });

app.get('/api/status', (req, res) => {
  res.send('ok');
});

server.listen(8081, () => console.log('Listening on port 8081!'));

// io.on('connection', clientForUser => {
//   //
//   userClients = clientForUser;
//   clientForUser.on('subscribeToTimer', () => {
//     client.emit('timer', message);
//   });

//   clientForUser.on('alert', data => {
//     // io.clients().emit('warning', 'alert');
//     // clientForUser.emit('timmer', 'alert');
//     // console.log(data);
//     io.sockets.emit('timer', data);
//   });
// });
