define(['quark', 'jasmine-boot', 'qk-alchemy/main'], function($$, jazmine, main) {
    // Reference your test modules here

    // After the 'jasmine-boot' module creates the Jasmine environment, load all test modules then run them
    var testModules = [
        'layout.test',
        'switch.test'
    ];

    var modulesCorrectedPaths = testModules.map(function(m) { return 'tests/specs/' + m; });

    require(modulesCorrectedPaths, function() {
        window.onload();
    });

    $$.start();
});
