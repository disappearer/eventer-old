const EventCreateHandler = require(process.env.SRC +
  '/domain/useCases/EventCreateHandler');
const Event = require(process.env.SRC + '/domain/entities/Event');

describe('Event Create Handler', () => {
  var eventCreateHandler, eventRepository, userRepository, requestMessage;

  const eventInfo = {
    title: 'Some Event',
    description: 'Just an event.',
    date: new Date(),
    location: 'Somewhere'
  };

  beforeEach(() => {
    eventRepository = new EventRepository();
    userRepository = new UserRepository();
    requestMessage = {
      userId: 123,
      eventInfo: eventInfo
    };
    eventCreateHandler = new EventCreateHandler(
      eventRepository,
      userRepository
    );
  });

  it('creates a new event', done => {
    eventCreateHandler.handle(requestMessage).then(returnedEvent => {
      expect(returnedEvent).toEqual(jasmine.any(Event));
      expect(eventInfo.title).toBe(returnedEvent.title);
      expect(eventInfo.description).toBe(returnedEvent.description);
      expect(eventInfo.date).toBe(returnedEvent.date);
      expect(eventInfo.location).toBe(returnedEvent.location);
      done();
    });
  });

  it('adds the new event to repository', done => {
    const whenHandledEvent = eventCreateHandler.handle(requestMessage);
    const whenRepoEvent = whenHandledEvent.then(handledEvent => {
      return eventRepository.getById(handledEvent.id);
    });
    Promise.all([
      whenHandledEvent,
      whenRepoEvent
    ]).then(([handledEvent, repoEvent]) => {
      expect(handledEvent).toEqual(repoEvent);
      done();
    });
  });

  it(
    "adds event to creator's list of joined events" +
      ' and persists the changes',
    done => {
      const whenEvent1 = eventCreateHandler.handle(requestMessage);
      const whenEvent2 = eventCreateHandler.handle(requestMessage);
      const whenRepoEvent1 = whenEvent1.then(event1 => {
        return eventRepository.getById(event1.id);
      });
      const whenRepoEvent2 = whenEvent2.then(event2 => {
        return eventRepository.getById(event2.id);
      });
      Promise.all([
        whenRepoEvent1,
        whenRepoEvent2
      ]).then(([repoEvent1, repoEvent2]) => {
        userRepository.getById(requestMessage.userId).then(creator => {
          expect(creator.eventsJoined).toEqual([repoEvent1, repoEvent2]);
          done();
        });
      });
    }
  );

  it('rolls back the event repo if creator update fails', done => {
    var entityId, entityType;
    spyOn(userRepository, 'update').and.callFake(entity => {
      entityId = entity.id;
      entityType = entity.constructor.name;
      return Promise.reject(
        new RepositoryError(
          'UpdatingNonExistingEntityException',
          entity.id,
          entity.constructor.name
        )
      );
    });
    eventCreateHandler
      .handle(requestMessage)
      .then(() => {
        done();
      })
      .catch(error => {
        expect(error).toEqual(
          new RepositoryError(
            'UpdatingNonExistingEntityException',
            entityId,
            entityType
          )
        );
        expect(eventRepository.entities).toEqual([]);
        done();
        error;
      });
  });

  it('throws error if user (creator) not found', done => {
    spyOn(userRepository, 'getById').and.callFake(() => {
      return Promise.resolve(null);
    });
    eventCreateHandler.handle(requestMessage).catch(error => {
      expect(error).toEqual(new Error('EventCreatorNotFoundException'));
      done();
    });
  });
});
