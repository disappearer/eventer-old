const Event = require(process.env.SRC + '/domain/entities/event');

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

  it('has a guest count', function () {
    expect(event.guestCount).toBe(0);
  });
});