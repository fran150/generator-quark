define([
    'quark',
    'knockout',
    'text!./right.screen.html'
], function($$, ko, template) {

    function NavbarMainRightScreen(params, $scope, $imports) {
        var self = this;
    }

    return $$.component(NavbarMainRightScreen, template);
});
