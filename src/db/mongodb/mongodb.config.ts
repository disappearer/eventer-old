import { MongoClient, Db, Collection } from 'mongodb';

var whenDb = MongoClient.connect(process.env.DB_URL);

var db: Db;

const connectionEstablished = new Promise(resolve => {
  connectWithRetry();

  function connectWithRetry() {
    whenDb
      .then(database => {
        console.log('Connected to the database.');
        db = database;
        const whenCollections = Promise.all([
          db.createCollection('events'),
          db.createCollection('users'),
          db.createCollection('google')
        ]);
        resolve(whenCollections);
      })
      .catch(error => {
        console.log(error.message, ' Reconnecting...');
        whenDb = MongoClient.connect(process.env.DB_URL);
        setTimeout(connectWithRetry, 1000);
      });
  }
});

export { whenDb, connectionEstablished };
