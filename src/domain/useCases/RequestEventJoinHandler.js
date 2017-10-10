class RequestEventJoinHandler {
  constructor(userRepository, eventRepository) {
    this.userRepository = userRepository;
    this.eventRepository = eventRepository;
  }

  handle(eventJoinRequestMessage) {
    var user = this.userRepository.getById(eventJoinRequestMessage.userId);
    var event = this.eventRepository.getById(eventJoinRequestMessage.eventId);
    user.joinEvent(event);
    event.addToGuestList(user);
    this.userRepository.save(user);
    this.eventRepository.save(event);
    return { success: true };
  }
}

module.exports = RequestEventJoinHandler;