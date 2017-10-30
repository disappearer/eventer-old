import Event from '../entities/Event';
import User from '../entities/User';
import Repository from '../repositories/Repository';

export default class EventJoinHandler {
  userRepository: Repository<User>;
  eventRepository: Repository<Event>;
  constructor(
    userRepository: Repository<User>,
    eventRepository: Repository<Event>
  ) {
    this.userRepository = userRepository;
    this.eventRepository = eventRepository;
  }

  async handle(eventJoinRequestMessage: any) {
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

  join(user: User, event: Event) {
    user.joinEvent(event);
    event.addToGuestList(user);
    this.userRepository.update(user);
    this.eventRepository.update(event);
  }
}
