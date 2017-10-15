class User {
  constructor(id, displayName, email, password) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.displayName = displayName;
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
