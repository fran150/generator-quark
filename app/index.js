'use strict';
var util = require('util');
var path = require('path');
var Generator = require('yeoman-generator');
var welcome = require('yeoman-welcome');
var chalk = require('chalk');
var slugify = require('slugify');

var QuarkAppGenerator = class extends Generator {

    initializing() {
        this.log(welcome);
        this.log(chalk.magenta('You\'re using the fantastic Quark app generator.'));
    }

    prompting() {
        return this.prompt([{
            type    : 'input',
            name    : 'name',
            message : 'What\'s the name of tour new site?',
            default : path.basename(process.cwd())
        },
        {
            type    : 'input',
            name    : 'description',
            message : 'Please describe your application',
            store   : true
        },
        {
            type    : 'input',
            name    : 'authors',
            message : 'Please enter the application\'s author (or authors separated by comma)',
            store   : true
        },
        {
            type    : 'input',
            name    : 'keywords',
            message : 'Please enter the application\'s keywords (separated by comma)',
            store   : true
        },
        {
            type    : 'input',
            name    : 'license',
            message : 'Please enter the application\'s license type',
            default : 'MIT',
            store   : true
        },
        {
            type    : 'input',
            name    : 'homepage',
            message : 'Please enter the application\'s homepage',
            store   : true
        },
        ]).then(function (answers) {
            this.longName = answers.name;
            this.slugName = slugify(this.longName);
            this.description = answers.description;

            this.authors = new Array();
            var authors = answers.authors.split(',');
            for (let i = 0; i < authors.length; i++) {
                this.authors.push(authors[i].trim());
            }

            this.keywords = new Array();
            var keywords = answers.keywords.split(',');
            for (let i = 0; i < keywords.length; i++) {
                this.keywords.push(keywords[i].trim());
            }

            this.license = answers.license;
            this.homepage = answers.homepage;
        }.bind(this));
    }

    writing() {
        var info = {
            name: this.longName,
            shortName: this.slugName,
            description: this.description,
            authors: this.authors,
            keywords: this.keywords,
            license: this.license,
            homepage: this.homepage
        }

        this.log("Generating config...");
        this.fs.copyTpl(
            this.templatePath('./*.*'),
            this.destinationPath('.'),
            info
        );

        this.fs.copyTpl(
            this.templatePath('.*'),
            this.destinationPath('.'),
            info
        );

        this.log("Generating sources...");
        this.fs.copyTpl(
            this.templatePath('src/**/*'),
            this.destinationPath('src'),
            info
        );

        this.log("Generating test area...")
        this.fs.copyTpl(
            this.templatePath('tests/**/*'),
            this.destinationPath('tests'),
            info
        );
    }
    /*
    init: function () {

        this.on('end', function () {
            if (!this.options['skip-install']) {
                // Figure out whether we have an internet connection. If not, need to
                // pass --offline to bower otherwise it won't fall back on cache.
                require('dns').resolve('example.com', function (isOffline) {
                    console.log('Installing dependencies in ' + (isOffline ? 'offline' : 'online') + ' mode...');
                    if (isOffline) {
                        // Patch bowerInstall to pass --offline
                        this.bowerInstall = (function (originalFunction) {
                            return function (paths, options, cb) {
                                options = options || {};
                                options.offline = true;
                                return originalFunction.call(this, paths, options, cb);
                            };
                        })(this.bowerInstall);
                    }

                    this.installDependencies();

                    if (this.includeTests) {
                        // Install test dependencies too
                        var bowerArgs = ['install'];
                        if (isOffline) {
                            bowerArgs.push('--offline');
                        }
                        this.spawnCommand('bower', bowerArgs, {
                            cwd: 'test'
                        });
                    }
                }.bind(this));
            }
        });
    },

    askFor: function () {
        var done = this.async();
        this.log(this.yeoman);
        this.log(chalk.magenta('You\'re using the fantastic Knockout app generator.'));

        var prompts = [{
            name: 'name',
            message: 'What\'s the name of your new site?',
            default: path.basename(process.cwd())
    }, {
            type: 'list',
            name: 'codeLanguage',
            message: 'What language do you want to use?',
            choices: [languageChoice.js, languageChoice.ts]
    }, {
            type: 'confirm',
            name: 'includeTests',
            message: 'Do you want to include automated tests, using Jasmine and Karma?',
            default: true
    }];

        this.prompt(prompts, function (props) {
            this.longName = props.name;
            this.slugName = this._.slugify(this.longName);
            this.usesTypeScript = props.codeLanguage === languageChoice.ts;
            this.includeTests = props.includeTests;
            done();
        }.bind(this));
    },

    templating: function () {
        var excludeExtension = this.usesTypeScript ? '.js' : '.ts';
        this._processDirectory('src', 'src', excludeExtension);
        this.template('_package.json', 'package.json');
        this.template('_bower.json', 'bower.json');
        this.template('_gulpfile.js', 'gulpfile.js');
        this.template('_gitignore', '.gitignore');
        this.copy('bowerrc', '.bowerrc');

        if (this.includeTests) {
            // Set up tests
            this._processDirectory('test', 'test', excludeExtension);
            this.copy('bowerrc_test', 'test/.bowerrc');
            this.copy('karma.conf.js');
        }

        // Explicitly copy the .js files used by the .ts output, since they're otherwise excluded
        if (this.usesTypeScript) {
            this.copy('src/app/require.config.js');
            this._processDirectory('definitions', 'definitions');

            if (this.includeTests) {
                this.copy('test/require.config.js');
            }
        }
    },

    _processDirectory: function (source, destination, excludeExtension) {
        var root = this.isPathAbsolute(source) ? source : path.join(this.sourceRoot(), source);
        var files = this.expandFiles('**', {
            dot: true,
            cwd: root
        }).filter(function (filename) {
            return !excludeExtension || path.extname(filename) !== excludeExtension;
        });

        for (var i = 0; i < files.length; i++) {
            var f = files[i];
            var src = path.join(root, f);
            if (path.basename(f).indexOf('_') == 0) {
                var dest = path.join(destination, path.dirname(f), path.basename(f).replace(/^_/, ''));
                this.template(src, dest);
            } else {
                var dest = path.join(destination, f);
                this.copy(src, dest);
            }
        }
    }*/
}

module.exports = QuarkAppGenerator;
