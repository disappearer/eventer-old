import Repository from './Repository';
import Event from '../entities/Event';

export default interface EventRepository extends Repository<Event> {
  getFuture(): Promise<Array<Event>>;
};
