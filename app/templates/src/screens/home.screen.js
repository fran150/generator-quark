define([
    'quark',
    'knockout',
    'text!./home.screen.html'
], function($$, ko, template) {

    function HomeScreen(params, $scope, $imports) {
        var self = this;

        this.name = "Welcome to <%- longName %> application";
        this.description = "<%- description %>";
    }

    return $$.component(HomeScreen, template);
});
