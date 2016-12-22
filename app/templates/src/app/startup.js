define([
    'knockout',
    'quark',
    'json!./config/components/components.config.json',
    'json!./config/components/screens.config.json',
    'json!./config/routing/pages.config.json',
    'json!./config/routing/params.config.json',
    'json!./config/routing/routes.config.json',
    'bootstrap/js',
    'loadCss!bootstrap/css',
    'loadCss!font-awesome/css',
    'qk-alchemy/main'
], function(ko, $$, components, screens, pages, params, routes) {
    // Register all components and screens
    $$.registerComponents(components);
    $$.registerComponents(screens);

    // Configure the routing system
    $$.routing.pages(pages, params);
    $$.routing.mapRoute(routes);

    // Start Quark Application
    $$.routing.activateHasher();
    $$.start();
});
