import * as request from 'supertest';
import { eventRepository } from '../../../src/db/InMemoryEventRepository';
import Event from '../../../src/domain/entities/Event';
import { server } from '../../../src/http/server';

var jsonEvents = require('../../../src/db/events.json').events;

describe('GET /events', () => {
  beforeAll(done => {
    server.eventRepository = eventRepository;
    jsonEvents.sort((e1: any, e2: any) => {
      return new Date(e1.date).getTime() - new Date(e2.date).getTime();
    });
    done();
  });

  it('"/all" gets a list of all events', done => {
    request(server.app)
      .get('/events/all')
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.events).toEqual(jsonEvents);
        done();
      });
  });

  it('"/future" gets a list of future events', done => {
    jasmine.clock().mockDate(new Date(Date.UTC(2017, 9, 16, 18, 0)));
    const now = new Date();
    const futureEvents = jsonEvents.filter(
      (event: any) => new Date(event.date) > now
    );
    request(server.app)
      .get('/events/future')
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.events).toEqual(futureEvents);
        done();
      });
  });

  it('sends 404 if path param wrong', done => {
    request(server.app)
      .get(`/events/asdf`)
      .then(response => {
        expect(response.status).toEqual(404);
        expect(response.body.error).toEqual(
          `Wrong path parameter: "asdf". Currently accepted are "all" and "future"`
        );
        done();
      });
    request(server.app)
      .get(`/events/qwer`)
      .then(response => {
        expect(response.status).toEqual(404);
        expect(response.body.error).toEqual(
          `Wrong path parameter: "qwer". Currently accepted are "all" and "future"`
        );
        done();
      });
  });
});
