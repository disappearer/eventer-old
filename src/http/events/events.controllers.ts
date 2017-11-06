import ListEventsHandler from '../../../src/domain/useCases/ListEventsHandler';
import * as express from 'express';
import { server } from '../server';
// import { eventRepository } from '../../db/InMemoryEventRepository';

export function list(req: express.Request, res: express.Response) {
  const requestMessage = { future: false };
  if (req.params.time == 'future') requestMessage.future = true;
  else if (req.params.time != 'all') {
    return res.status(404).json({
      error: `Wrong path parameter: "${req.params
        .time}". Currently accepted are "all" and "future"`
    });
  }
  const listEventsHandler = new ListEventsHandler(server.eventRepository);
  listEventsHandler.handle(requestMessage).then(events => {
    res.status(200).json({ events: events });
  });
}
