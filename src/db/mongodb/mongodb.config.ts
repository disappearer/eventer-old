import { MongoClient, Db, Collection } from 'mongodb';

const url = process.env.DB_URL;

const whenDb = MongoClient.connect(url);

const whenCollections = whenDb.then(db => {
  const whenEventCollection = db.createCollection('events');
  const whenUserCollection = db.createCollection('users');
  const whenGoogleCollectin = db.createCollection('google');
  return Promise.all([
    whenEventCollection,
    whenUserCollection,
    whenGoogleCollectin
  ]);
});

export { whenDb, whenCollections };
