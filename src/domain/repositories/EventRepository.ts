import Repository from './Repository';
import Event from '../entities/Event';

export default interface EventRepository extends Repository<Event> {
  updateGuestList(event: Event): Promise<Event>;
  getFuture(): Promise<Array<Event>>;
  getAll(): Promise<Array<Event>>;
};
