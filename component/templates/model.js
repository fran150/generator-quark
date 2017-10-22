define([
    'quark',
    'knockout',
    'text!./<%- viewFileName %>'
], function($$, ko, template) {

    function <%- className %>(params, $scope, $imports, $context) {
        var self = this;

        this.message = "This is a <%= tag %> component";
    }

    return $$.component(<%- className %>, template);
});
