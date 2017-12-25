import * as request from 'supertest';
import { userRepository } from '../../../../src/db/memory/InMemoryUserRepository';
import { server } from '../../../../src/http/server';
import { accessToken } from '../../../integration/integration.test.setup';

describe('GET /profile', () => {
  var agent = request.agent(server.app);
  const USERID = 246,
    ACCESS_TOKEN = 'randomString2';

  beforeAll(done => {
    server.userRepository = userRepository;
    done();
  });

  it('fails if not authorized', done => {
    agent.get('/profile').then(response => {
      expect(response.status).toEqual(401);
      done();
    });
  });

  it('returns user data json if authenticated', done => {
    Promise.all([
      agent.get(`/profile?access_token=${ACCESS_TOKEN}`),
      userRepository.getByAccessToken(ACCESS_TOKEN)
    ]).then(data => {
      expect(JSON.stringify(data[0].body.user)).toEqual(
        JSON.stringify(data[1])
      );
      done();
    });
  });
});
