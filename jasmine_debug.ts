const Jasmine = require('jasmine');
const _jasmine = new Jasmine();

_jasmine.loadConfigFile('spec/support/jasmine.json');
_jasmine.configureDefaultReporter({
  showColors: false
});
_jasmine.execute();
