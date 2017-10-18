const EventJoinHandler = require(process.env.SRC +
  '/domain/useCases/EventJoinHandler');

describe('Request Event Join Handler', () => {
  var eventJoinHandler,
    userRepository,
    eventRepository,
    eventJoinRequestMessage;

  beforeEach(() => {
    userRepository = new UserRepository();
    eventRepository = new EventRepository();
    eventJoinHandler = new EventJoinHandler(
      authServiceSuccess,
      userRepository,
      eventRepository
    );
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
        expect(user.eventsJoined).toEqual([event]);
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
        expect(event.guestList).toEqual([user]);
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
