import * as request from 'supertest';
import { eventRepository } from '../../../src/db/InMemoryEventRepository';
import { userRepository } from '../../../src/db/InMemoryUserRepository';
import { server } from '../../../src/http/server';
import MockPassportStrategy from '../authentication/MockPassportStrategy';

var jsonEvents = require('../../../src/db/events.json').events;

describe('POST /events/:id/:action', () => {
  var agent = request.agent(server.app);
  var failStrategy: any, passStrategy: any;
  const USERID = 246,
    EVENTID = 1;

  beforeAll(done => {
    server.eventRepository = eventRepository;
    server.userRepository = userRepository;
    failStrategy = new MockPassportStrategy(
      { passAuthentication: false, userId: USERID },
      () => {}
    );
    passStrategy = new MockPassportStrategy(
      { passAuthentication: true, userId: USERID },
      (user: any, done: Function) => {
        userRepository.getById(user.id).then(user => {
          done(null, user);
        });
      }
    );
    done();
  });

  it('fails if not authorized', done => {
    server.setPassportStrategy(failStrategy);
    agent.get('/auth/mock').end(() => {
      agent.post('/events/1/join').then(response => {
        expect(response.status).toEqual(401);
        expect(response.body.error).toEqual('Error: User not authorized.');
        done();
      });
    });
  });

  it('updates user and event when authorized', done => {
    server.setPassportStrategy(passStrategy);
    agent
      .get('/auth/mock')
      .then(() => {
        return agent.post(`/events/${EVENTID}/join`);
      })
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
});
