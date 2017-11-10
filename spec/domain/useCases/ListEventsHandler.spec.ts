import EventCreateHandler from '../../../src/domain/useCases/EventCreateHandler';
import ListEventsHandler from '../../../src/domain/useCases/ListEventsHandler';
import InMemoryEventRepository from '../../../src/db/memory/InMemoryEventRepository';
import InMemoryUserRepository from '../../../src/db/memory/InMemoryUserRepository';
import Event from '../../../src/domain/entities/Event';
const requestEventCreateMessages = require('./requestEventCreateMessages.json')
  .requestEventCreateMessages;

describe('List Events Handler', () => {
  var repoEvents: Array<Event>, listEventsHandler: ListEventsHandler;

  beforeAll(done => {
    function getDate(dateString: string) {
      var date = dateString.split(' ');
      return new Date(
        Date.UTC(+date[0], +date[1] - 1, +date[2], +date[3], +date[4], +date[5])
      );
    }

    const eventRepository = new InMemoryEventRepository();
    const userRepository = new InMemoryUserRepository();
    const eventCreateHandler = new EventCreateHandler(
      eventRepository,
      userRepository
    );

    const whenRepoEvents = requestEventCreateMessages.map(
      (requestMessage: any) => {
        requestMessage.eventInfo.date = getDate(requestMessage.eventInfo.date);
        return eventCreateHandler.handle(requestMessage);
      }
    );
    Promise.all(whenRepoEvents).then((returnedEvents: any) => {
      returnedEvents.sort((a: Event, b: Event) => {
        return a.date.getTime() - b.date.getTime();
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
    const futureEvents = repoEvents.filter(event => event.date > now);

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
