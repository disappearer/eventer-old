import * as request from 'superagent';
import { MongoClient, Db, ObjectID } from 'mongodb';

const url = process.env.DB_URL;

describe('"/events" route', () => {
  const baseUrl = process.env.EVENTER_URL;
  const agent = request.agent();
  var db: Db;
  var accessToken: string;

  beforeAll(done => {
    Promise.all([MongoClient.connect(url), agent.get(baseUrl + '/auth/mock')])
      .then(results => {
        db = results[0];
        accessToken = results[1].body.accessToken;
        done();
      })
      .catch(error => {
        console.log(error.message);
        done.fail();
      });
  });

  it('POST fails if not authenticated', done => {
    agent.post(baseUrl + '/events').catch(result => {
      expect(result.status).toEqual(401);
      done();
    });
  });

  it('POST fails if fields are missing', done => {
    return agent
      .post(baseUrl + `/events?access_token=${accessToken}`)
      .catch(result => {
        expect(result.status).toEqual(400);
        expect(result.response.body.message).toEqual(
          'Missing required fields for event creation.'
        );
        done();
      });
  });

  it('POST creates a new event', done => {
    var eventId: string;
    const eventInfo = {
      title: 'Some Event',
      date: new Date(),
      location: 'In the middle of nowhere',
      description: 'Some event in the middle of nowhere'
    };
    agent
      .post(baseUrl + `/events?access_token=${accessToken}`)
      .send(eventInfo)
      .then(response => {
        const event = response.body.event;
        eventId = event.id;
        expect(event.title).toEqual(eventInfo.title);
        expect(new Date(event.date)).toEqual(eventInfo.date);
        expect(event.description).toEqual(eventInfo.description);
        expect(event.location).toEqual(eventInfo.location);
        return db
          .collection('events')
          .find()
          .toArray();
      })
      .then(events => {
        expect(events.length).toEqual(1);
        expect(events[0].title).toEqual(eventInfo.title);
        expect(events[0].date).toEqual(eventInfo.date);
        expect(events[0].description).toEqual(eventInfo.description);
        expect(events[0].location).toEqual(eventInfo.location);
        expect(events[0]._id).toEqual(new ObjectID(eventId));
        done();
      });
  });

  afterAll(done => {
    Promise.all([
      db.collection('users').deleteMany({}),
      db.collection('google').deleteMany({})
    ]).then(() => {
      done();
    });
  });
});
