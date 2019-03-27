const mongoose = require('mongoose');
const md5 = require('md5');
const ObjectSchema = require('../Utils/Schema');

mongoose.connect('mongodb://localhost/agentdb');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
const Pid = mongoose.model('Pid', ObjectSchema.PidSchema);
const Md5 = mongoose.model('Md5', ObjectSchema.Md5Schema);
const Syscall = mongoose.model('Syscall', ObjectSchema.SyscallSchema);
// const Pid = mongoose.model('Pid', ObjectSchema.PidSchema);

db.once('open', () => {
  // we're connected!
  console.log('connected to database..');
  
  user1.save((err, user1) => {
    if (err) console.log(err);
    console.log('save ok');
  });
});
// console.log('end');
