'use strict';
var util = require('util');
var path = require('path');
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var slugify = require('slugify');
var pascalCase = require('pascal-case');

var QuarkServiceGenerator = class extends Generator {

    initializing() {
        this.log(chalk.blue("   ____                   _      _            "));
        this.log(chalk.blue("  / __ \\                 | |    (_)          "));
        this.log(chalk.blue(" | |  | |_   _  __ _ _ __| | __  _ ___        "));
        this.log(chalk.blue(" | |  | | | | |/ _` | '__| |/ / | / __|       "));
        this.log(chalk.blue(" | |__| | |_| | (_| | |  |   < _| \\__ \\     "));
        this.log(chalk.blue("  \\___\\_\\\\__,_|\\__,_|_|  |_|\\_(_) |___/ "));
        this.log(chalk.blue("                               _/ |           "));
        this.log(chalk.blue("                               |__/           "));
        this.log(chalk.magenta('You\'re using the fantastic Quark SCREEN generator!!!'));
        
        this.argument('path', {
            required: true,
            type: String,
            desc: 'Path of the service file (separated with / and without js extension)'
        });

        this.info = {};

        // Get info from attributes
        this.info.path = this.options['path'];

        // Get folders name
        this.info.paths = this.info.path.split('/');

        // Get the service name
        this.info.name = this.info.paths[this.info.paths.length - 1];

        // Define base dir for require and file
        this.info.servicesFileBase = 'src/services';

        // Get the model and view file name
        this.info.serviceFileName = this.info.servicesFileBase + '/' + this.info.path + '.service.js';

        var moduleMain = this.destinationPath('src/main.js');
        var moduleConfig = this.destinationPath('src/main.json');
        var bowerPath = this.destinationPath('bower.json');

        this.info.isModule = this.fs.exists(moduleMain) && this.fs.exists(moduleConfig);

        var bowerContent = this.fs.read(bowerPath);
        var bower = JSON.parse(bowerContent);

        this.info.bower = bower;
        
        // Get the class name from tag
        this.info.serviceName = pascalCase(this.info.path);
        this.info.className = this.info.serviceName + "Service";
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

        this.log('Generating service...');
        this.fs.copyTpl(
            this.templatePath('service.js'),
            this.destinationPath(this.info.serviceFileName),
            this.info
        );

        this.log('Registering service...');
        
        if (this.info.isModule) {
            // Get the components JSON
            var jsonPath = this.destinationPath('src/main.json');
            var content = this.fs.read(jsonPath);
            var json = JSON.parse(content);

            if (!json['require']) {
                json.require = {};
            }

            if (!json.require['config']) {
                json.require.config = {};
            }

            if (!json.require.config['services']) {
                json.require.config.services = {}
            }

            json.require.config.services[this.info.serviceName] = this.info.bower.name + "/" + this.info.path;

            // Sort the objects keys
            var ordered = this._sortObjectKeys(json);

            // Rewrite JSON file
            this.fs.write(jsonPath, JSON.stringify(ordered, null, 4));        
        } else {
        }
    }
}

module.exports = QuarkServiceGenerator;
