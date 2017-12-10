import * as request from 'supertest';
import InMemoryEventRepository from '../../../../src/db/memory/InMemoryEventRepository';
import { userRepository } from '../../../../src/db/memory/InMemoryUserRepository';
import Event from '../../../../src/domain/entities/Event';
import { server } from '../../../../src/http/server';
import MockPassportStrategy from '../../../../src/http/authentication/passportStrategies/MockPassportStrategy';

describe('POST /events', () => {
  var agent = request.agent(server.app);
  var failStrategy: any, passStrategy: any;
  const USERID = 246;

  beforeAll(done => {
    server.eventRepository = new InMemoryEventRepository();
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

  afterEach(done=>{
    agent.get('/signout').then(()=>{
      done();
    });
  });

  it('fails if not authorized', done => {
    server.setPassportStrategy(failStrategy);
    agent.get('/auth/mock').end(() => {
      agent.post('/events/').then(response => {
        expect(response.status).toEqual(401);
        expect(response.body.error).toEqual('Error: User not authorized.');
        done();
      });
    });
  });

  it('creates new event in repo, returns it as json, and returns 200', done => {
    const eventInfo = {
      title: 'Some Event',
      date: new Date(),
      location: 'In the middle of nowhere',
      description: 'Some event in the middle of nowhere'
    };
    server.setPassportStrategy(passStrategy);
    agent.get('/auth/mock').end(() => {
      agent
        .post('/events/')
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
  });

  it('fails if a required field is missing', done => {
    const eventInfo = {
      // no title field
      date: new Date(),
      location: 'In the middle of nowhere',
      description: 'Some event in the middle of nowhere'
    };
    server.setPassportStrategy(passStrategy);
    agent.get('/auth/mock').end(() => {
      agent
        .post('/events/')
        .send(eventInfo)
        .then((res) => {
          expect(res.status).toEqual(400);
          expect(res.text).toEqual('Missing required fields for event creation.');
          done();
        });
    });
  });
});
