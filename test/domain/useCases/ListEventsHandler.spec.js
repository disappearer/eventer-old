const EventCreateHandler = require(process.env.SRC +
  '/domain/useCases/EventCreateHandler');
const ListEventsHandler = require(process.env.SRC +
  '/domain/useCases/ListEventsHandler');

describe('List Events Handler', function() {
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

  const repoEvents = testDbData.requestEventCreateMessages.map(function(
    requestMessage
  ) {
    requestMessage.eventInfo.date = getDate(requestMessage.eventInfo.date);
    return eventCreateHandler.handle(requestMessage);
  });
  repoEvents.sort(function(a, b) {
    return a.date - b.date;
  });

  const listEventsHandler = new ListEventsHandler(eventRepository);

  it('returns a list of repo events in temporal order', function() {
    const requestMessage = { future: false };
    const returnedEvents = listEventsHandler.handle(requestMessage);
    expect(returnedEvents).toEqual(repoEvents);
  });

  it('can return a list of only future events', function() {
    const requestMessage = { future: true };

    jasmine.clock().mockDate(new Date(Date.UTC(2017, 9, 16, 18, 0)));
    var returnedEvents = listEventsHandler.handle(requestMessage);
    const now = new Date();
    const futureEvents = repoEvents.filter(function(event) {
      return event.date > now;
    });
    expect(returnedEvents).toEqual(futureEvents);

    jasmine.clock().mockDate(new Date(Date.UTC(2018, 9, 16, 18, 0)));
    returnedEvents = listEventsHandler.handle(requestMessage);
    expect(returnedEvents).toEqual([]);

    jasmine.clock().mockDate(new Date(Date.UTC(2016, 9, 16, 18, 0)));
    returnedEvents = listEventsHandler.handle(requestMessage);
    expect(returnedEvents).toEqual(repoEvents);
  });
});
