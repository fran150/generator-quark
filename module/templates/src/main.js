define([
    'module',
    'knockout',
    'jquery',
    'quark',
    'json!./main.json'
], function(mod, ko, $, $$, config) {

    return $$.module(mod, config);
});
