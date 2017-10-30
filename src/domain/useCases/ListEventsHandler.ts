import EventRepository from '../repositories/EventRepository';

export default class ListEventsHandler {
  eventRepository: EventRepository;

  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository;
  }

  handle(requestMessage: any) {
    if (requestMessage.future) return this.eventRepository.getFuture();
    return this.eventRepository.getAll();
  }
}
