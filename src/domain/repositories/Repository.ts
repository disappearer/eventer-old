export default interface Repository<T> {
  getById(id: number): Promise<T>;
  findOne(query: any): Promise<T>;
  getAll(): Promise<Array<T>>;
  add(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(entity: T): Promise<any>;
};
