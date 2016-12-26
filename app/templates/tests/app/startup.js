define([
    'quark',
    'jasmine-boot',
    'qk-alchemy/main',
    'app/startup'
], function($$) {

    require(['json!../tests/app/config/specs.config.json'], function(testModules) {
        // After the 'jasmine-boot' module creates the Jasmine environment, load all test modules then run them
        var modulesCorrectedPaths = testModules.map(function(m) { return '../tests/specs/' + m; });

        require(modulesCorrectedPaths, function() {
            window.onload();
        });
    });
});
