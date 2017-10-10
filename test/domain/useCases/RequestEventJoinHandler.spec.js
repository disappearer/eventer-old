
describe('Request Event Join Handler', function () {
  var requestEventJoinHandler,
    userRepository,
    eventRepository,
    eventJoinRequestMessage;

  beforeEach(function () {
    const authServiceSuccess = new MockAuthService(true);
    userRepository = new MockUserRepository();
    eventRepository = new MockEventRepository();
    requestEventJoinHandler = new RequestEventJoinHandler(authServiceSuccess, userRepository, eventRepository);
    eventJoinRequestMessage = {
      userId: 123,
      eventId: 11
    };
  });

  it('adds event to user\'s eventsJoined list', function () {
    eventJoinResponseMessage = requestEventJoinHandler.handle(eventJoinRequestMessage);
    expect(eventJoinResponseMessage).toEqual(
      {
        success: true,
        message: 'User (id:123) joined event (id:11).'
      }
    );
    const user = userRepository.getById(eventJoinRequestMessage.userId);
    const event = eventRepository.getById(eventJoinRequestMessage.eventId);
    expect(user.eventsJoined).toEqual([event]);
  });

  it('adds user to event\'s guest list', function () {
    requestEventJoinHandler.handle(eventJoinRequestMessage);
    const user = userRepository.getById(eventJoinRequestMessage.userId);
    const event = eventRepository.getById(eventJoinRequestMessage.eventId);
    expect(event.guestList).toEqual([user]);
  });

  it('returns error message if user already joined', function () {
    requestEventJoinHandler.handle(eventJoinRequestMessage);
    const eventJoinResponseMessage = requestEventJoinHandler.handle(eventJoinRequestMessage);
    expect(eventJoinResponseMessage).toEqual(
      {
        success: false,
        message: 'User (id:123) already joined event (id:11).'
      }
    );
  });

  it('fails if user not authenticated', function () {
    const authServiceFail = new MockAuthService(false);
    const requestEventJoinHandler = new RequestEventJoinHandler(authServiceFail, userRepository, eventRepository);
    const eventJoinResponseMessage = requestEventJoinHandler.handle(eventJoinRequestMessage);
    expect(eventJoinResponseMessage).toEqual(
      {
        success: false,
        message: 'User not authenticated.'
      }
    );
  });

});