const Event = require('../entities/Event');

class EventCreateHandler {
  constructor(eventRepository, userRepository) {
    this.eventRepository = eventRepository;
    this.userRepository = userRepository;
  }

  async handle(requestMessage) {
    const creator = await this.getCreator(requestMessage.userId);
    const returnedEvent = await this.addEventToRepository(
      creator,
      requestMessage.eventInfo
    );
    await this.updateCreator(creator, returnedEvent);
    return returnedEvent;
  }

  async addEventToRepository(creator, info) {
    const event = this.createEvent(creator.id, info);
    event.addToGuestList(creator);
    return await this.eventRepository.add(event);
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

  async updateCreator(user, event) {
    user.joinEvent(event);
    try {
      await this.userRepository.update(user);
    } catch (e) {
      this.eventRepository.delete(event);
      throw e;
    }
  }
}

module.exports = EventCreateHandler;
