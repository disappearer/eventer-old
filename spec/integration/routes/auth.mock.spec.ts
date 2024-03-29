import * as request from 'superagent';
import { MongoClient, Db } from 'mongodb';
import { accessToken, profile } from '../integration.test.setup';

const url = process.env.DB_URL;

describe('Mock Authentication', () => {
  const baseUrl = process.env.EVENTER_URL;
  const agent = request.agent();
  var db: Db;
  var accessToken: string;

  beforeAll(done => {
    MongoClient.connect(url)
      .then(database => {
        db = database;
        done();
      })
      .catch(error => {
        console.log(error.message);
        done.fail();
      });
  });

  it('creates (registers) user if not in DB', done => {
    const usersCollection = db.collection('users');
    usersCollection
      .find()
      .toArray()
      .then(users => {
        expect(users).toEqual([]);
        return agent.get(baseUrl + '/auth/mock/');
      })
      .then(res => {
        expect(res.status).toEqual(200);
        accessToken = res.body.accessToken;
        return usersCollection.find().toArray();
      })
      .then(users => {
        expect(users.length).toEqual(1);
        expect(users[0].accessToken).toEqual(accessToken);
        done();
      })
      .catch(e => {
        console.log(e.message);
        done.fail();
      });
  });

  it('authenticates user if already registered and saves user in the session', done => {
    const usersCollection = db.collection('users');
    usersCollection
      .find()
      .toArray()
      .then(users => {
        expect(users.length).toEqual(1);
        return agent.get(baseUrl + '/auth/mock/');
      })
      .then(response => {
        expect(response.status).toEqual(200);
        return usersCollection.find().toArray();
      })
      .then(users => {
        expect(users.length).toEqual(1);
        done();
      })
      .catch(e => {
        console.log(e.message);
        done.fail();
      });
  });
});
