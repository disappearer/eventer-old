import * as request from 'supertest';
import { eventRepository } from '../../../../src/db/memory/InMemoryEventRepository';
import Event from '../../../../src/domain/entities/Event';
import { server } from '../../../../src/http/server';

describe('GET /api/events', () => {
  beforeAll(done => {
    server.eventRepository = eventRepository;
    done();
  });

  it('"/all" gets a list of all events', done => {
    request(server.app)
      .get('/api/events/all')
      .then(response => {
        expect(response.status).toEqual(200);
        eventRepository.getAll().then(events => {
          expect(JSON.stringify(response.body.events)).toEqual(
            JSON.stringify(events)
          );
          done();
        });
      });
  });

  it('"/future" gets a list of future events', done => {
    jasmine.clock().mockDate(new Date(Date.UTC(2017, 9, 16, 18, 0)));
    const now = new Date();
    request(server.app)
      .get('/api/events/future')
      .then(response => {
        expect(response.status).toEqual(200);
        eventRepository.getFuture().then(events => {
          expect(JSON.stringify(response.body.events)).toEqual(
            JSON.stringify(events)
          );
          done();
        });
      });
  });

  it('sends 404 if path param wrong', done => {
    request(server.app)
      .get(`/api/events/asdf`)
      .then(response => {
        expect(response.status).toEqual(404);
        expect(response.body.message).toEqual(
          `Wrong path parameter: "asdf". Currently accepted are "all" and "future"`
        );
        done();
      });
    request(server.app)
      .get(`/api/events/qwer`)
      .then(response => {
        expect(response.status).toEqual(404);
        expect(response.body.message).toEqual(
          `Wrong path parameter: "qwer". Currently accepted are "all" and "future"`
        );
        done();
      });
  });
});
