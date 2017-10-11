describe('Request Event Join Handler', function() {
  var requestEventJoinHandler,
    userRepository,
    eventRepository,
    eventJoinRequestMessage;

  beforeEach(function() {
    userRepository = new UserRepository();
    eventRepository = new EventRepository();
    requestEventJoinHandler = new RequestEventJoinHandler(
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
    const eventJoinResponseMessage = requestEventJoinHandler.handle(
      eventJoinRequestMessage
    );
    const user = userRepository.getById(eventJoinRequestMessage.userId);
    const event = eventRepository.getById(eventJoinRequestMessage.eventId);
    expect(user.eventsJoined).toEqual([event]);
  });

  it("adds user to event's guest list", function() {
    requestEventJoinHandler.handle(eventJoinRequestMessage);
    const user = userRepository.getById(eventJoinRequestMessage.userId);
    const event = eventRepository.getById(eventJoinRequestMessage.eventId);
    expect(event.guestList).toEqual([user]);
  });

  it('throws error if a repository getById() fails', function() {
    spyOn(userRepository, 'getById').and.callFake(function() {
      throw new Error('ProblemRetrievingEntityException');
    });
    expect(function() {
      requestEventJoinHandler.handle(eventJoinRequestMessage);
    }).toThrowError('ProblemRetrievingEntityException');
  });

  it('throws error if a repository save() fails', function() {
    spyOn(userRepository, 'save').and.callFake(function() {
      throw new Error('ProblemPersistingEntityException');
    });
    expect(function() {
      requestEventJoinHandler.handle(eventJoinRequestMessage);
    }).toThrowError('ProblemPersistingEntityException');
  });
});
