import { Db, Collection } from 'mongodb';
import { whenDb } from '../../../src/db/mongodb/mongodb.config';
import EventRepository, {
  toDomainEvent
} from '../../../src/db/mongodb/MongoEventRepository';
import Event from '../../../src/domain/entities/Event';
import User from '../../../src/domain/entities/User';

const jsonEvents = require('../../../src/db/events.json');

describe('Mongo Events Repository', () => {
  var db: Db,
    testEvents: Collection,
    repoEvents: Array<Event>,
    eventRepository: EventRepository;

  beforeAll(done => {
    whenDb.then(database => {
      db = database;
      db.createCollection('testEvents').then(collection => {
        testEvents = collection;
        eventRepository = new EventRepository(collection);
        const whenAdded: Array<Promise<Event>> = jsonEvents.events.map(
          (eventInfo: any) => {
            const tempEvent = Object.assign(new Event(), eventInfo);
            tempEvent.date = new Date(eventInfo.date);
            return eventRepository.add(tempEvent);
          }
        );
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

  it('can adds events to db', done => {
    testEvents
      .find()
      .toArray()
      .then(dbEvents => {
        dbEvents = dbEvents.map(toDomainEvent);
        repoEvents.forEach(repoEvent => {
          expect(dbEvents.find(dbEvent => dbEvent == repoEvent)).not.toBeNull();
        });
        done();
      });
  });

  it('can get event by id or return null if not found', done => {
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

  it('can get all events in chronological order', done => {
    eventRepository.getAll().then(events => {
      expect(events).toEqual(repoEvents);
      done();
    });
  });

  it('can return all future events in chronological order', done => {
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

  it('can update event', done => {
    const user = new User(111, [
      { provider: 'google', id: 222, email: 'user@gmail.com', name: 'Nobody' }
    ]);
    eventRepository
      .getById(repoEvents[0].id)
      .then(event => {
        expect(event.guestList.indexOf(user.id)).toBe(-1);
        event.addToGuestList(user);
        return eventRepository.updateGuestList(event);
      })
      .then(event => {
        expect(repoEvents[0]).not.toEqual(event);
        expect(event.guestList.indexOf(user.id)).toBeGreaterThanOrEqual(0);
        testEvents.findOne({ _id: event.id }).then(dbEvent => {
          expect(event).toEqual(toDomainEvent(dbEvent));
          done();
        });
      });
  });

  afterAll(done => {
    testEvents.drop().then(() => {
      done();
    });
  });
});
