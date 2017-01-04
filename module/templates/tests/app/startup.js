define(['quark', 'jasmine-boot', 'qk-<%- slugName %>/main'], function($$, jazmine, main) {
    // Reference your test modules here
    require(['json!./tests/app/config/specs.config.json'], function(testModules) {

        // After the 'jasmine-boot' module creates the Jasmine environment, load all t
        var modulesCorrectedPaths = testModules.map(function(m) { return 'tests/specs/' + m; });

        require(modulesCorrectedPaths, function() {
            window.onload();
        });

        $$.start();
    });
});
