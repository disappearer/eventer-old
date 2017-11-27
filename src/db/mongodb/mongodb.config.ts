import { MongoClient, Db, Collection } from 'mongodb';

const url = process.env.DB_URL;

const whenConnected = MongoClient.connect(url).then(db => {
  return Promise.resolve(db);
});

const whenCollections = whenConnected.then(db => {
  const whenEventCollection = db.createCollection('events');
  const whenUserCollection = db.createCollection('users');
  const whenGoogleCollectin = db.createCollection('google');
  return Promise.all([
    whenEventCollection,
    whenUserCollection,
    whenGoogleCollectin
  ]);
});

export { whenConnected, whenCollections };
