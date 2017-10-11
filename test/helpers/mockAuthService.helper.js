const authServiceSuccess = { isAuthenticated: function () { return true; } };
const authServiceFail = { isAuthenticated: function () { return false; } };

global.authServiceSuccess = authServiceSuccess;
global.authServiceFail = authServiceFail;