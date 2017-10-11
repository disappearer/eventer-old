class RequestEventJoinHandler {
  constructor(authService, userRepository, eventRepository) {
    this.authService = authService;
    this.userRepository = userRepository;
    this.eventRepository = eventRepository;
  }

  handle(eventJoinRequestMessage) {

    const user = this.userRepository.getById(eventJoinRequestMessage.userId);
    if (!user)
      return {
        success: false,
        message: 'User (id:' + eventJoinRequestMessage.userId + ') not found.'
      };

    const event = this.eventRepository.getById(eventJoinRequestMessage.eventId);
    if (!event)
      return {
        success: false,
        message: 'Event (id:' + eventJoinRequestMessage.eventId + ') not found.'
      };

    if (!this.join(user, event))
      return {
        success: false,
        message: 'User (id:' + user.id + ') already joined event (id:' + event.id + ').'
      };

    return {
      success: true,
      message: 'User (id:' + user.id + ') joined event (id:' + event.id + ').'
    };
  }

  join(user, event) {
    if (!user.joinEvent(event))
      return false;

    if (!event.addToGuestList(user))
      return false;

    this.userRepository.save(user);
    this.eventRepository.save(event);
    return true;
  }
}

module.exports = RequestEventJoinHandler;