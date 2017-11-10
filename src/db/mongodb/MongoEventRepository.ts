import EventRepository from '../../domain/repositories/EventRepository';
import Event from '../../domain/entities/Event';

import { db } from './mongodb.config';
import { Collection } from 'mongodb';

export default class MongoEventRepository implements EventRepository {
  events: Collection;

  constructor(events: Collection) {
    this.events = events;
  }

  async add(event: Event): Promise<Event> {
    delete event.id;
    const insertResult = await this.events.insertOne(event);
    return this.toDomainEvent(insertResult.ops[0]);
  }

  async update(event: Event): Promise<Event> {
    const result = await this.events.replaceOne({ _id: event.id }, event);
    return this.toDomainEvent(result.ops[0]);
  }

  async findOne(query: any) {
    return Promise.resolve(null);
  }

  async getById(id: Number) {
    const dbEvent = await this.events.findOne({ _id: id });
    if (!dbEvent) return null;
    return this.toDomainEvent(dbEvent);
  }

  async getFuture() {
    const dbEvents = await this.events
      .find()
      .filter({ date: { $gt: new Date() } })
      .sort({ date: 1 })
      .toArray();
    return dbEvents.map(dbEvent => {
      return this.toDomainEvent(dbEvent);
    });
  }

  async getAll(): Promise<Array<Event>> {
    const dbEvents = await this.events
      .find()
      .sort({ date: 1 })
      .toArray();
    return dbEvents.map(dbEvent => {
      return this.toDomainEvent(dbEvent);
    });
  }

  async delete(event: Event) {}

  toDbEvent(event: Event) {
    const dbEvent: any = event;
    delete dbEvent.id;
    dbEvent._id = event.id;
    return dbEvent;
  }

  toDomainEvent(dbEvent: any): Event {
    dbEvent.id = dbEvent._id;
    delete dbEvent._id;
    return Object.assign(new Event(), dbEvent);
  }
}

// export const eventRepository = new MongoEventRepository(db);
