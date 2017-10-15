describe('Request Create Event Handler', function() {
  var requestEventCreateHandler,
    eventRepository,
    userRepository,
    eventCreateRequestMessage;

  const eventInfo = {
    title: 'Some Event',
    description: 'Just an event.',
    date: new Date(),
    location: 'Somewhere'
  };

  beforeEach(function() {
    eventRepository = new EventRepository();
    userRepository = new UserRepository();
    eventCreateRequestMessage = {
      userId: 123,
      eventInfo: eventInfo
    };
    requestEventCreateHandler = new RequestEventCreateHandler(
      eventRepository,
      userRepository
    );
  });

  it('creates a new event', function() {
    const returnedEvent = requestEventCreateHandler.handle(
      eventCreateRequestMessage
    );
    expect(returnedEvent).toEqual(jasmine.any(Event));
    expect(eventInfo.title).toBe(returnedEvent.title);
    expect(eventInfo.description).toBe(returnedEvent.description);
    expect(eventInfo.date).toBe(returnedEvent.date);
    expect(eventInfo.location).toBe(returnedEvent.location);
  });

  it('adds the new event to repository', function() {
    const returnedEvent = requestEventCreateHandler.handle(
      eventCreateRequestMessage
    );
    const savedEvent = eventRepository.getById(returnedEvent.id);
    expect(returnedEvent).toEqual(savedEvent);
  });

  it(
    "adds event to creator's list of joined events" +
      ' and persists the changes',
    function() {
      const returnedEvent1 = requestEventCreateHandler.handle(
        eventCreateRequestMessage
      );
      const returnedEvent2 = requestEventCreateHandler.handle(
        eventCreateRequestMessage
      );
      const savedEvent1 = eventRepository.getById(returnedEvent1.id);
      const savedEvent2 = eventRepository.getById(returnedEvent2.id);
      const creator = userRepository.getById(eventCreateRequestMessage.userId);
      expect(creator.eventsJoined).toEqual([savedEvent1, savedEvent2]);
    }
  );

  it('rolls back the event repo if creator update fails', function() {
    const returnedEvent1 = requestEventCreateHandler.handle(
      eventCreateRequestMessage
    );
    spyOn(userRepository, 'update').and.callFake(function() {
      throw new Error();
    });
    expect(function() {
      const returnedEvent2 = requestEventCreateHandler.handle(
        eventCreateRequestMessage
      );
    }).toThrowError();
    expect(eventRepository.entities).toEqual([returnedEvent1]);
  });

  it('throws error if user (creator) not found', function() {
    spyOn(userRepository, 'getById').and.callFake(function() {
      return null;
    });
    expect(function() {
      const returnedEvent = requestEventCreateHandler.handle(
        eventCreateRequestMessage
      );
    }).toThrowError('EventCreatorNotFoundException');
  });
});
