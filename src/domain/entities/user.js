class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.eventsJoined = [];
  }

  toString() {
    return 'ID: ' + this.id + ' , Name: ' + this.name + ' , e-mail: ' + this.email;
  }

  joinEvent(event) {
    if (this.isJoined(event))
      return false;
    event.guestCount++;
    this.eventsJoined.push(event);
    return true;
  }

  isJoined(event) {
    return this.eventsJoined.indexOf(event) + 1;
  }
}

module.exports = User;