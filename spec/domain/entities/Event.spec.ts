import Event from '../../../src/domain/entities/Event';
import User from '../../../src/domain/entities/User';

describe('Event', function() {
  const date = new Date();
  var event: Event, user: User, user2: User;

  beforeEach(function() {
    event = new Event(11, 123, 'Concert', 'ZooCore concert', date, 'Zoo');
    user = new User(123, [
      {
        provider: 'local',
        id: 123,
        name: 'Aleksa',
        email: 'aleksa47@gmail.com',
        verified: true
      }
    ]);

    user2 = new User(246, [
      {
        provider: 'local',
        id: 246,
        name: 'Nada',
        email: 'nada.zelic@gmail.com',
        verified: true
      }
    ]);
  });

  it('can add a user to the guest list', function() {
    event.addToGuestList(user);
    event.addToGuestList(user2);
    expect(event.guestList).toEqual([user.id, user2.id]);
  });

  it("throws error if trying to add user that's already in guest list", function() {
    event.addToGuestList(user);
    const sameUserDifferentObject = new User(123, [
      {
        provider: 'local',
        id: 123,
        name: 'Aleksa',
        email: 'aleksa47@gmail.com',
        verified: true
      }
    ]);
    expect(function() {
      event.addToGuestList(sameUserDifferentObject);
    }).toThrowError('UserAlreadyAddedException');

    expect(event.guestList).toEqual([user.id]);
  });
});
