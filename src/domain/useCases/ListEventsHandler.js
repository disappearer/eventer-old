class ListEventsHandler {
  constructor(eventRepository) {
    this.eventRepository = eventRepository;
  }

  handle(requestMessage) {
    if (requestMessage.future) return this.eventRepository.getFuture();
    return this.eventRepository.getAll();
  }
}

module.exports = ListEventsHandler;
