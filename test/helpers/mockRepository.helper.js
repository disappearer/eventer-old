class MockRepository {
  constructor(createEntity) {
    this.entities = {};
    this.createEntity = createEntity;
  }

  getById(id) {
    if (id in this.entities) return this.entities[id];
    const entity = this.createEntity(id);
    this.entities[id] = entity;
    return entity;
  }

  save(entity) {
    this.entities[entity.id] = entity;
    return entity;
  }
}

class UserRepository extends MockRepository {
  constructor() {
    super(function(id) {
      return new User(id, 'User' + id, 'user' + id + '@mail.com');
    });
  }
}

class EventRepository extends MockRepository {
  constructor() {
    super(function(id) {
      return new Event(
        id,
        123 + id,
        'Event' + id,
        'Event with id: ' + id,
        new Date(),
        id + ' Baker Street'
      );
    });
  }
}

global.UserRepository = UserRepository;
global.EventRepository = EventRepository;
