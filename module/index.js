'use strict';
var util = require('util');
var path = require('path');
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var slugify = require('slugify');

var QuarkModuleGenerator = class extends Generator {

    initializing() {
        this.log(chalk.red("   ____                   _      _            "));
        this.log(chalk.red("  / __ \\                 | |    (_)          "));
        this.log(chalk.red(" | |  | |_   _  __ _ _ __| | __  _ ___        "));
        this.log(chalk.red(" | |  | | | | |/ _` | '__| |/ / | / __|       "));
        this.log(chalk.red(" | |__| | |_| | (_| | |  |   < _| \\__ \\     "));
        this.log(chalk.red("  \\___\\_\\\\__,_|\\__,_|_|  |_|\\_(_) |___/ "));
        this.log(chalk.red("                               _/ |           "));
        this.log(chalk.red("                               |__/           "));
        this.log(chalk.magenta('You\'re using the fantastic Quark MODULE generator!!!'));

        this.info = {};
    }

    prompting() {
        return this.prompt([{
            type    : 'input',
            name    : 'name',
            message : 'What\'s the name of your new quark module?',
            default : path.basename(process.cwd())
        },
        {
            type    : 'input',
            name    : 'prefix',
            message : 'Please enter the prefix of your module components',
            store   : true
        },
        {
            type    : 'input',
            name    : 'description',
            message : 'Please describe your module',
            store   : true
        },
        {
            type    : 'input',
            name    : 'version',
            message : 'Enter your module\'s version number',
            default : '0.1.0',
            store   : true
        },
        {
            type    : 'input',
            name    : 'authors',
            message : 'Please enter the modules\'s author (or authors separated by comma)',
            store   : true
        },
        {
            type    : 'input',
            name    : 'keywords',
            message : 'Please enter the modules\'s keywords (separated by comma)',
            store   : true
        },
        {
            type    : 'input',
            name    : 'license',
            message : 'Please enter the module\'s license type',
            default : 'MIT',
            store   : true
        }
        ]).then(function (answers) {
            this.info.longName = answers.name;
            this.info.prefix = answers.prefix;
            this.info.slugName = slugify(this.info.longName);
            this.info.description = answers.description;
            this.info.version = answers.version;

            this.info.authors = new Array();
            var authors = answers.authors.split(',');
            for (let i = 0; i < authors.length; i++) {
                this.info.authors.push(authors[i].trim());
            }

            this.info.keywords = new Array();
            var keywords = answers.keywords.split(',');
            for (let i = 0; i < keywords.length; i++) {
                this.info.keywords.push(keywords[i].trim());
            }

            this.info.license = answers.license;
        }.bind(this));
    }

    writing() {
        this.log("Generating config...");
        this.fs.copyTpl(
            this.templatePath('./*.*'),
            this.destinationPath('.'),
            this.info
        );

        this.fs.copyTpl(
            this.templatePath('.*'),
            this.destinationPath('.'),
            this.info
        );

        this.log("Generating sources...");
        this.fs.copyTpl(
            this.templatePath('src/**/*'),
            this.destinationPath('src'),
            this.info
        );

        this.log("Generating test area...")
        this.fs.copyTpl(
            this.templatePath('tests/**/*'),
            this.destinationPath('tests'),
            this.info
        );
    }

    install() {
        this.npmInstall();
        this.bowerInstall();
    }
}

module.exports = QuarkModuleGenerator;
