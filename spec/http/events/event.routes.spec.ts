import * as request from 'supertest';
import { eventRepository } from '../../../src/db/InMemoryEventRepository';
import Event from '../../../src/domain/entities/Event';
import Server from '../../../src/http/server';

var jsonEvents = require('../../../src/db/events.json').events;

describe('Route /events', () => {
  const server = Server.bootstrap();

  describe('GET', () => {
    it('gets a list of all events', done => {
      request(server.app)
        .get('/events')
        .then(response => {
          expect(response.body.events).toEqual(jsonEvents);
          done();
        });
    });
  });
});
