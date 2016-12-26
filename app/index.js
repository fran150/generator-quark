'use strict';
var util = require('util');
var path = require('path');
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var slugify = require('slugify');

var QuarkAppGenerator = class extends Generator {

    initializing() {
        this.log(chalk.green("   ____                   _      _            "));
        this.log(chalk.green("  / __ \\                 | |    (_)          "));
        this.log(chalk.green(" | |  | |_   _  __ _ _ __| | __  _ ___        "));
        this.log(chalk.green(" | |  | | | | |/ _` | '__| |/ / | / __|       "));
        this.log(chalk.green(" | |__| | |_| | (_| | |  |   < _| \\__ \\     "));
        this.log(chalk.green("  \\___\\_\\\\__,_|\\__,_|_|  |_|\\_(_) |___/ "));
        this.log(chalk.green("                               _/ |           "));
        this.log(chalk.green("                               |__/           "));
        this.log(chalk.magenta('You\'re using the fantastic Quark APP generator!!!'));
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

    install() {
        this.npmInstall();
        this.bowerInstall();
    }
}

module.exports = QuarkAppGenerator;
