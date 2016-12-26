'use strict';
var util = require('util');
var path = require('path');
var Generator = require('yeoman-generator');
var welcome = require('yeoman-welcome');
var chalk = require('chalk');
var slugify = require('slugify');
var pascalCase = require('pascal-case');

var QuarkAppGenerator = class extends Generator {

    initializing() {
        this.log(chalk.magenta('You\'re using the fantastic Quark app generator.'));

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

        this.tag = this.options['tag'];
        this.noTest = this.options['notest'];

        this.namespaces = this.tag.split('-');

        this.componentsReqBase = 'components';
        this.componentsFileBase = 'src/components';

        var name = this.namespaces[this.namespaces.length - 1];

        this.modelName = name + '.component';
        this.viewName = name + '.component';

        this.modelFileName = this.modelName + '.js';
        this.viewFileName = this.viewName + '.html';

        var folders = this.namespaces.slice();
        folders.pop();
        var folder = folders.join('/');

        this.modelPath = this.componentsFileBase + '/' + folder + '/' + this.modelFileName;
        this.viewPath = this.componentsFileBase + '/' + folder + '/' + this.viewFileName;

        this.modelReqPath = this.componentsReqBase + '/' + folder + '/' + this.modelName;
        this.viewReqPath = this.componentsReqBase + '/' + folder + '/' + this.viewName;

        this.className = pascalCase(this.tag);
    }

    prompting() {
        if (!this.noTest) {
            return this.prompt([{
                type    : 'confirm',
                name    : 'tests',
                message : 'Do you want to generate test files for this component?',
                default : true
            }]).then(function (answers) {
                this.tests = answers.tests;
            }.bind(this));
        } else {
            this.tests = false;
        }
    }

    _addNamespace(config, namespaces) {
        var name = namespaces.shift();

        if (!config[name]) {
            config[name] = {};
        }

        if (namespaces.length > 0) {
            this._addNamespace(config[name], namespaces);
        } else {
            config[name] = this.modelReqPath;
        }
    }

    _sortArrayKeys(data) {
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
                result[key] = this._sortArrayKeys(item);
            } else {
                result[key] = item;
            }
        }

        return result;
    }


    writing() {
        var info = {
            tag: this.tag,
            namespaces: this.namespaces,
            modelFileName: this.modelFileName,
            viewFileName: this.viewFileName,
            modelPath: this.modelPath,
            viewPath: this.viewPath,
            modelReqPath: this.modelReqPath,
            viewReqPath: this.viewReqPath,
            className: this.className
        }

        this.log('Generating component...');
        this.fs.copyTpl(
            this.templatePath('model.js'),
            this.destinationPath(this.modelPath),
            info
        );
        this.fs.copyTpl(
            this.templatePath('view.html'),
            this.destinationPath(this.viewPath),
            info
        );

        this.log('Registering component...');
        var jsonPath = this.destinationPath('src/app/config/components/components.config.json');
        var content = this.fs.read(jsonPath);
        var config = JSON.parse(content);

        // Clone the array
        var namespaces = this.namespaces.slice();
        this._addNamespace(config, namespaces);

        var ordered = this._sortArrayKeys(config);

        this.fs.write(jsonPath, JSON.stringify(ordered, null, 4));

        if (this.tests) {
            this.log('Generating tests...');
            this.fs.copyTpl(
                this.templatePath('tests/specs/component.test.js'),
                this.destinationPath('tests/specs/' + this.tag + '.test.js'),
                info
            );
            this.fs.copyTpl(
                this.templatePath('tests/views/component.html'),
                this.destinationPath('tests/views/' + this.tag + '.html'),
                info
            );

            this.log('Registering test...');
            jsonPath = this.destinationPath('tests/app/config/specs.config.json');
            content = this.fs.read(jsonPath);
            config = JSON.parse(content);

            config.push(this.tag + '.test');

            config.sort();

            this.fs.write(jsonPath, JSON.stringify(config, null, 4));
        }
    }
}

module.exports = QuarkAppGenerator;
