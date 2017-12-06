import * as request from 'superagent';
import { MongoClient, Db } from 'mongodb';

const url = process.env.DB_URL;

describe('Mock Authentication', () => {
  const baseUrl = process.env.EVENTER_URL;
  const agent = request.agent();
  var db: Db;

  beforeAll(done=>{
    MongoClient.connect(url).then(database => {
      db = database;
      done();
    }).catch(error=>{
      console.log(error);
      done.fail();
    });
  });
  

  it('creates user if not in DB', done => {
    const usersCollection = db.collection('users');
    usersCollection.find().toArray().then(users=>{
      expect(users).toEqual([]);
      agent
      .get(baseUrl + '/auth/mock/')
      .then((res) => {
        expect(res.status).toEqual(200);
        usersCollection.find().toArray().then(users=>{
          expect(users.length).toEqual(1);
          done();
        });
      })
      .catch(e => {
        console.log(e);
        done.fail();
      });
    });
    
  });
});
