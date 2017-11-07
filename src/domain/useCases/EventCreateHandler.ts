import Event from '../entities/Event';
import User from '../entities/User';
import EventRepository from '../repositories/EventRepository';
import UserRepository from '../repositories/UserRepository';

export default class EventCreateHandler {
  eventRepository: EventRepository;
  userRepository: UserRepository;
  constructor(
    eventRepository: EventRepository,
    userRepository: UserRepository
  ) {
    this.eventRepository = eventRepository;
    this.userRepository = userRepository;
  }

  async handle(requestMessage: {
    userId: number;
    eventInfo: {
      title: string;
      description: string;
      location: string;
      date: Date;
    };
  }) {
    const creator = await this.getCreator(requestMessage.userId);
    const returnedEvent = await this.addEventToRepository(
      creator,
      requestMessage.eventInfo
    );
    await this.updateCreator(creator, returnedEvent);
    return returnedEvent;
  }

  async addEventToRepository(creator: User, info: any) {
    const event = this.createEvent(creator.id, info);
    event.addToGuestList(creator);
    return await this.eventRepository.add(event);
  }

  createEvent(creatorId: number, info: any) {
    return new Event(
      0,
      creatorId,
      info.title,
      info.description,
      info.date,
      info.location
    );
  }

  async getCreator(userId: number) {
    const creator = await this.userRepository.getById(userId);
    if (!creator) throw new Error('EventCreatorNotFoundException');
    return creator;
  }

  async updateCreator(user: User, event: Event) {
    user.joinEvent(event);
    try {
      await this.userRepository.update(user);
    } catch (e) {
      await this.eventRepository.delete(event);
      throw e;
    }
  }
}
