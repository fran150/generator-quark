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

        var moduleMain = this.destinationPath('src/main.js');
        var moduleConfig = this.destinationPath('src/main.json');

        this.info.isModule = this.fs.exists(moduleMain) && this.fs.exists(moduleConfig);

    }

    _promptParams(params, index, max) {
        return this.prompt([{
            type    : 'input',
            name    : 'name',
            message : 'Parameter ' + (index + 1) + ' - Enter the parameter name:'
        },
        {
            type    : 'input',
            name    : 'value',
            message : 'Parameter ' + (index + 1) + ' - Enter the parameter default value:'
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
            message : 'Outlet ' + (index + 1) + ' - Enter the outlet name:'
        },
        {
            type    : 'input',
            name    : 'component',
            message : 'Outlet ' + (index + 1) + ' - Enter the component name:'
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
        if (this.info.isModule) {
            this.log(chalk.red.bold('Running in a Module...'));
        }

        this.log('Registering Page...');

        // Get the routes JSON
        var jsonPath;
        if (this.info.isModule) {
            jsonPath = this.destinationPath('src/main.json');
        } else {
            jsonPath = this.destinationPath('src/app/config/routing/pages.config.json');
        }

        var content = this.fs.read(jsonPath);
        var config = JSON.parse(content);

        // If there is no config for the page then create one
        if (this.info.isModule) {
            if (!config.pages) {
                config.pages = {};
            }

            if (!config.pages[this.info.page]) {
                config.pages[this.info.page] = {};
            }
        } else {
            if (!config[this.info.page]) {
                config[this.info.page] = {};
            }
        }

        // Get the page config
        var page;

        if (this.info.isModule) {
            page = config.pages[this.info.page];
        } else {
            page = config[this.info.page];
        }


        // Create outlets in the page
        for (var i = 0; i < this.info.outlets; i++) {
            var outlet = this.info.outletData[i];
            page[outlet.name] = outlet.component;
        }

        // Sort the objects keys
        var ordered = this._sortObjectKeys(config);

        // Rewrite JSON file
        this.fs.write(jsonPath, JSON.stringify(ordered, null, 4));

        console.log('Creating controllers...');

        var controllers = this.info.page.split('/');

        var fullName = '';
        for (var i = 0; i < controllers.length; i++) {
            var name = controllers[i];

            if (fullName != '') {
                fullName += '/' + name;
            } else {
                fullName = name;
            }

            var path = fullName + '.controller.js';
            var fullPath = 'src/controllers/' + path;
            var className = pascalCase(fullName) + 'Controller';
            var outlet = this.info.outletData;

            var data = {
                name: name,
                fullName: fullName,
                path: path,
                fullPath: fullPath,
                className: className,
                outlet: outlet
            };

            console.log(data);

            if (!this.fs.exists(this.destinationPath(data.fullPath))) {
                this.fs.copyTpl(
                    this.templatePath('controller.js'),
                    this.destinationPath(data.fullPath),
                    data
                );
            }
        }

        if (this.info.addRoute) {
            this.log('Registering Route...');

            // Get the routes JSON
            if (this.info.isModule) {
                jsonPath = this.destinationPath('src/main.json');
            } else {
                jsonPath = this.destinationPath('src/app/config/routing/routes.config.json');
            }

            content = this.fs.read(jsonPath);
            config = JSON.parse(content);

            if (this.info.isModule) {
                if (!config.routes) {
                    config.routes = {};
                }

                config.routes[this.info.page] = this.info.route;
            } else {
                config[this.info.page] = this.info.route;
            }

            // Sort the objects keys
            var ordered = this._sortObjectKeys(config);

            // Rewrite JSON file
            this.fs.write(jsonPath, JSON.stringify(ordered, null, 4));
        }

        if (this.info.addParams) {
            this.log('Registering Page Parameters...');

            // Get the params JSON
            if (this.info.isModule) {
                jsonPath = this.destinationPath('src/main.json');
            } else {
                jsonPath = this.destinationPath('src/app/config/routing/params.config.json');
            }

            content = this.fs.read(jsonPath);
            config = JSON.parse(content);

            if (this.info.isModule) {
                if (!config.params) {
                    config.params = {};
                }

                config.params[this.info.page] = {};
            } else {
                // If there is no config for the page then create one
                if (!config[this.info.page]) {
                    config[this.info.page] = {};
                }
            }

            // Get the params config
            var params;
            if (this.info.isModule) {
                params = config.params[this.info.page];
            } else {
                params = config[this.info.page];
            }

            // Create outlets in the page
            for (var i = 0; i < this.info.paramsCount; i++) {
                var param = this.info.params[i];
                params[param.name] = param.value;
            }

            // Sort the objects keys
            var ordered = this._sortObjectKeys(config);

            // Rewrite JSON file
            this.fs.write(jsonPath, JSON.stringify(ordered, null, 4));
        }
    }
}

module.exports = QuarkPageGenerator;
