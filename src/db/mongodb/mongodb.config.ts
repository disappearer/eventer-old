import { MongoClient, Db } from 'mongodb';

const url = 'mongodb://localhost:27017/eventer';

var database: Db;
var whenConnected = MongoClient.connect(url).then(db => {
  database = db;
  return Promise.resolve(db);
});

export { database as db, whenConnected };
