const EventCreateHandler = require(process.env.SRC +
  '/domain/useCases/EventCreateHandler');
const Event = require(process.env.SRC + '/domain/entities/Event');

describe('Request Create Event Handler', () => {
  var eventCreateHandler,
    eventRepository,
    userRepository,
    eventCreateRequestMessage;

  const eventInfo = {
    title: 'Some Event',
    description: 'Just an event.',
    date: new Date(),
    location: 'Somewhere'
  };

  beforeEach(() => {
    eventRepository = new EventRepository();
    userRepository = new UserRepository();
    eventCreateRequestMessage = {
      userId: 123,
      eventInfo: eventInfo
    };
    eventCreateHandler = new EventCreateHandler(
      eventRepository,
      userRepository
    );
  });

  it('creates a new event', done => {
    eventCreateHandler.handle(eventCreateRequestMessage).then(returnedEvent => {
      expect(returnedEvent).toEqual(jasmine.any(Event));
      expect(eventInfo.title).toBe(returnedEvent.title);
      expect(eventInfo.description).toBe(returnedEvent.description);
      expect(eventInfo.date).toBe(returnedEvent.date);
      expect(eventInfo.location).toBe(returnedEvent.location);
      done();
    });
  });

  it('adds the new event to repository', done => {
    const whenEventReturned = eventCreateHandler.handle(
      eventCreateRequestMessage
    );
    const whenSavedEventReturned = whenEventReturned.then(returnedEvent => {
      return eventRepository.getById(returnedEvent.id);
    });
    Promise.all([
      whenEventReturned,
      whenSavedEventReturned
    ]).then(([returnedEvent, savedEvent]) => {
      expect(returnedEvent).toEqual(savedEvent);
      done();
    });
  });

  it(
    "adds event to creator's list of joined events" +
      ' and persists the changes',
    done => {
      const whenEventReturned1 = eventCreateHandler.handle(
        eventCreateRequestMessage
      );
      const whenEventReturned2 = eventCreateHandler.handle(
        eventCreateRequestMessage
      );
      const whenSavedEventReturned1 = whenEventReturned1.then(
        returnedEvent1 => {
          return eventRepository.getById(returnedEvent1.id);
        }
      );
      const whenSavedEventReturned2 = whenEventReturned2.then(
        returnedEvent2 => {
          return eventRepository.getById(returnedEvent2.id);
        }
      );
      Promise.all([
        whenSavedEventReturned1,
        whenSavedEventReturned2
      ]).then(([savedEvent1, savedEvent2]) => {
        userRepository
          .getById(eventCreateRequestMessage.userId)
          .then(creator => {
            expect(creator.eventsJoined).toEqual([savedEvent1, savedEvent2]);
            done();
          });
      });
    }
  );

  it('rolls back the event repo if creator update fails', done => {
    const whenEventReturned = eventCreateHandler.handle(
      eventCreateRequestMessage
    );
    whenEventReturned.then(returnedEvent => {
      spyOn(userRepository, 'update').and.callFake(function() {
        throw new Error('FakeUpdateException');
      });
      eventCreateHandler
        .handle(eventCreateRequestMessage)
        .then(() => {
          expect(eventRepository.entities).toEqual([returnedEvent]);
          done();
        })
        .catch(error => {
          done();
          error;
        });
    });
  });

  it('throws error if user (creator) not found', done => {
    spyOn(userRepository, 'getById').and.callFake(() => {
      return Promise.resolve(null);
    });
    eventCreateHandler.handle(eventCreateRequestMessage).catch(error => {
      expect(error).toEqual(new Error('EventCreatorNotFoundException'));
      done();
    });
  });
});
