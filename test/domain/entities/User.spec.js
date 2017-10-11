const User = require(process.env.SRC + '/domain/entities/user');
const Event = require(process.env.SRC + '/domain/entities/event');

describe('User', function() {
  var user;

  beforeEach(function() {
    user = new User(123, 'Aleksa', 'aleksa47@gmail.com');
  });

  it('can be created', function() {
    expect(user).toBeTruthy();
  });

  it('has a toString()', function() {
    expect(user.toString()).toBe(
      'ID: 123 , Name: Aleksa , e-mail: aleksa47@gmail.com'
    );
  });

  describe('Events', function() {
    var event, event2;

    beforeEach(function() {
      event = new Event(
        11,
        123,
        'Concert',
        'ZooCore concert',
        new Date(),
        'Zoo'
      );
      event2 = new Event(
        22,
        246,
        'Concert2',
        'ZooCore concert2',
        new Date(),
        'Zoo2'
      );
    });

    it('can be joined', function() {
      user.joinEvent(event);
      user.joinEvent(event2);
      expect(user.eventsJoined).toEqual([event, event2]);
    });

    it('throws error if already joined', function() {
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
});
