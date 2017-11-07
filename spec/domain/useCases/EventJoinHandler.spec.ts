import EventJoinHandler from '../../../src/domain/useCases/EventJoinHandler';
import InMemoryEventRepository from '../../../src/db/InMemoryEventRepository';
import InMemoryUserRepository from '../../../src/db/InMemoryUserRepository';

describe('Event Join Handler', () => {
  var eventJoinHandler: EventJoinHandler,
    userRepository: InMemoryUserRepository,
    eventRepository: InMemoryEventRepository,
    eventJoinRequestMessage: any;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    eventRepository = new InMemoryEventRepository();
    eventJoinHandler = new EventJoinHandler(userRepository, eventRepository);
    eventJoinRequestMessage = {
      userId: 123,
      eventId: 11
    };
  });

  it("adds event to user's eventsJoined list", done => {
    eventJoinHandler.handle(eventJoinRequestMessage).then(() => {
      const whenUser = userRepository.getById(eventJoinRequestMessage.userId);
      const whenEvent = eventRepository.getById(
        eventJoinRequestMessage.eventId
      );
      Promise.all([whenUser, whenEvent]).then(([user, event]) => {
        expect(user.eventsJoined).toEqual([event.id]);
        done();
      });
    });
  });

  it("adds user to event's guest list", done => {
    eventJoinHandler.handle(eventJoinRequestMessage).then(() => {
      const whenUser = userRepository.getById(eventJoinRequestMessage.userId);
      const whenEvent = eventRepository.getById(
        eventJoinRequestMessage.eventId
      );
      Promise.all([whenUser, whenEvent]).then(([user, event]) => {
        expect(event.guestList).toEqual([user.id]);
        done();
      });
    });
  });

  it('throws error if user not found', done => {
    spyOn(userRepository, 'getById').and.callFake(function() {
      return Promise.resolve(null);
    });
    eventJoinHandler.handle(eventJoinRequestMessage).catch(error => {
      expect(error).toEqual(new Error('UserNotFoundException'));
      done();
    });
  });

  it('throws error if event not found', done => {
    spyOn(eventRepository, 'getById').and.callFake(function() {
      return Promise.resolve(null);
    });
    eventJoinHandler.handle(eventJoinRequestMessage).catch(error => {
      expect(error).toEqual(new Error('EventNotFoundException'));
      done();
    });
  });
});
