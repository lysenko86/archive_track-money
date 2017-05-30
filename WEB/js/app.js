"use strict";

var moneyApp = angular.module('moneyApp', ['ngRoute']);

moneyApp.config(function($routeProvider){
	$routeProvider
	.when('/home', {
		templateUrl: 'templates/home.html',
		controller: 'homeCtrl'
	})
	.when('/actions', {
		templateUrl: 'templates/actions.html',
		controller: 'actionsCtrl'
	})
	.when('/categories', {
		templateUrl: 'templates/categories.html',
		controller: 'categoriesCtrl'
	})
	.when('/accounts', {
		templateUrl: 'templates/accounts.html',
		controller: 'accountsCtrl'
	})
	.when('/budgets', {
		templateUrl: 'templates/budgets.html',
		controller: 'budgetsCtrl'
	})
	.otherwise({
		redirectTo: '/home'
	});
});