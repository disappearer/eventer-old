import * as request from 'supertest';
import InMemoryEventRepository from '../../../../src/db/memory/InMemoryEventRepository';
import { userRepository } from '../../../../src/db/memory/InMemoryUserRepository';
import Event from '../../../../src/domain/entities/Event';
import { server } from '../../../../src/http/server';

describe('POST /events', () => {
  var agent = request.agent(server.app);
  const USERID = 246,
    ACCESS_TOKEN = 'randomString2';

  beforeAll(done => {
    server.eventRepository = new InMemoryEventRepository();
    server.userRepository = userRepository;
    done();
  });

  it('fails if not authorized', done => {
    agent.post('/events/').then(response => {
      expect(response.status).toEqual(401);
      done();
    });
  });

  it('creates new event in repo, returns it as json, and returns 200', done => {
    const eventInfo = {
      title: 'Some Event',
      date: new Date(),
      location: 'In the middle of nowhere',
      description: 'Some event in the middle of nowhere'
    };
    agent
      .post(`/events?access_token=${ACCESS_TOKEN}`)
      .send(eventInfo)
      .then(response => {
        expect(response.status).toEqual(200);
        const event = response.body.event;
        expect(event.creatorId).toEqual(USERID);
        expect(event.title).toEqual(eventInfo.title);
        expect(event.date).toEqual(eventInfo.date.toJSON());
        expect(event.location).toEqual(eventInfo.location);
        expect(event.description).toEqual(eventInfo.description);
        expect(event.guestList).toEqual([USERID]);
        done();
      });
  });

  it('fails if a required field is missing', done => {
    const eventInfo = {
      // no title field
      date: new Date(),
      location: 'In the middle of nowhere',
      description: 'Some event in the middle of nowhere'
    };
    agent
      .post(`/events?access_token=${ACCESS_TOKEN}`)
      .send(eventInfo)
      .then(res => {
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual(
          'Missing required fields for event creation.'
        );
        done();
      });
  });
});
