
class MockUserRepository {
  constructor() {
    this.user = new User(123, 'Aleksa', 'aleksa47@gmail.com');
  }

  getById() {
    return this.user;
  }

  save(user) {
    this.user = user;
  }
}

class MockEventRepository {
  constructor() {
    this.event = new Event(11, 123, 'Concert', 'ZooCore concert', new Date(), 'Zoo');
  }

  getById() {
    return this.event;
  }

  save(event) {
    this.event = event;
  }
}

global.MockUserRepository = MockUserRepository;
global.MockEventRepository = MockEventRepository;