const User = require(process.env.SRC + '/domain/entities/User');
const Event = require(process.env.SRC + '/domain/entities/Event');
const dbData = require('./dbData.json');

class MockRepository {
  constructor(createEntity) {
    this.entities = [];
    this.createEntity = createEntity;
  }

  getById(id) {
    return new Promise(resolve => {
      if (id in this.entities) resolve(this.cloneEntity(this.entities[id]));
      const entity = this.createEntity(id);
      this.entities[id] = entity;
      resolve(this.cloneEntity(entity));
    });
  }

  findOne(query) {
    return new Promise(resolve => {
      const returnEntity = this.entities.find(entity => {
        return entity.email == query.email;
      });
      resolve(returnEntity && this.cloneEntity(returnEntity));
    });
  }

  getAll() {
    return new Promise(resolve => {
      resolve(
        this.entities.map(function(entity) {
          return this.cloneEntity(entity);
        }, this)
      );
    });
  }

  add(entity) {
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

  getAll() {
    return new Promise(resolve => {
      var eventList = this.entities.map(entity => {
        return this.cloneEntity(entity);
      }, this);
      eventList.sort((e1, e2) => {
        return e1.date - e2.date;
      });
      resolve(eventList);
    });
  }

  getFuture() {
    return new Promise(resolve => {
      var eventList = this.entities.map(entity => {
        return this.cloneEntity(entity);
      }, this);
      eventList.sort((e1, e2) => {
        return e1.date - e2.date;
      });
      const now = new Date();
      resolve(
        eventList.filter(event => {
          return event.date > now;
        })
      );
    });
  }
}

global.UserRepository = UserRepository;
global.EventRepository = EventRepository;
global.testDbData = dbData;
