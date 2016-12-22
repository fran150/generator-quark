// Point all local files to src folder so tests can run in the root folder
for (var name in require.paths) {
    var path = require.paths[name];

    if (path.indexOf('http') !== 0) {
        require.paths[name] = 'src/' + path;
    }
}

// Set the require url in root folder and test views folder
require.baseUrl = '..';
require.paths['testing-views'] = 'tests/views';


// It's not obvious, but this is a way of making Jasmine load and run in an AMD environment
// Credit: http://stackoverflow.com/a/20851265
var jasminePath = 'src/bower_modules/jasmine-core/lib/jasmine-core/';
require.paths['jasmine'] = jasminePath + 'jasmine';
require.paths['jasmine-html'] = jasminePath + 'jasmine-html';
require.paths['jasmine-boot'] = jasminePath + 'boot';
require.shim['jasmine'] = { exports: 'window.jasmineRequire' };
require.shim['jasmine-html'] = { deps: ['jasmine'], exports: 'window.jasmineRequire' };
require.shim['jasmine-boot'] = { deps: ['jasmine', 'jasmine-html'], exports: 'window.jasmineRequire' };
