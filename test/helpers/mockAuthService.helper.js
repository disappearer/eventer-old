class MockAuthService {
  constructor(authenticated) {
    this.authenticated = authenticated;
  }

  isAuthenticated() {
    return this.authenticated;
  }
}

global.MockAuthService = MockAuthService;