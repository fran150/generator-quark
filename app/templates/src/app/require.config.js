
require = requireConfigure(QuarkRequireConf('bower_modules', false));
require = requireConfigure(require, {
    paths: {
        'config':                       'app/config',
        'services':                     'services',
        'bootstrap/js':                 'bower_modules/bootstrap/dist/js/bootstrap.min',
        'bootstrap/css':                'bower_modules/bootstrap/dist/css/bootstrap.min',
        'bootstrap-switch/js':          'bower_modules/bootstrap-switch/dist/js/bootstrap-switch.min',
        'bootstrap-switch/bt3/css':     'bower_modules/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min',
        'font-awesome/css':             'bower_modules/font-awesome/css/font-awesome.min',
        'qk-alchemy':                   'bower_modules/qk-alchemy/dist',
        'json':                         'bower_modules/requirejs-plugins/src/json'
    },
    shim: {
        "bootstrap/js": {
            "deps": ['jquery']
        },
        "bootstrap-switch/js": {
            "deps": ['boostrap']
        }
    }
});
