var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/tests\/specs\/.*\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

requirejs.config({
    baseUrl: '/base',
    deps: tests,
    callback: function() {
        require(['quark', 'qk-alchemy/main'], function($$) {
            $$.start();
            window.__karma__.start();
        });
    }
});
