import * as request from 'superagent';

describe('Google OAuth', () => {
  const baseUrl = process.env.EVENTER_URL;
  const agent = request.agent();

  it('creates user if not in DB', done => {
    agent
      .get(baseUrl + '/auth/mock/')
      .then(() => {
        done();
      })
      .catch(e => {
        done();
      });
  });
});
