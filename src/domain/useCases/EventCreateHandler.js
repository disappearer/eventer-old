const Event = require('../entities/Event');

class EventCreateHandler {
  constructor(eventRepository, userRepository) {
    this.eventRepository = eventRepository;
    this.userRepository = userRepository;
  }

  async handle(requestMessage) {
    const creator = await this.getCreator(requestMessage.userId);
    const returnedEvent = this.addEventToRepository(
      creator,
      requestMessage.eventInfo
    );
    this.updateCreator(creator, returnedEvent);
    return returnedEvent;
  }

  addEventToRepository(creator, info) {
    const event = this.createEvent(creator.id, info);
    event.addToGuestList(creator);
    return this.eventRepository.add(event);
  }

  createEvent(creatorId, info) {
    return new Event(
      0,
      creatorId,
      info.title,
      info.description,
      info.date,
      info.location
    );
  }

  async getCreator(userId) {
    const creator = await this.userRepository.getById(userId);
    if (!creator) throw new Error('EventCreatorNotFoundException');
    return creator;
  }

  updateCreator(user, event) {
    user.joinEvent(event);
    try {
      this.userRepository.update(user);
    } catch (e) {
      this.eventRepository.delete(event);
      throw e;
    }
  }
}

module.exports = EventCreateHandler;
