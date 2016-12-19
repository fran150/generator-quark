define([
    'quark',
    'knockout',
    'text!./home.screen.html'
], function($$, ko, template) {

    function HomeScreen(params, $scope, $imports) {
        var self = this;
    }

    return $$.component(HomeScreen, template);
});
