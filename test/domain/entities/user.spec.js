var User = require(process.env.SRC + '/domain/entities/user');
var Event = require(process.env.SRC + '/domain/entities/event');

describe('User', function () {
  var user;

  beforeEach(function () {
    user = new User(123, 'Aleksa', 'aleksa47@gmail.com');
  });

  it('can be created', function () {
    expect(user).toBeTruthy();
  });

  it('has a toString()', function () {
    expect(user.toString()).toBe('ID: 123 , Name: Aleksa , e-mail: aleksa47@gmail.com');
  });

  it('has a list of events joined', function () {
    expect(user.eventsJoined).toEqual([]);
  });

  describe('Events', function () {
    var event, event2;

    beforeEach(function () {
      event = new Event(11, 123, 'Concert', 'ZooCore concert', new Date(), 'Zoo');
      event2 = new Event(22, 246, 'Concert2', 'ZooCore concert2', new Date(), 'Zoo2');
    });

    it('can be joined', function () {
      user.joinEvent(event);
      user.joinEvent(event2);
      expect(user.eventsJoined).toEqual([event, event2]);
    });

    it('can\'t be joined if already joined', function () {
      const event = new Event(11, 123, 'Concert', 'ZooCore concert', new Date(), 'Zoo');
      expect(user.joinEvent(event)).toBe(true);
      expect(user.joinEvent(event)).toBe(false);
      expect(user.eventsJoined).toEqual([event]);
    });

    it('increases guest count for event upon joining', function () {
      user.joinEvent(event);
      expect(event.guestCount).toBe(1);
      const user2 = new User(123, 'Nada', 'nada.zelic@gmail.com');
      user2.joinEvent(event);
      expect(event.guestCount).toBe(2);
    });

  });

});