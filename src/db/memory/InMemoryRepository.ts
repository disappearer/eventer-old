import Repository from '../../domain/repositories/Repository';
import RepositoryError from '../../domain/repositories/RepositoryError';

export default class InMemoryRepository implements Repository<any> {
  entities: Array<any>;
  createEntity: Function;

  constructor(createEntity: Function) {
    this.entities = [];
    this.createEntity = createEntity;
  }

  getById(id: number) {
    return new Promise(resolve => {
      if (id in this.entities) resolve(this.cloneEntity(this.entities[id]));
      const entity = this.createEntity(id);
      this.entities[id] = entity;
      resolve(this.cloneEntity(entity));
    });
  }

  findOne(query: any) {
    return new Promise(resolve => {
      const returnEntity = this.entities.find(entity => {
        return entity.email == query.email;
      });
      resolve(returnEntity && this.cloneEntity(returnEntity));
    });
  }

  getAll(): Promise<Array<any>> {
    return new Promise(resolve => {
      resolve(
        this.entities.map(function(entity) {
          return this.cloneEntity(entity);
        }, this)
      );
    });
  }

  add(entity: any) {
    return new Promise(resolve => {
      var returnEntity = this.cloneEntity(entity);
      returnEntity.id = this.entities.length;
      this.entities.push(returnEntity);
      resolve(this.cloneEntity(returnEntity));
    });
  }

  update(entity: any) {
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

  delete(entity: any) {
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

  cloneEntity(entity: any) {
    return Object.assign(Object.create(entity), entity);
  }
}
