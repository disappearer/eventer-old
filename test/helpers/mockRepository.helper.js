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
    return new Promise(resolve => {
      var returnEntity = this.cloneEntity(entity);
      returnEntity.id = this.entities.length;
      this.entities.push(returnEntity);
      resolve(this.cloneEntity(returnEntity));
    });
  }

  update(entity) {
    return new Promise((resolve, reject) => {
      if (!(entity.id in this.entities)) {
        reject(
          new RepositoryError(
            'UpdatingNonExistingEntityException',
            entity.id,
            entity.constructor.name
          )
        );
      }

      this.entities[entity.id] = this.cloneEntity(entity);
      resolve(entity);
    });
  }

  delete(entity) {
    return new Promise((resolve, reject) => {
      if (!(entity.id in this.entities))
        reject(
          new RepositoryError(
            'DeletingNonExistingEntityException',
            entity.id,
            entity.constructor.name
          )
        );
      this.entities.splice(entity.id, 1);
      resolve();
    });
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

  async add(newUser) {
    if (this.entities.find(user => user.email == newUser.email))
      throw new Error('EmailInUseException');
    return await super.add(newUser);
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

class RepositoryError extends Error {
  constructor(name, entityId, entityType) {
    super(name);
    this.entityId = entityId;
    this.entityType = entityType;
  }
}

global.UserRepository = UserRepository;
global.EventRepository = EventRepository;
global.testDbData = dbData;
global.RepositoryError = RepositoryError;
