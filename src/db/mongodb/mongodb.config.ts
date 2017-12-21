import { MongoClient, Db, Collection } from 'mongodb';

const whenDb = MongoClient.connect(process.env.DB_URL);

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
