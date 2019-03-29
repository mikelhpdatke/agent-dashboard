const mongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/';

async function init() {
  const mongodb = await mongoClient.connect(url);
  const db = mongodb.db('AGENT');
  return db;
}

const answers = {
  async get_list_client() {
    const dbo = await init();
    const res = await dbo
      .collection('agent_info')
      .find()
      .toArray();
    return res;
  },
};

module.exports = answers;
