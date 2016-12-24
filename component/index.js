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

        this.tag = this.options['tag'];
        this.namespaces = this.tag.split('-');
        this.componentsBase = 'components';

        var name = this.namespaces[this.namespaces.length - 1];
        this.modelFileName = name + '.component.js';
        this.viewFileName = name + '.component.html';

        var folders = this.namespaces;
        folders.pop();
        var folder = folders.join('/');
        this.modelPath = this.componentsBase + '/' + folder + '/' + this.modelFileName;
        this.viewPath = this.componentsBase + '/' + folder + '/' + this.viewFileName;

        this.className = pascalCase(this.tag);
    }

    writing() {
        var info = {
            tag: this.tag,
            namespaces: this.namespaces,
            modelFileName: this.modelFileName,
            viewFileName: this.viewFileName,
            modelPath: this.modelPath,
            viewPath: this.viewPath,
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

    }
}

module.exports = QuarkAppGenerator;
