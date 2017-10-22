define([
    'quark',
    'knockout',
    'text!./<%- viewFileName %>'
], function($$, ko, template) {

    function <%- className %>(params, $scope, $imports, $context) {
        var self = this;

        this.title = "Welcome to <%= tag %> screen";
    }

    return $$.component(<%- className %>, template);
});
