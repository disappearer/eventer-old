const randomstring = require('randomstring');

class User {
  constructor(id, displayName, email, password, verified) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.displayName = displayName;
    this.verified = verified;
    if (!verified) this.verificationToken = randomstring.generate(13);
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
