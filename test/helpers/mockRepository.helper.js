class MockRepository {
  constructor(createEntity) {
    this.entities = [];
    this.createEntity = createEntity;
  }

  getById(id) {
    if (id in this.entities) return this.entities[id];
    const entity = this.createEntity(id);
    this.entities[id] = entity;
    return entity;
  }

  findOne(query) {
    return this.entities.find(entity => {
      return entity.email == query.email;
    });
  }

  add(entity) {
    /* create a new instance as repository implementation
       might return a different object altogether */
    var returnEntity = Object.assign(Object.create(entity), entity);
    returnEntity.id = this.entities.length;
    this.entities.push(returnEntity);
    return returnEntity;
  }

  update(entity) {
    if (!(entity.id in this.entities))
      throw new Error('UpdatingNonExistingEntityException, id:' + entity.id);
    this.entities[entity.id] = entity;
    return entity;
  }

  delete(entity) {
    this.entities.splice(entity.id, 1);
  }
}

class UserRepository extends MockRepository {
  constructor() {
    super(function(id) {
      return new User(id, 'User' + id, 'user' + id + '@mail.com');
    });
  }

  add(newUser) {
    if (this.entities.find(user => user.email == newUser.email))
      throw new Error('EmailInUseException');
    return super.add(newUser);
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
