import { Db, Collection } from 'mongodb';
import { whenConnected } from '../../src/db/mongodb/mongodb.config';
import EventRepository from '../../src/db/mongodb/MongoEventRepository';
import Event from '../../src/domain/entities/Event';
import User from '../../src/domain/entities/User';

const jsonEvents = require('../../src/db/events.json');

describe('Mongo Repository', () => {
  var db: Db,
    testEvents: Collection,
    repoEvents: Array<Event>,
    eventRepository: EventRepository;

  beforeAll(done => {
    whenConnected.then(database => {
      db = database;
      db.createCollection('testEvents').then(collection => {
        testEvents = collection;
        eventRepository = new EventRepository(collection);
        const whenAdded: Array<
          Promise<Event>
        > = jsonEvents.events.map((eventInfo: any) => {
          const tempEvent = Object.assign(new Event(), eventInfo);
          tempEvent.date = new Date(eventInfo.date);
          return eventRepository.add(tempEvent);
        });
        Promise.all(whenAdded).then(events => {
          repoEvents = events;
          repoEvents.sort((e1, e2) => {
            return e1.date.getTime() - e2.date.getTime();
          });
          done();
        });
      });
    });
  });

  it('add() adds event to db', done => {
    testEvents
      .find()
      .toArray()
      .then(dbEvents => {
        dbEvents = dbEvents.map(e => {
          e.id = e._id;
          delete e._id;
          return Object.assign(new Event(), e);
        });
        repoEvents.forEach(repoEvent => {
          expect(dbEvents.find(dbEvent => dbEvent == repoEvent)).not.toBeNull();
        });
        done();
      });
  });

  it('getById() gets event by id or returns null if not found', done => {
    eventRepository
      .getById(0)
      .then(event => {
        expect(event).toBeNull();
        return eventRepository.getById(repoEvents[0].id);
      })
      .then(event => {
        expect(event).toEqual(repoEvents[0]);
        done();
      });
  });

  it('getAll() returns all events in chronological order', done => {
    eventRepository.getAll().then(events => {
      expect(events).toEqual(repoEvents);
      done();
    });
  });

  it('getFuture() returns all future events in chronological order', done => {
    jasmine.clock().mockDate(new Date(Date.UTC(2017, 9, 16, 18, 0)));
    const futureEvents = repoEvents.filter(event => event.date > new Date());

    eventRepository
      .getFuture()
      .then(events => {
        expect(events).toEqual(futureEvents);
        jasmine.clock().mockDate(new Date(Date.UTC(2018, 9, 16, 18, 0)));
        return eventRepository.getFuture();
      })
      .then(events => {
        expect(events).toEqual([]);
        jasmine.clock().mockDate(new Date(Date.UTC(2016, 9, 16, 18, 0)));
        return eventRepository.getFuture();
      })
      .then(events => {
        expect(events).toEqual(repoEvents);
        done();
      });
  });

  it('update() updates event', done => {
    const user = new User(111, [
      { provider: 'google', id: 222, email: 'user@gmail.com', name: 'Nobody' }
    ]);
    eventRepository
      .getById(repoEvents[0].id)
      .then(event => {
        expect(event.guestList.indexOf(user.id)).toBe(-1);
        event.addToGuestList(user);
        return eventRepository.update(event);
      })
      .then(event => {
        expect(repoEvents[0]).not.toEqual(event);
        expect(event.guestList.indexOf(user.id)).toBeGreaterThanOrEqual(0);
        done();
      });
  });

  afterAll(done => {
    testEvents.drop().then(() => {
      db.close();
      done();
    });
  });
});
