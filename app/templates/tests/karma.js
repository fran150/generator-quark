var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/\/base\/tests\/specs\/.*\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

requireConfig.baseUrl = '/base/src';
requireConfig.deps = tests;
requireConfig.callback = function() {
    require(['quark', 'qk-alchemy/main', 'app/startup'], function($$) {
        $$.start();
        window.__karma__.start();
    });
}

requirejs.config(requireConfig);
