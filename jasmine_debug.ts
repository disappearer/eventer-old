const Jasmine = require('jasmine');
const _jasmine = new Jasmine();

_jasmine.loadConfigFile('spec/unit/jasmine_unit_tests.json');
_jasmine.configureDefaultReporter({
  showColors: false
});
_jasmine.execute();
