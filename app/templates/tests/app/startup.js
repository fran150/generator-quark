define([
    'quark',
    'jasmine-boot',
    'qk-alchemy/main',
    'app/startup'
], function($$) {

    // Reference your test modules here

    // After the 'jasmine-boot' module creates the Jasmine environment, load all test modules then run them
    var testModules = [
        'home.screen.test'
    ];

    var modulesCorrectedPaths = testModules.map(function(m) { return '../tests/specs/' + m; });

    require(modulesCorrectedPaths, function() {
        window.onload();
    });
});
