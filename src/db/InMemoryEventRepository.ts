import EventRepository from '../domain/repositories/EventRepository';
import RepositoryError from '../domain/repositories/RepositoryError';
import Event from '../domain/entities/Event';

export default class InMemoryEventRepository implements EventRepository {
  events: Array<Event>;

  constructor() {
    this.events = [];
  }

  createEvent(id: number) {
    return new Event(
      id,
      123 + id,
      'Event' + id,
      'Event with id: ' + id,
      new Date(),
      id + ' Baker Street'
    );
  }

  getById(id: number): Promise<Event> {
    return new Promise(resolve => {
      if (id in this.events) return resolve(this.cloneEvent(this.events[id]));
      const event = this.createEvent(id);
      this.events[id] = event;
      resolve(this.cloneEvent(event));
    });
  }

  findOne(query: any): Promise<Event> {
    return new Promise(resolve => {
      const returnEvent = this.events.find(event => {
        return false;
      });
      resolve(returnEvent && this.cloneEvent(returnEvent));
    });
  }

  add(event: Event): Promise<Event> {
    return new Promise(resolve => {
      var returnEvent = this.cloneEvent(event);
      returnEvent.id = this.events.length;
      this.events.push(returnEvent);
      resolve(this.cloneEvent(returnEvent));
    });
  }

  update(event: Event): Promise<Event> {
    return new Promise((resolve, reject) => {
      if (!(event.id in this.events)) {
        reject(
          new RepositoryError(
            'UpdatingNonExistingEventException',
            event.id,
            event.constructor.name
          )
        );
      }

      this.events[event.id] = this.cloneEvent(event);
      resolve(event);
    });
  }

  delete(event: Event) {
    return new Promise((resolve, reject) => {
      if (!(event.id in this.events))
        reject(
          new RepositoryError(
            'DeletingNonExistingEventException',
            event.id,
            event.constructor.name
          )
        );
      this.events.splice(event.id, 1);
      resolve();
    });
  }

  getAll(): Promise<Array<Event>> {
    return new Promise(resolve => {
      var eventList = this.events.map(event => {
        return this.cloneEvent(event);
      }, this);
      eventList.sort((e1, e2) => {
        return e1.date - e2.date;
      });
      resolve(eventList);
    });
  }

  getFuture(): Promise<Array<Event>> {
    return new Promise(resolve => {
      var eventList = this.events.map(event => {
        return this.cloneEvent(event);
      }, this);
      eventList.sort((e1, e2) => {
        return e1.date - e2.date;
      });
      const now = new Date();
      resolve(
        eventList.filter(event => {
          return event.date > now;
        })
      );
    });
  }

  cloneEvent(event: Event) {
    return Object.assign(Object.create(event), event);
  }
}

/*
 * An instance with preloaded data from event.json for testing purposes.
 */

/* exported singleton */
export const eventRepository = new InMemoryEventRepository();

/* read json and create Date fields */
var jsonEvents = require('./events.json').events;
eventRepository.events = jsonEvents.map((event: any) => {
  const eventCopy = Object.assign(
    new Event(0, 0, '', '', new Date(), ''),
    event
  );
  eventCopy.date = new Date(event.date);
  return eventCopy;
});
