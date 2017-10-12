const Event = require(process.env.SRC + '/domain/entities/event');
const User = require(process.env.SRC + '/domain/entities/user');

describe('Event', function() {
  const date = new Date();
  var event, user, user2;

  beforeEach(function() {
    event = new Event(11, 123, 'Concert', 'ZooCore concert', date, 'Zoo');
    user = new User(123, 'Aleksa', 'aleksa47@gmail.com');
    user2 = new User(246, 'Nada', 'nada.zelic@gmail.com');
  });

  it('can add a user to the guest list', function() {
    event.addToGuestList(user);
    event.addToGuestList(user2);
    expect(event.guestList).toEqual([user, user2]);
  });

  it("throws error if trying to add user that's already in guest list", function() {
    event.addToGuestList(user);
    const sameUserDifferentObject = new User(
      123,
      'Aleksa',
      'aleksa47@gmail.com'
    );
    expect(function() {
      event.addToGuestList(sameUserDifferentObject);
    }).toThrowError('UserAlreadyAddedException');

    expect(event.guestList).toEqual([user]);
  });
});
