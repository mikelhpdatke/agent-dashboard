const jwt = require('jsonwebtoken');
const { exec } = require('child_process');
const path = require('path');
const config = require('../config.json');
const utils = require('../Utils/utils');
// users hardcoded for simplicity, store in a db for production applications
const users = [
  {
    id: 1,
    username: 'test',
    password: 'test',
    firstName: 'Test',
    lastName: 'User',
  },
  {
    id: 1,
    username: 'admin',
    password: 'admin',
    firstName: 'admin',
    lastName: 'admin',
  },
];

module.exports = {
  authenticate,
  getAll,
  installAgent,
  getClients,
};

async function getClients() {
  return utils.getListOfClients();
}

async function installAgent({ ipClient }) {
  // console.log(__dirname);
  // console.log(ipClient);
  const filePath = path.resolve(__dirname, '../InstallAgent.py');
  return new Promise((resolve, reject) => {
    exec(`python2 ${filePath} ${ipClient}`, (err, stdout, stderr) => {
      console.log(err, stdout, stderr);
      if (err) reject(err);
      resolve(stdout);
    });
  });
}
async function authenticate({ username, password }) {
  const user = users.find(
    u => u.username === username && u.password === password
  );
  if (user) {
    // console.log('match?/');
    const token = jwt.sign({ sub: user.id }, config.secret);
    const { password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      token,
    };
  }
}

async function getAll() {
  return users.map(u => {
    const { password, ...userWithoutPassword } = u;
    return userWithoutPassword;
  });
}
