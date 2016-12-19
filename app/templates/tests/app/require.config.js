var require;

require = requireConfigure(QuarkRequireConf('bower_modules', true), {
    baseUrl: '..',
    paths: {
        'testing-views': 'tests/views',
        'bootstrap/js': 'bower_modules/bootstrap/dist/js/bootstrap.min',
        'bootstrap/css': 'bower_modules/bootstrap/dist/css/bootstrap.min',
        'bootstrap-switch': 'bower_modules/bootstrap-switch/dist/js/bootstrap-switch.min',
        'bootstrap-switch/bt3/css': 'bower_modules/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min',
        'qk-alchemy': './src'
    },
    shim: {
        "bootstrap": {
            "deps": ['jquery']
        }
    }
});

// It's not obvious, but this is a way of making Jasmine load and run in an AMD environment
// Credit: http://stackoverflow.com/a/20851265
var jasminePath = 'bower_modules/jasmine-core/lib/jasmine-core/';
require.paths['jasmine'] = jasminePath + 'jasmine';
require.paths['jasmine-html'] = jasminePath + 'jasmine-html';
require.paths['jasmine-boot'] = jasminePath + 'boot';
require.shim['jasmine'] = { exports: 'window.jasmineRequire' };
require.shim['jasmine-html'] = { deps: ['jasmine'], exports: 'window.jasmineRequire' };
require.shim['jasmine-boot'] = { deps: ['jasmine', 'jasmine-html'], exports: 'window.jasmineRequire' };
