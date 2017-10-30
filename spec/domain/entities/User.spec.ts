import Event from '../../../src/domain/entities/Event';
import User from '../../../src/domain/entities/User';

describe('User', function() {
  var user: User, event: Event, event2: Event;

  beforeEach(function() {
    user = new User(123, [
      {
        provider: 'local',
        id: 123,
        name: 'Aleksa',
        email: 'aleksa47@gmail.com',
        verified: true
      }
    ]);
    event = new Event(11, 123, 'Concert', 'ZooCore concert', new Date(), 'Zoo');
    event2 = new Event(
      22,
      246,
      'Concert2',
      'ZooCore concert2',
      new Date(),
      'Zoo2'
    );
  });

  it('can join events', function() {
    user.joinEvent(event);
    user.joinEvent(event2);
    expect(user.eventsJoined).toEqual([event, event2]);
  });

  it('throws error if trying to join an already joined event', function() {
    user.joinEvent(event);
    const sameEventDifferentObject = new Event(
      11,
      123,
      'Concert',
      'ZooCore concert',
      new Date(),
      'Zoo'
    );
    expect(function() {
      user.joinEvent(sameEventDifferentObject);
    }).toThrowError('EventAlreadyJoinedException');

    expect(user.eventsJoined).toEqual([event]);
  });
});
