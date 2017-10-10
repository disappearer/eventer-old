
describe('Request Event Join Handler', function () {
  var requestEventJoinHandler;
  var userRepository;
  var eventRepository;
  var eventJoinRequestMessage;

  beforeEach(function () {
    userRepository = new MockUserRepository();
    eventRepository = new MockEventRepository();
    requestEventJoinHandler = new RequestEventJoinHandler(userRepository, eventRepository);
    eventJoinRequestMessage = {
      userId: 123,
      eventId: 11
    };
  });

  it('adds event to user\'s eventsJoined list', function () {
    eventJoinResponseMessage = requestEventJoinHandler.handle(eventJoinRequestMessage);
    expect(eventJoinResponseMessage.success).toBe(true);
    const user = userRepository.getById(eventJoinRequestMessage.userId);
    const event = eventRepository.getById(eventJoinRequestMessage.eventId);
    expect(user.eventsJoined).toEqual([event]);
  });

  it('adds user to event\'s guest list', function () {
    eventJoinResponseMessage = requestEventJoinHandler.handle(eventJoinRequestMessage);
    expect(eventJoinResponseMessage.success).toBe(true);
    const user = userRepository.getById(eventJoinRequestMessage.userId);
    const event = eventRepository.getById(eventJoinRequestMessage.eventId);
    expect(event.guestList).toEqual([user]);
  });

});