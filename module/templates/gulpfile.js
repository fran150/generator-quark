// Node modules
var fs = require('fs'),
    vm = require('vm'),
    merge = require('deeply'),
    chalk = require('chalk'),
    es = require('event-stream'),
    del = require('del');

// Gulp and plugins
var gulp = require('gulp'),
    rjs = require('gulp-requirejs-bundler-quark'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    replace = require('gulp-replace'),
    uglify = require('gulp-uglify'),
    htmlreplace = require('gulp-html-replace');

// Load module config from json
var moduleConfig = require('./gulp.conf.json');

// Setup require optimizer
var requireJsRuntimeConfig = vm.runInNewContext(
    fs.readFileSync('bower_modules/quark/dist/require.configurator.js') + ';' +
    fs.readFileSync('bower_modules/quark/dist/quark.require.conf.js') + ';' +
    'require = requireConfigure(QuarkRequireConf(\'bower_modules\'));'
);

// Gulp default's configuration for Quark Modules
var config = {
    out: 'main.js',
    baseUrl: '.',
    paths: {
        'quark': 'empty:',
        'knockout': 'empty:',
        'jquery': 'empty:',
        'json': 'bower_modules/requirejs-plugins/src/json'
    },
    exclude: ['text', 'loadCss', 'json']
}

// Add module's entry point as main file to process
config.name = moduleConfig.name + '/main';

// Set module's path
config.paths[moduleConfig.name] = './src';

// Add all included files prefixing the module name
if (moduleConfig.include) {
    config.include = new Array();
    for (var i = 0; i < moduleConfig.include.length; i++) {
        config.include.push(moduleConfig.name + '/' + moduleConfig.include[i]);
    }
}

// Add all excluded files prefixing the module name
if (moduleConfig.exclude) {
    for (var i = 0; i < moduleConfig.exclude.length; i++) {
        config.exclude.push(moduleConfig.name + '/' + moduleConfig.include[i]);
    }
}

// Add all included bundles prefixing the module name
if (moduleConfig.bundles) {
    config.bundles = {};
    for (var name in moduleConfig.bundles) {
        // New bundle name
        var newName = moduleConfig.name + '/' + name;

        // Copy bundle config to final config
        config.bundles[newName] = moduleConfig.bundles[name];

        // Prefix all file paths with the bundle new name
        for (var i = 0; i < config.bundles[newName].length; i++) {
            config.bundles[newName][i] = moduleConfig.name + '/' + config.bundles[newName][i];
        }
    }
}

if (moduleConfig.externals) {
    for (var i = 0; i < moduleConfig.externals.length; i++) {
        config.paths[moduleConfig.externals[i]] = "empty:";
    }
}

// Add a require to resulting file pointing to module's main file
config.insertRequire = [
    moduleConfig.name + '/main'
]

// Configure require optimizer
requireJsOptimizerConfig = merge(requireJsRuntimeConfig, config);

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
// and writes all files in ./dist.
gulp.task('js', function () {
    if (moduleConfig.uglify !== false) {
        return rjs(requireJsOptimizerConfig)
            .pipe(uglify({ preserveComments: 'some' }))
            .pipe(gulp.dest('./dist/'));
    } else {
        return rjs(requireJsOptimizerConfig)
            .pipe(gulp.dest('./dist/'));
    }
});


gulp.task('bundles', ['js'], function() {
    return gulp.src('./dist/' + moduleConfig.name + '/*.js')
                .pipe(clean())
                .pipe(gulp.dest('./dist'));
});

gulp.task('cleaning', ['js', 'bundles'], function() {
    del.sync(['./dist/' + moduleConfig.name]);
});

gulp.task('css', function() {
    return gulp.src('./src/css/**/*')
                .pipe(gulp.dest('./dist/css'));
});

gulp.task('default', ['js', 'bundles', 'css', 'cleaning'], function(callback) {
    callback();
    console.log('\nPlaced optimized files in ' + chalk.green('dist/\n'));
});
