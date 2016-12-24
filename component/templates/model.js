define([
    'quark',
    'knockout',
    'text!./<%- viewFileName %>'
], function($$, ko, template) {

    function <%- className %>(params, $scope, $imports) {
        var self = this;

        $scope.message = "This is a <%= tag %> component";
    }

    return $$.component(<%- className %>, template);
});
