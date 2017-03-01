
require = requireConfigure(QuarkRequireConf('bower_modules', false));
require = requireConfigure(require, {
    paths: {
        'app/config':                   'app/config',
        'app/services':                 'services',
        'bootstrap/js':                 'bower_modules/bootstrap/dist/js/bootstrap.min',
        'bootstrap/css':                'bower_modules/bootstrap/dist/css/bootstrap.min',
        'switchery-require':            'bower_modules/switchery-require/dist',
        'font-awesome/css':             'bower_modules/font-awesome/css/font-awesome.min',
        'qk-alchemy':                   'bower_modules/qk-alchemy/dist',
        'json':                         'bower_modules/requirejs-plugins/src/json',
        'loading-overlay':              'bower_modules/gasparesganga-jquery-loading-overlay/src/loadingoverlay.min'
    },
    shim: {
        "bootstrap/js": {
            "deps": ['jquery']
        },
        "bootstrap-switch/js": {
            "deps": ['bootstrap/js']
        }
    }
});
