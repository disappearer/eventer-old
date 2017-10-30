import Event from '../entities/Event';
import User from '../entities/User';
import Repository from '../repositories/Repository';

export default class EventCreateHandler {
  eventRepository: Repository<Event>;
  userRepository: Repository<User>;
  constructor(
    eventRepository: Repository<Event>,
    userRepository: Repository<User>
  ) {
    this.eventRepository = eventRepository;
    this.userRepository = userRepository;
  }

  async handle(requestMessage: any) {
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
