const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/agentdb');

const Md5Schema = new mongoose.Schema({
  ip: String,
  file: String,
  timestamp: Date,
  md5: String,
});
const PidSchema = new mongoose.Schema({
  ip: String,
  timestamp: Date,
  listOfPID: Array,
});

const SyscallSchema = new mongoose.Schema({
  ip: String,
  timestamp: Date,
  pid: String,
  cmdline: String,
  syscall: String,
})

module.exports = { SyscallSchema, Md5Schema, PidSchema };
