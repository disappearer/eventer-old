import Event from '../entities/Event';
import User from '../entities/User';
import EventRepository from '../repositories/EventRepository';
import UserRepository from '../repositories/UserRepository';

export default class EventJoinHandler {
  userRepository: UserRepository;
  eventRepository: EventRepository;
  constructor(
    userRepository: UserRepository,
    eventRepository: EventRepository
  ) {
    this.userRepository = userRepository;
    this.eventRepository = eventRepository;
  }

  async handle(requestMessage: { userId: number; eventId: number }) {
    const user = await this.userRepository.getById(requestMessage.userId);
    if (!user) throw new Error('UserNotFoundException');
    const event = await this.eventRepository.getById(requestMessage.eventId);
    if (!event) throw new Error('EventNotFoundException');
    return await this.join(user, event);
  }

  async join(user: User, event: Event) {
    user.joinEvent(event);
    event.addToGuestList(user);
    user = await this.userRepository.updateEventsJoined(user);
    event = await this.eventRepository.updateGuestList(event);
    return { user: user, event: event };
  }
}
