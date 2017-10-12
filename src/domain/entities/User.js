class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.eventsJoined = [];
  }

  joinEvent(event) {
    if (this.isJoined(event)) throw new Error('EventAlreadyJoinedException');
    this.eventsJoined.push(event);
    return true;
  }

  isJoined(event) {
    return this.eventsJoined.find(function(joinedEvent) {
      return joinedEvent.id == event.id;
    });
  }
}

module.exports = User;
