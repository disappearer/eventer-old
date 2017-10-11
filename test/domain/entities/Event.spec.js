const Event = require(process.env.SRC + '/domain/entities/event');
const User = require(process.env.SRC + '/domain/entities/user');

describe('Event', function () {
  const date = new Date();
  var event;

  beforeEach(function () {
    event = new Event(11, 123, 'Concert', 'ZooCore concert', date, 'Zoo');
  });

  it('can be created', function () {
    expect(event).toBeTruthy();
  });

  it('has a toString', function () {
    expect(event.toString()).toEqual('ID: 11, CreatorID: 123, Title: Concert, ' +
      'Description: ZooCore concert, Time: ' +
      date + ', Location: Zoo');
  });

  describe('Users', function () {
    var user, user2;

    beforeEach(function () {
      user = new User(123, 'Aleksa', 'aleksa47@gmail.com');
      user2 = new User(246, 'Nada', 'nada.zelic@gmail.com');
    });

    it('can be added to the guest list', function () {
      event.addToGuestList(user);
      event.addToGuestList(user2);
      expect(event.guestList).toEqual([user, user2]);
    });

    it('can\'t be added if already added', function () {
      expect(event.addToGuestList(user)).toBe(true);
      const sameUserDifferentObject = new User(123, 'Aleksa', 'aleksa47@gmail.com');
      expect(event.addToGuestList(sameUserDifferentObject)).toBe(false);
      expect(event.guestList).toEqual([user]);
    });

  });


});