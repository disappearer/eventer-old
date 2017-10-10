class RequestEventJoinHandler {
  constructor(authService, userRepository, eventRepository) {
    this.authService = authService;
    this.userRepository = userRepository;
    this.eventRepository = eventRepository;
  }

  handle(eventJoinRequestMessage) {

    if (!this.authService.isAuthenticated())
      return {
        success: false,
        message: 'User not authenticated.'
      };

    var user = this.userRepository.getById(eventJoinRequestMessage.userId);
    var event = this.eventRepository.getById(eventJoinRequestMessage.eventId);

    if (this.join(user, event))
      return {
        success: true,
        message: 'User (id:' + user.id + ') joined event (id:' + event.id + ').'
      };

    return {
      success: false,
      message: 'User (id:' + user.id + ') already joined event (id:' + event.id + ').'
    };
  }

  join(user, event) {
    if (!user.joinEvent(event))
      return false;

    event.addToGuestList(user);
    this.userRepository.save(user);
    this.eventRepository.save(event);
    return true;
  }
}

module.exports = RequestEventJoinHandler;