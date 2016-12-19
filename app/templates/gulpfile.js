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
    fs.readFileSync('src/bower_modules/quark/dist/require.configurator.js') + ';' +
    fs.readFileSync('src/bower_modules/quark/dist/quark.require.conf.js') + ';' +
    fs.readFileSync('src/app/require.config.js') + '; require;'
);

// Gulp default's configuration for Quark Modules
var config = {
    out: 'scripts.js',
    baseUrl: './src',
    name: 'app/startup',
    paths: {
        requireLib: 'bower_modules/requirejs/require'
    },
    insertRequire: ['app/startup'],
    include: [
        'requireLib'
    ],
    cssOutDir: './dist'
}

// Add all included files prefixing the module name
if (moduleConfig.include) {
    for (var i = 0; i < moduleConfig.include.length; i++) {
        config.include.push(moduleConfig.include[i]);
    }
}

// Add all excluded files prefixing the module name
if (moduleConfig.exclude) {
    moduleConfig.exclude = new Array();
    for (var i = 0; i < moduleConfig.exclude.length; i++) {
        config.exclude.push(moduleConfig.include[i]);
    }
}

// Add all included bundles prefixing the module name
if (moduleConfig.bundles) {
    config.bundles = {};
    for (var name in moduleConfig.bundles) {
        // Copy bundle config to final config
        config.bundles[name] = moduleConfig.bundles[name];

        // Prefix all file paths with the bundle new name
        for (var i = 0; i < config.bundles[name].length; i++) {
            config.bundles[name][i] = config.bundles[name][i];
        }
    }
}

if (moduleConfig.externals) {
    for (var i = 0; i < moduleConfig.externals.length; i++) {
        config.paths[moduleConfig.externals[i]] = "empty:";
    }
}

// Configure require optimizer
var requireJsOptimizerConfig = merge(requireJsRuntimeConfig, config);

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

gulp.task('require', function() {
    gulp.src([
        './src/app/require.config.js',
        './src/bower_modules/quark/dist/require.configurator.js',
        './src/bower_modules/quark/dist/quark.require.conf.js',
        ])
        .pipe(gulp.dest('./dist/app'));
});

gulp.task('copy', function() {
    if (moduleConfig.copy) {
        return gulp.src(moduleConfig.copy, { "base" : "./src" })
            .pipe(gulp.dest('./dist/'));
    }
});

gulp.task('css', function() {
    return gulp.src('./src/css/**/*')
                .pipe(gulp.dest('./dist/css'));
});

// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('html', function() {
    return gulp.src('./src/index.html')
        .pipe(htmlreplace({
            'js': [
                'app/require.configurator.js',
                'app/quark.require.conf.js',
                'app/require.config.js',
                'scripts.js'
            ]
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['js', 'css', 'html', 'require', 'copy'], function(callback) {
    callback();
    console.log('\nPlaced optimized files in ' + chalk.green('dist/\n'));
});
