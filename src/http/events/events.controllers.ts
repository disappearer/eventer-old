import ListEventsHandler from '../../../src/domain/useCases/ListEventsHandler';
import * as express from 'express';
import { eventRepository } from '../../db/InMemoryEventRepository';

export function all(req: express.Request, res: express.Response) {
  const listEventsHandler = new ListEventsHandler(eventRepository);
  listEventsHandler.handle({ future: false }).then(events => {
    res.status(200).json({ events: events });
  });
}
