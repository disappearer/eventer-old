const EventCreateHandler = require(process.env.SRC +
  '/domain/useCases/EventCreateHandler');
const ListEventsHandler = require(process.env.SRC +
  '/domain/useCases/ListEventsHandler');

describe('List Events Handler', () => {
  var repoEvents, listEventsHandler;

  beforeAll(done => {
    function getDate(dateString) {
      var date = dateString.split(' ');
      return new Date(
        Date.UTC(date[0], date[1] - 1, date[2], date[3], date[4], date[5])
      );
    }

    const eventRepository = new EventRepository();
    const userRepository = new UserRepository();
    const eventCreateHandler = new EventCreateHandler(
      eventRepository,
      userRepository
    );

    const whenRepoEvents = testDbData.requestEventCreateMessages.map(
      requestMessage => {
        requestMessage.eventInfo.date = getDate(requestMessage.eventInfo.date);
        return eventCreateHandler.handle(requestMessage);
      }
    );
    Promise.all(whenRepoEvents).then(returnedEvents => {
      returnedEvents.sort((a, b) => {
        return a.date - b.date;
      });
      repoEvents = returnedEvents;
      done();
    });

    listEventsHandler = new ListEventsHandler(eventRepository);
  });

  it('returns a list of repo events in temporal order', done => {
    const requestMessage = { future: false };
    listEventsHandler.handle(requestMessage).then(returnedEvents => {
      expect(returnedEvents).toEqual(repoEvents);
      done();
    });
  });

  it('can return a list of only future events', done => {
    const requestMessage = { future: true };

    jasmine.clock().mockDate(new Date(Date.UTC(2017, 9, 16, 18, 0)));
    const now = new Date();
    const futureEvents = repoEvents.filter(function(event) {
      return event.date > now;
    });

    listEventsHandler
      .handle(requestMessage)
      .then(returnedEvents => {
        expect(returnedEvents).toEqual(futureEvents);
        jasmine.clock().mockDate(new Date(Date.UTC(2018, 9, 16, 18, 0)));
        return listEventsHandler.handle(requestMessage);
      })
      .then(returnedEvents => {
        expect(returnedEvents).toEqual([]);
        jasmine.clock().mockDate(new Date(Date.UTC(2016, 9, 16, 18, 0)));
        return listEventsHandler.handle(requestMessage);
      })
      .then(returnedEvents => {
        expect(returnedEvents).toEqual(repoEvents);
        done();
      });
  });
});
