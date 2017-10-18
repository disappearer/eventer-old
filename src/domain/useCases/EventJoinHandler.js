class EventJoinHandler {
  constructor(authService, userRepository, eventRepository) {
    this.authService = authService;
    this.userRepository = userRepository;
    this.eventRepository = eventRepository;
  }

  async handle(eventJoinRequestMessage) {
    const user = await this.userRepository.getById(
      eventJoinRequestMessage.userId
    );
    if (!user) throw new Error('UserNotFoundException');
    const event = await this.eventRepository.getById(
      eventJoinRequestMessage.eventId
    );
    if (!event) throw new Error('EventNotFoundException');
    this.join(user, event);
  }

  join(user, event) {
    user.joinEvent(event);
    event.addToGuestList(user);
    this.userRepository.update(user);
    this.eventRepository.update(event);
  }
}

module.exports = EventJoinHandler;
