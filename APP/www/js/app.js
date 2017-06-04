"use strict";

angular.module('moneyApp', ['ionic', 'moneyApp.controllers', 'moneyApp.services'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('home', {
        url: '/home',
        cache: false,
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
    })
    .state('actions', {
        url: '/actions',
        cache: false,
        templateUrl: 'templates/actions.html',
        controller: 'actionsCtrl'
    })
    .state('accounts', {
        url: '/accounts',
        cache: false,
        templateUrl: 'templates/accounts.html',
        controller: 'accountsCtrl'
    })
    .state('budgets', {
        url: '/budgets',
        cache: false,
        templateUrl: 'templates/budgets.html',
        controller: 'budgetsCtrl'
    })
    $urlRouterProvider.otherwise('/home');
});
