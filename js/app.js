var moneyApp = angular.module('moneyApp', ['ngRoute', 'ngCookies']);

moneyApp.config(function($routeProvider){
	$routeProvider
	.when('/home', {
		templateUrl: 'templates/home.html',
		controller: 'homeCtrl'
	})
	.when('/reg', {
		templateUrl: 'templates/reg.html',
		controller: 'regCtrl'
	})
	.when('/login', {
		templateUrl: 'templates/login.html',
		controller: 'loginCtrl'
	})
	.when('/logout', {
		template: '',
		controller: 'logoutCtrl'
	})
	.when('/categories', {
		templateUrl: 'templates/categories.html',
		controller: 'categoriesCtrl'
	})
	.otherwise({
		redirectTo: '/home'
	});
});