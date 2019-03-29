const mongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/';
let dbo;

async function init() {
  const mongodb = await mongoClient.connect(url);
  dbo = mongodb.db('agent_log');
}

init();

const answers = {
  async push(cname, data) {
    const res = await dbo.collection(cname).insertOne(data);
    return res;
  },

  async get(cname) {
    const res = await dbo
      .collection(cname)
      .find()
      .toArray();
    return res;
  },
};

module.exports = answers;
