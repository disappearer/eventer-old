const EventJoinHandler = require(process.env.SRC +
  '/domain/useCases/EventJoinHandler');

describe('Request Event Join Handler', function() {
  var eventJoinHandler,
    userRepository,
    eventRepository,
    eventJoinRequestMessage;

  beforeEach(function() {
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

  it("adds event to user's eventsJoined list", function() {
    const eventJoinResponseMessage = eventJoinHandler.handle(
      eventJoinRequestMessage
    );
    const user = userRepository.getById(eventJoinRequestMessage.userId);
    const event = eventRepository.getById(eventJoinRequestMessage.eventId);
    expect(user.eventsJoined).toEqual([event]);
  });

  it("adds user to event's guest list", function() {
    eventJoinHandler.handle(eventJoinRequestMessage);
    const user = userRepository.getById(eventJoinRequestMessage.userId);
    const event = eventRepository.getById(eventJoinRequestMessage.eventId);
    expect(event.guestList).toEqual([user]);
  });

  it('throws error if user not found', function() {
    spyOn(userRepository, 'getById').and.callFake(function() {
      return null;
    });
    expect(function() {
      eventJoinHandler.handle(eventJoinRequestMessage);
    }).toThrowError('UserNotFoundException');
  });

  it('throws error if event not found', function() {
    spyOn(eventRepository, 'getById').and.callFake(function() {
      return null;
    });
    expect(function() {
      eventJoinHandler.handle(eventJoinRequestMessage);
    }).toThrowError('EventNotFoundException');
  });
});
