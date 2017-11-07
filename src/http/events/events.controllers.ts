import ListEventsHandler from '../../../src/domain/useCases/ListEventsHandler';
import EventCreateHandler from '../../../src/domain/useCases/EventCreateHandler';
import * as express from 'express';
import { server } from '../server';

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

export function create(req: express.Request, res: express.Response) {
  const eventCreateHandler = new EventCreateHandler(
    server.eventRepository,
    server.userRepository
  );
  const requestMessage = {
    userId: req.user.id,
    eventInfo: {
      title: req.body.title,
      date: new Date(req.body.date),
      location: req.body.location,
      description: req.body.description
    }
  };
  eventCreateHandler.handle(requestMessage).then(event => {
    delete event.guestList; // avoid circular refs
    res.status(200).json({ event: event });
  });
}
