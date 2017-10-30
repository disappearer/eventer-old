export default class RepositoryError extends Error {
  entityId: number;
  entityType: string;

  constructor(name: string, entityId: number, entityType: string) {
    super(name);
    this.entityId = entityId;
    this.entityType = entityType;
  }
}
