import * as request from 'supertest';
import { eventRepository } from '../../../../src/db/memory/InMemoryEventRepository';
import { userRepository } from '../../../../src/db/memory/InMemoryUserRepository';
import { server } from '../../../../src/http/server';

describe('POST /api/events/:id/:action', () => {
  var agent = request.agent(server.app);
  const USERID = 246,
    EVENTID = 1,
    ACCESS_TOKEN = 'randomString2';

  beforeAll(done => {
    server.eventRepository = eventRepository;
    server.userRepository = userRepository;
    done();
  });

  it('fails if not authorized', done => {
    agent.post('/api/events/1/join').then(response => {
      expect(response.status).toEqual(401);
      done();
    });
  });

  it('updates user and event when authorized', done => {
    return agent
      .post(`/api/events/${EVENTID}/join?access_token=${ACCESS_TOKEN}`)
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.user.eventsJoined).toContain(EVENTID);
        expect(response.body.event.guestList).toContain(USERID);
        userRepository
          .getById(USERID)
          .then(user => {
            expect(JSON.stringify(response.body.user)).toEqual(
              JSON.stringify(user)
            );
            return eventRepository.getById(EVENTID);
          })
          .then(event => {
            expect(JSON.stringify(response.body.event)).toEqual(
              JSON.stringify(event)
            );
            done();
          });
      });
  });

  it('fails with 400 status code if trying to join already joined event', done => {
    return agent
      .post(`/api/events/${EVENTID}/join?access_token=${ACCESS_TOKEN}`)
      .then(res => {
        expect(res.status).toEqual(400);
        done();
      });
  });
});
