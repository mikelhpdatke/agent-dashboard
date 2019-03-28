require('rootpath')();

const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
require('./agentsController/agentsController.js');
// ///

const os = require('os');
const bodyParser = require('body-parser');
const cors = require('cors');

const errorHandler = require('./_helpers/error-handler');
// const jwt = require('./_helpers/jwt');

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(jsonParser);
app.use(urlencodedParser);
app.use(express.static('dist'));
app.use(cors());
// app.use(jwt());
app.use('/api/users', require('./users/users.controller'));

// app.post('/api/getClients', jsonParser, async (req, res) => {
//   const clients = await utils.getListOfClients();
//   // console.log(client);
//   res.json({ status: true, data: clients });
// });

// app.post('/api/installAgent', jsonParser, async (req, res) => {});

app.use(errorHandler);

app.get('/api/status', (req, res) => {
  res.send('ok');
});

server.listen(8081, () => console.log('Listening on port 8081!'));

io.on('connection', clientForUser => {
  //
  userClients = clientForUser;
  clientForUser.on('subscribeToTimer', () => {
    client.emit('timer', message);
  });

  clientForUser.on('alert', data => {
    // io.clients().emit('warning', 'alert');
    // clientForUser.emit('timmer', 'alert');
    // console.log(data);
    io.sockets.emit('timer', data);
  });
});
