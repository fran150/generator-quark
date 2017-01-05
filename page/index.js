'use strict';
var util = require('util');
var path = require('path');
var Generator = require('yeoman-generator');
var welcome = require('yeoman-welcome');
var chalk = require('chalk');
var slugify = require('slugify');
var pascalCase = require('pascal-case');

var QuarkPageGenerator = class extends Generator {

    initializing() {
        this.log(chalk.cyan("   ____                   _      _            "));
        this.log(chalk.cyan("  / __ \\                 | |    (_)          "));
        this.log(chalk.cyan(" | |  | |_   _  __ _ _ __| | __  _ ___        "));
        this.log(chalk.cyan(" | |  | | | | |/ _` | '__| |/ / | / __|       "));
        this.log(chalk.cyan(" | |__| | |_| | (_| | |  |   < _| \\__ \\     "));
        this.log(chalk.cyan("  \\___\\_\\\\__,_|\\__,_|_|  |_|\\_(_) |___/ "));
        this.log(chalk.cyan("                               _/ |           "));
        this.log(chalk.cyan("                               |__/           "));
        this.log(chalk.magenta('You\'re using the fantastic Quark PAGE generator!!!'));

        this.info = {};
    }

    _promptParams(params, index, max) {
        return this.prompt([{
            type    : 'input',
            name    : 'name',
            message : (index + 1) + ' - Enter the parameter name:'
        },
        {
            type    : 'input',
            name    : 'value',
            message : (index + 1) + ' - Enter the parameter default value:'
        }]).then(function (answers) {
            params[index] = {
                name: answers.name,
                value: answers.value
            }

            index += 1;

            if (index < max) {
                return this._promptParams(params, index, max);
            }
        }.bind(this));
    }

    _promptParamsCount() {
        return this.prompt([{
            type    : 'input',
            name    : 'paramsCount',
            message : 'Plese enter the number of parameter for this route:',
            default : 1
        }]).then(function (answers) {
            this.info.paramsCount = answers.paramsCount;

            this.info.params = new Array();

            if (answers.paramsCount > 0) {
                return this._promptParams(this.info.params, 0, answers.paramsCount);
            }
        }.bind(this));
    }

    _promptAskForParams() {
        return this.prompt([{
            type    : 'confirm',
            name    : 'addParams',
            message : 'Do you want to add params to this route?',
            default : true
        }]).then(function (answers) {
            this.info.addParams = answers.addParams;

            if (answers.addParams) {
                return this._promptParamsCount();
            }
        }.bind(this));
    }

    _promptRouteName() {
        return this.prompt([{
            type    : 'input',
            name    : 'route',
            message : 'Plese enter the route name for this page:'
        }]).then(function (answers) {
            this.info.route = answers.route;

            return this._promptAskForParams();
        }.bind(this));
    }

    _promptAskForRoute() {
        return this.prompt([{
            type    : 'confirm',
            name    : 'addRoute',
            message : 'Do you want to add a route to this page?',
            default : true
        }]).then(function (answers) {
            this.info.addRoute = answers.addRoute;

            if (answers.addRoute) {
                return this._promptRouteName();
            }
        }.bind(this));
    }

    _promptOutletDetails(outlet, index, max) {
        return this.prompt([{
            type    : 'input',
            name    : 'name',
            message : (index + 1) + ' - Enter the outlet name:'
        },
        {
            type    : 'input',
            name    : 'component',
            message : (index + 1) + ' - Enter the component name:'
        }]).then(function (answers) {
            outlet[index] = {
                name: answers.name,
                component: answers.component
            }

            index += 1;

            if (index < max) {
                return this._promptOutletDetails(outlet, index, max);
            } else {
                return this._promptAskForRoute();
            }
        }.bind(this));
    }

    prompting() {
        return this.prompt([{
            type    : 'input',
            name    : 'page',
            message : 'Enter the full page name:'
        },
        {
            type    : 'input',
            name    : 'outlets',
            message : 'Enter the number of outlets defined in the page:',
            default : 1
        }]).then(function (answers) {
            this.info.page = answers.page;
            this.info.outlets = answers.outlets;

            this.info.outletData = new Array();

            if (answers.outlets > 0) {
                return this._promptOutletDetails(this.info.outletData, 0, answers.outlets);
            }
        }.bind(this));
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
        console.log(this.info);
        /*
        this.log('Registering Page...');
        // Get the components JSON
        var jsonPath = this.destinationPath('src/app/config/components/screens.config.json');
        var content = this.fs.read(jsonPath);
        var config = JSON.parse(content);

        // Clone the namespaces array
        var namespaces = this.info.namespaces.slice();
        config = this._addNamespace(config, namespaces);

        // Sort the objects keys
        var ordered = this._sortObjectKeys(config);

        // Rewrite JSON file
        this.fs.write(jsonPath, JSON.stringify(ordered, null, 4));

        // If Tests are be enabled
        if (this.info.tests) {
            this.log('Generating tests...');

            // Generate test spec
            this.fs.copyTpl(
                this.templatePath('tests/specs/screen.test.js'),
                this.destinationPath('tests/specs/' + this.info.tag + '.test.js'),
                this.info
            );
            // Generate view
            this.fs.copyTpl(
                this.templatePath('tests/views/screen.html'),
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
        }*/
    }
}

module.exports = QuarkPageGenerator;
