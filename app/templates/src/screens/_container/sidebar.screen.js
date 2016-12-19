define([
    'quark',
    'knockout',
    'text!./sidebar.screen.html'
], function($$, ko, template) {

    function ContainerSidebarScreen(params, $scope, $imports) {
        var self = this;
    }

    return $$.component(ContainerSidebarScreen, template);
});
