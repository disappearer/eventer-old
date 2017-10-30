import User from './User';

export default class Event {
  id: number;
  creatorId: number;
  title: string;
  description: string;
  date: Date;
  location: string;
  guestList: Array<User>;

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
    this.guestList = [];
  }

  addToGuestList(user: User) {
    if (this.isInGuestList(user)) throw new Error('UserAlreadyAddedException');
    this.guestList.push(user);
    return true;
  }

  isInGuestList(user: User) {
    return this.guestList.find(function(guestListUser) {
      return guestListUser.id == user.id;
    });
  }
}
