define([
    'quark',
    'knockout',
    'text!./left.screen.html'
], function($$, ko, template) {

    function NavbarMainLeftScreen(params, $scope, $imports) {
        var self = this;
    }

    return $$.component(NavbarMainLeftScreen, template);
});
