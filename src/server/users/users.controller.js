const express = require('express');

const router = express.Router();
const userService = require('./user.service');

// routes
router.post('/authenticate', authenticate);
router.get('/', getAll);
router.post('/getClients', getClients);
router.post('/installAgent', installAgent);

module.exports = router;

function getClients(req, res, next) {
  userService
    .getClients()
    .then(result => {
      res.json({ status: true, data: result });
    })
    .catch(err => next(err));
}

function installAgent(req, res, next) {
  const { ipClient } = req.body;
  userService
    .installAgent({ ipClient })
    .then(result => {
      console.log(result);
      res.json({ status: true, data: result });
    })
    .catch(err => next(err));
}

function authenticate(req, res, next) {
  // console.log('helsasdl');
  console.log(req.body);
  userService
    .authenticate(req.body)
    .then(user =>
      user
        ? res.json(user)
        : res.status(400).json({ message: 'Username or password is incorrect' })
    )
    .catch(err => next(err));
}

function getAll(req, res, next) {
  console.log(req.user);
  userService
    .getAll()
    .then(users => res.json(users))
    .catch(err => next(err));
}
