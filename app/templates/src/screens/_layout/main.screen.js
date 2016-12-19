define([
    'quark',
    'knockout',
    'text!./main.screen.html'
], function($$, ko, template) {

    function LayoutMainScreen(params, $scope, $imports) {
        var self = this;
    }

    return $$.component(LayoutMainScreen, template);
});
