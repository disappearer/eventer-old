const User = require(process.env.SRC + '/domain/entities/User');
const Event = require(process.env.SRC + '/domain/entities/Event');
const dbData = require('./dbData.json');

class MockRepository {
  constructor(createEntity) {
    this.entities = [];
    this.createEntity = createEntity;
  }

  getById(id) {
    if (id in this.entities) return this.cloneEntity(this.entities[id]);
    const entity = this.createEntity(id);
    this.entities[id] = entity;
    return this.cloneEntity(entity);
  }

  findOne(query) {
    const returnEntity = this.entities.find(entity => {
      return entity.email == query.email;
    });
    return returnEntity && this.cloneEntity(returnEntity);
  }

  add(entity) {
    /* create a new instance as repository implementation
       might return a different object altogether */
    var returnEntity = this.cloneEntity(entity);
    returnEntity.id = this.entities.length;
    this.entities.push(returnEntity);
    return this.cloneEntity(returnEntity);
  }

  update(entity) {
    if (!(entity.id in this.entities))
      throw new Error('UpdatingNonExistingEntityException, id:' + entity.id);
    this.entities[entity.id] = this.cloneEntity(entity);
    return entity;
  }

  delete(entity) {
    this.entities.splice(entity.id, 1);
  }

  cloneEntity(entity) {
    return Object.assign(Object.create(entity), entity);
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
global.testDbData = dbData;
