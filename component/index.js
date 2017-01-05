'use strict';
var util = require('util');
var path = require('path');
var Generator = require('yeoman-generator');
var welcome = require('yeoman-welcome');
var chalk = require('chalk');
var slugify = require('slugify');
var pascalCase = require('pascal-case');

var QuarkComponentGenerator = class extends Generator {

    initializing() {
        this.log(chalk.yellow("   ____                   _      _            "));
        this.log(chalk.yellow("  / __ \\                 | |    (_)          "));
        this.log(chalk.yellow(" | |  | |_   _  __ _ _ __| | __  _ ___        "));
        this.log(chalk.yellow(" | |  | | | | |/ _` | '__| |/ / | / __|       "));
        this.log(chalk.yellow(" | |__| | |_| | (_| | |  |   < _| \\__ \\     "));
        this.log(chalk.yellow("  \\___\\_\\\\__,_|\\__,_|_|  |_|\\_(_) |___/ "));
        this.log(chalk.yellow("                               _/ |           "));
        this.log(chalk.yellow("                               |__/           "));
        this.log(chalk.magenta('You\'re using the fantastic Quark COMPONENT generator!!!'));

        this.argument('tag', {
            required: true,
            type: String,
            desc: 'Full Tag name of the new component'
        });

        this.option('notest', {
            required: false,
            type: Boolean,
            desc: 'Must not generate test files for the component',
            default: false
        });

        this.option('nobuild', {
            required: false,
            type: Boolean,
            desc: 'Must include the component on built files',
            default: false
        });

        this.info = {};

        // Get info from attributes
        this.info.tag = this.options['tag'];
        this.info.noTest = this.options['notest'];
        this.info.noBuild = this.options['nobuild'];

        // Get namespaces
        this.info.namespaces = this.info.tag.split('-');

        // Define base dir for require and file
        this.info.componentsReqBase = 'components';
        this.info.componentsFileBase = 'src/components';

        // The component name is the last part of the namespace
        var name = this.info.namespaces[this.info.namespaces.length - 1];

        // Get the model and view name module name
        this.info.modelName = name + '.component';
        this.info.viewName = name + '.component';

        // Get the model and view file name
        this.info.modelFileName = this.info.modelName + '.js';
        this.info.viewFileName = this.info.viewName + '.html';

        // Clone namespaces array
        var folders = this.info.namespaces.slice();
        folders.pop();
        var folder = folders.join('/');

        if (folders != '') {
            folder = '/' + folder;
        }

        // Get the file path of the model and view
        this.info.modelPath = this.info.componentsFileBase + folder + '/' + this.info.modelFileName;
        this.info.viewPath = this.info.componentsFileBase + folder + '/' + this.info.viewFileName;

        // Get the require path for model and view
        this.info.modelReqPath = this.info.componentsReqBase + folder + '/' + this.info.modelName;
        this.info.viewReqPath = this.info.componentsReqBase + folder + '/' + this.info.viewName;

        // Get the class name from tag
        this.info.className = pascalCase(this.info.tag) + 'Component';

        var moduleMain = this.destinationPath('src/main.js');
        var moduleConfig = this.destinationPath('src/main.json');

        this.info.isModule = this.fs.exists(moduleMain) && this.fs.exists(moduleConfig);
    }

    prompting() {
        // If the noTest flag is NOT applied prompt for tests
        if (!this.info.noTest) {
            return this.prompt([{
                type    : 'confirm',
                name    : 'tests',
                message : 'Do you want to generate test files for this component?',
                default : true
            }]).then(function (answers) {
                this.info.tests = answers.tests;
            }.bind(this));
        } else {
            this.info.tests = false;
        }
    }

    _addNamespace(config, namespaces) {
        var name = namespaces.shift();

        if (namespaces.length > 0) {
            config[name] = this._addNamespace(config[name], namespaces);
        } else {
            // If the current namespace is an object add a new property
            if (config !== null && typeof config === 'object' && !(config instanceof Array)) {
                config[name] = this.info.modelReqPath;
            } else {
                // If not, move the config to an empty value and add the new property
                var temp = config;

                config = {
                    "": temp
                };

                config[name] = this.info.modelReqPath;
            }
        }

        return config;
    }

    _sortObjectKeys(data) {
        var keys = new Array();

        for (var key in data) {
            keys.push(key);
        }

        keys.sort();

        var result = {};

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var item = data[key];

            if (item !== null && typeof item === 'object' && !(item instanceof Array)) {
                result[key] = this._sortObjectKeys(item);
            } else {
                result[key] = item;
            }
        }

        return result;
    }


    writing() {

        if (this.info.isModule) {
            this.log(chalk.red.bold('Running in a Module...'));
        }

        this.log('Generating component...');
        this.fs.copyTpl(
            this.templatePath('model.js'),
            this.destinationPath(this.info.modelPath),
            this.info
        );
        this.fs.copyTpl(
            this.templatePath('view.html'),
            this.destinationPath(this.info.viewPath),
            this.info
        );

        this.log('Registering component...');

        // Get the components JSON
        var jsonPath;
        if (this.info.isModule) {
            jsonPath = this.destinationPath('src/main.json');
        } else {
            jsonPath = this.destinationPath('src/app/config/components/components.config.json');
        }

        var content = this.fs.read(jsonPath);
        var config = JSON.parse(content);

        // If this is a module set the prefix
        if (this.info.isModule) {
            this.info.prefix = config.prefix;
        }

        // Clone the namespaces array
        var namespaces = this.info.namespaces.slice();

        if (this.info.isModule) {
            config.namespaces = this._addNamespace(config.namespaces, namespaces);
        } else {
            config = this._addNamespace(config, namespaces);
        }

        // Sort the objects keys
        var ordered = this._sortObjectKeys(config);

        // Rewrite JSON file
        this.fs.write(jsonPath, JSON.stringify(ordered, null, 4));

        // If Tests are be enabled
        if (this.info.tests) {
            this.log('Generating tests...');

            // Generate test spec
            this.fs.copyTpl(
                this.templatePath('tests/specs/component.test.js'),
                this.destinationPath('tests/specs/' + this.info.tag + '.test.js'),
                this.info
            );
            // Generate view
            this.fs.copyTpl(
                this.templatePath('tests/views/component.html'),
                this.destinationPath('tests/views/' + this.info.tag + '.html'),
                this.info
            );


            this.log('Registering test...');

            // Read the specs config
            jsonPath = this.destinationPath('tests/app/config/specs.config.json');
            content = this.fs.read(jsonPath);
            config = JSON.parse(content);

            // If the spec name is not used
            var specName = this.info.tag + '.test';
            if (!config.includes(specName)) {
                // Add the spec name, sort the array a
                config.push(specName);

                config.sort();

                this.fs.write(jsonPath, JSON.stringify(config, null, 4));
            }
        }

        // ifnthe nobuild option is NOT specified
        if (!this.info.noBuild) {
            // Read the build config
            this.log('Adding to build output...');
            jsonPath = this.destinationPath('gulp.conf.json');
            content = this.fs.read(jsonPath);//
            config = JSON.parse(content);

            var exists = config.include.includes(this.info.modelReqPath);

            if (!exists) {
                for (var name in config.bundles) {
                    var bundle = config.bundles[name];

                    if (bundle.includes(this.info.modelReqPath)) {
                        exists = true;
                        break;
                    }
                }
            }

            if (!exists) {
                config.include.push(this.info.modelReqPath);

                config.include = config.include.sort();

                this.fs.write(jsonPath, JSON.stringify(config, null, 4));
            }
        }
    }
}

module.exports = QuarkComponentGenerator;
