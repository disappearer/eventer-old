class Event {
  constructor(id, creatorId, title, description, date, location) {
    this.id = id;
    this.creatorId = creatorId;
    this.title = title;
    this.description = description;
    this.date = date;
    this.location = location;
    this.guestList = [];
  }

  addToGuestList(user) {
    if (this.isInGuestList(user)) throw new Error('UserAlreadyAddedException');
    this.guestList.push(user);
    return true;
  }

  isInGuestList(user) {
    return this.guestList.find(function(guestListUser) {
      return guestListUser.id == user.id;
    });
  }
}

module.exports = Event;
