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
    .when('/logout', {
		templateUrl: 'templates/logout.html',
		controller: 'logoutCtrl'
	})
    .when('/users', {
		templateUrl: 'templates/users.html',
		controller: 'usersCtrl'
	})
    .when('/mailing', {
		templateUrl: 'templates/mailing.html',
		controller: 'mailingCtrl'
	})
	.otherwise({
		redirectTo: '/home'
	});
});
