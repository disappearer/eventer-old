class RequestEventJoinHandler {
  constructor(authService, userRepository, eventRepository) {
    this.authService = authService;
    this.userRepository = userRepository;
    this.eventRepository = eventRepository;
  }

  handle(eventJoinRequestMessage) {
    const user = this.userRepository.getById(eventJoinRequestMessage.userId);
    const event = this.eventRepository.getById(eventJoinRequestMessage.eventId);
    this.join(user, event);
  }

  join(user, event) {
    user.joinEvent(event);
    event.addToGuestList(user);
    this.userRepository.update(user);
    this.eventRepository.update(event);
  }
}

module.exports = RequestEventJoinHandler;
