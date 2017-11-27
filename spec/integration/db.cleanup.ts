import { MongoClient } from 'mongodb';

const url = process.env.DB_URL;
MongoClient.connect(url).then(db => {
  db.dropDatabase().then(() => {
    console.log(`Database: ${url} dropped.`);
    process.exit();
  });
});
