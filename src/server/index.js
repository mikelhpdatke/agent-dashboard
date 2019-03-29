require('rootpath')();

const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const os = require('os');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const cors = require('cors');

const errorHandler = require('./_helpers/error-handler');

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(jsonParser);
app.use(urlencodedParser);
app.use(express.static('dist'));
app.use(cors());
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

let userClients;
let clients = [];

app.post('/api/users/getCurrentClients', (req, res) => {
  res.send(clients);
});

io.on('connection', clientForUser => {
  //
  userClients = clientForUser;
  clientForUser.on('subscribeToTimer', client => {
    client.emit('timer', message);
  });

  clientForUser.on('alert', data => {
    // io.clients().emit('warning', 'alert');
    // clientForUser.emit('timmer', 'alert');
    // console.log(data);
    io.sockets.emit('timer', data);
  });
});

const net = require('net');
const utils = require('./Utils/utils');

async function getListOfAgents() {
  clients = await utils.getListOfClients();
}

getListOfAgents();

const checkToWaitData = {};

net
  .createServer(socket => {
    socket.name = `${socket.remoteAddress}:${socket.remotePort}`;

    const newClient = {
      socket,
      address: socket.name,
      ip: socket.remoteAddress,
      port: socket.remotePort,
      active: true,
      currentTask: null,
    };

    socket.on('data', data => {
      const task = utils.getTask(clients, socket.name);
      const listClientForUser = io.sockets.clients();
      const currentClient = listClientForUser;
      const message = utils.storeData(socket.remoteAddress, task, data);
      if (checkToWaitData[socket.name] === true) {
        currentClient.emit('timer', `${message}\n`);
        checkToWaitData[socket.name] = false;
      }
    });

    socket.on('end', () => {
      for (let i = 0; i < clients.length; i += 1) {
        if (clients[i].socket === socket) {
          clients[i].active = false;
          clients[i].socket = '';
          clients[i].port = '';
          clients[i].address = '';
        }
      }
    });

    clients = utils.addClient(clients, newClient);
    // console.log(clients);

    function broadcast(message, sender) {
      clients.forEach(client => {
        if (client === sender) {
          return;
        }
        client.write(message);
      });
      process.stdout.write(message);
    }
  })
  .listen(8888);

function send_cmd(socket_name, task, message) {
  checkToWaitData[socket_name] = true;
  let client = null;
  for (let i = 0; i < clients.length; i += 1) {
    const socket = clients[i];
    if (socket.address === socket_name) {
      client = socket.socket;
      clients[i].currentTask = task;
      break;
    }
  }

  client.write(message);
}

function getClients() {
  const result_listOfAgent = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < clients.length; i++) {
    result_listOfAgent.push({
      ip: clients[i].ip,
      port: clients[i].port,
      address: clients[i].address,
      active: clients[i].active,
    });
  }

  // eslint-disable-next-line camelcase
  return result_listOfAgent;
}

console.log('Chat server running at port 8888\n');
