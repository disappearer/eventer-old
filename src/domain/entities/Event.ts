import User from './User';

export default class Event {
  id: number;
  creatorId: number;
  title: string;
  description: string;
  date: Date;
  location: string;
  guestList: Array<number>;

  constructor(
    id: number,
    creatorId: number,
    title: string,
    description: string,
    date: Date,
    location: string
  ) {
    this.id = id;
    this.creatorId = creatorId;
    this.title = title;
    this.description = description;
    this.date = date;
    this.location = location;
  }

  addToGuestList(user: User) {
    if (this.isInGuestList(user)) throw new Error('UserAlreadyAddedException');
    if (!this.guestList) this.guestList = [];
    this.guestList.push(user.id);
    return true;
  }

  isInGuestList(user: User) {
    if (!this.guestList) return false;
    return this.guestList.find(function(guestListUserId) {
      return guestListUserId == user.id;
    });
  }
}
