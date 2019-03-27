const net = require('net');
const utils = require('../Utils/utils');

let clients = [];
async function getListOfAgents() {
  clients = await utils.getListOfClients();
}

getListOfAgents();

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
      listClientForUser = io.sockets.clients();
      currentClient = listClientForUser;
      message = utils.storeData(socket.remoteAddress, task, data);
      if (checkToWaitData[socket.name] == true) {
        currentClient.emit('timer', `${message}\n`);
        checkToWaitData[socket.name] = false;
      }
    });

    socket.on('end', () => {
      for (let i = 0; i < clients.length; i++) {
        if (clients[i].socket === socket) {
          clients[i].active = false;
          clients[i].socket = '';
          clients[i].port = '';
          clients[i].address = '';
        }
      }
    });

    clients = utils.addClient(clients, newClient);

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
  for (let i = 0; i < clients.length; i++) {
    const socket = clients[i];
    if (socket.address == socket_name) {
      client = socket.socket;
      clients[i].currentTask = task;
      break;
    }
  }

  client.write(message);
}

function getClients() {
  const result_listOfAgent = [];
  for (let i = 0; i < clients.length; i++) {
    result_listOfAgent.push({
      ip: clients[i].ip,
      port: clients[i].port,
      address: clients[i].address,
      active: clients[i].active,
    });
  }

  return result_listOfAgent;
}

console.log('Chat server running at port 8888\n');
