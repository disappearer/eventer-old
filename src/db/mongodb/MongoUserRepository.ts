import UserRepository from '../../domain/repositories/UserRepository';
import User from '../../domain/entities/User';

import { Collection } from 'mongodb';

interface authProviderCollections {
  [key: string]: Collection;
  local?: Collection;
  google: Collection;
  facebook?: Collection;
  twitter?: Collection;
}

export default class MongoUserRepository implements UserRepository {
  users: Collection;
  authProviders: authProviderCollections;

  constructor(users: Collection, authProviders: authProviderCollections) {
    this.users = users;
    this.authProviders = authProviders;
  }

  async add(user: User): Promise<User> {
    delete user.id;
    const authenticationInfo = user.authenticationInfo;
    delete user.authenticationInfo;
    const insertResult = await this.users.insertOne(user);
    const userId = insertResult.ops[0]._id;

    const authentication = await Promise.all(
      authenticationInfo.map(async authInfo => {
        const dbAuthInfo = Object.assign({ userId: userId }, authInfo);
        delete dbAuthInfo.provider;
        const result = await this.authProviders[authInfo.provider].insertOne(
          dbAuthInfo
        );
        return {
          providerName: authInfo.provider,
          providerInfoId: result.ops[0]._id
        };
      })
    );

    this.users.updateOne(
      { _id: userId },
      { $set: { authentication: authentication } }
    );

    const domainUser = Object.assign(new User(), {
      id: userId,
      authenticationInfo: authenticationInfo
    });

    return domainUser;
  }

  async updateEventsJoined(user: User): Promise<User> {
    const result = await this.users.findOneAndUpdate(
      { _id: user.id },
      { $set: { eventsJoined: user.eventsJoined } },
      { returnOriginal: false }
    );
    if (!result.value) throw new Error('User update failed');
    return toDomainUser(result.value, user.authenticationInfo);
  }

  async updateVerified(user: User): Promise<User> {
    return null;
  }

  async findOne(query: any) {
    return Promise.resolve(null);
  }

  async getById(id: Number): Promise<User> {
    const dbUser = await this.users.findOne({ _id: id });
    if (!dbUser) return null;
    const dbAuth = await Promise.all(
      dbUser.authentication.map(async (authDbInfo: any) => {
        const authInfo = await this.authProviders[
          authDbInfo.providerName
        ].findOne({ _id: authDbInfo.providerInfoId });
        authInfo.provider = authDbInfo.providerName;
        return authInfo;
      })
    );
    return toDomainUser(dbUser, dbAuth);
  }

  async getByAuthProviderId(provider: string, id: number): Promise<User> {
    const authRecord = await this.authProviders[provider].findOne({ id: id });
    if (!authRecord) return null;
    return await this.getById(authRecord.userId);
  }

  async delete(user: User) {}
}

export function toDomainUser(dbUser: any, dbAuthInfo: any): User {
  const domainUser = Object.assign(new User(), dbUser);
  domainUser.id = domainUser._id;
  delete domainUser._id;
  delete domainUser.authentication;
  domainUser.authenticationInfo = dbAuthInfo.map((providerInfo: any) => {
    const authInfo = Object.assign({}, providerInfo);
    delete authInfo._id;
    delete authInfo.userId;
    return authInfo;
  });
  return domainUser;
}
