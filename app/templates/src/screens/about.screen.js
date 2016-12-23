define([
    'quark',
    'knockout',
    'text!./about.screen.html'
], function($$, ko, template) {

    function HomeScreen(params, $scope, $imports) {
        var self = this;
    }

    return $$.component(HomeScreen, template);
});
