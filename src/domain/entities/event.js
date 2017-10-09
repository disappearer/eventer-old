class Event {
  constructor(id, creatorId, title, description, date, location) {
    this.id = id;
    this.creatorId = creatorId;
    this.title = title;
    this.description = description;
    this.date = date;
    this.location = location;
    this.guestCount = 0;
  }

  toString() {
    return 'ID: ' + this.id + ', CreatorID: ' + this.creatorId +
      ', Title: ' + this.title + ', Description: ' + this.description +
      ', Time: ' + this.date + ', Location: ' + this.location;
  }
}

module.exports = Event;