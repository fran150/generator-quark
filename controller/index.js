'use strict';
var util = require('util');
var path = require('path');
var Generator = require('yeoman-generator');
var welcome = require('yeoman-welcome');
var chalk = require('chalk');
var slugify = require('slugify');
var pascalCase = require('pascal-case');

var QuarkControllerGenerator = class extends Generator {

    initializing() {
        this.log(chalk.white("   ____                   _      _            "));
        this.log(chalk.white("  / __ \\                 | |    (_)          "));
        this.log(chalk.white(" | |  | |_   _  __ _ _ __| | __  _ ___        "));
        this.log(chalk.white(" | |  | | | | |/ _` | '__| |/ / | / __|       "));
        this.log(chalk.white(" | |__| | |_| | (_| | |  |   < _| \\__ \\     "));
        this.log(chalk.white("  \\___\\_\\\\__,_|\\__,_|_|  |_|\\_(_) |___/ "));
        this.log(chalk.white("                               _/ |           "));
        this.log(chalk.white("                               |__/           "));
        this.log(chalk.magenta('You\'re using the fantastic Quark CONTROLLER generator!!!'));

        this.info = {};

        this.argument('page', {
            required: false,
            type: String,
            desc: 'Full page name associated to the controller'
        });

        this.info.page = this.options['page'];

        var moduleMain = this.destinationPath('src/main.js');
        var moduleConfig = this.destinationPath('src/main.json');

        this.info.isModule = this.fs.exists(moduleMain) && this.fs.exists(moduleConfig);

    }

    prompting() {
        if (!this.info.page) {
            return this.prompt([{
                type    : 'input',
                name    : 'page',
                message : 'Enter the full page name associated to the controller:'
            }]).then(function (answers) {
                this.info.page = answers.page;
            }.bind(this));
        }
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

        this.log('Reading Page Configuration...');

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

        var outlets = new Array();

        for (var name in page) {
            outlets.push({
                name: name,
                component: page[name]
            });
        }

        this.log('Creating controller...');

        var path = this.info.page + '.controller.js';
        var fullPath = 'src/controllers/' + path;
        var className = pascalCase(this.info.page) + 'Controller';
        var outlet = outlets;

        var data = {
            path: path,
            fullPath: fullPath,
            className: className,
            outlet: outlets
        };

        if (!this.fs.exists(this.destinationPath(data.fullPath))) {
            this.fs.copyTpl(
                this.templatePath('controller.js'),
                this.destinationPath(data.fullPath),
                data
            );
        }
    }
}

module.exports = QuarkControllerGenerator;
