"use strict";

var moneyApp = angular.module('moneyApp', ['ngRoute', 'LocalStorageModule']);

moneyApp.config(function($routeProvider, localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('TrackMoney');

	$routeProvider
	.when('/home', {
		templateUrl: 'templates/home.html',
		controller: 'homeCtrl'
	})
    .when('/signin', {
		templateUrl: 'templates/signin.html',
		controller: 'signinCtrl'
	})
    .when('/signup', {
		templateUrl: 'templates/signup.html',
		controller: 'signupCtrl'
	})
    .when('/agree', {
		templateUrl: 'templates/agree.html'
	})
    .when('/confirm/:confirm', {
		templateUrl: 'templates/confirm.html',
		controller: 'confirmCtrl'
	})
    .when('/profile', {
		templateUrl: 'templates/profile.html',
		controller: 'profileCtrl'
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
    .when('/forum', {
		templateUrl: 'templates/forum.html',
		controller: 'forumCtrl'
	})
    .when('/forum/:post', {
		templateUrl: 'templates/post.html',
		controller: 'forumCtrl'
	})
    .when('/logout', {
		templateUrl: 'templates/logout.html',
		controller: 'logoutCtrl'
	})
	.otherwise({
		redirectTo: '/home'
	});
});
