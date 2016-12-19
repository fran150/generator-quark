define([
    'quark',
    'knockout',
    'text!./simple.screen.html'
], function($$, ko, template) {

    function ContainerSimpleScreen(params, $scope, $imports) {
        var self = this;
    }

    return $$.component(ContainerSimpleScreen, template);
});
