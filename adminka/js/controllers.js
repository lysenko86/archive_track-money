"use strict";



moneyApp.controller('menuCtrl', function($location, $scope, localStorageService){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		angular.element('nav.navbar li a:not(.dropdown-toggle)').click(function(){
			if (angular.element('nav.navbar .navbar-collapse.collapse').hasClass('in')){
				angular.element('nav.navbar .navbar-header button.navbar-toggle').click();
			}
		});
	}
	$scope.setActive = function(path){
		return ($location.path().substr(0, path.length) === path) ? 'active' : '';
	}

	this.init();
});



moneyApp.controller('homeCtrl', function($scope){
	this.init = function(){}

	this.init();
});



moneyApp.controller('signinCtrl', function($location, $window, $scope, messagesServ, localStorageService, usersServ){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		if ($scope.isAuth){
			$location.url('home');
		}
		$scope.user = {
			email: '',
			password: ''
		};
	}
	$scope.signin = function(){
		if (!$scope.user.email || !$scope.user.password){
			messagesServ.showMessages('error', 'Помилка! Поля "Email" та "Пароль" обов\'язкові для заповнення!');
		}
		else{
			usersServ.signin($scope.user, function(data){
				$scope.user.email = $scope.user.password = '';
				messagesServ.showMessages(data.status, data.msg, 2000, function(){
					if (data.status == 'success'){
						localStorageService.set('token', data.arr.token);
						$window.location.href = '/';
					}
				});
            });
		}
	}

	this.init();
});



moneyApp.controller('logoutCtrl', function($location, $window, $scope, messagesServ, localStorageService, usersServ){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		if (!$scope.isAuth){
			$location.url('home');
		}
		else{
			usersServ.logout(function(data){
				messagesServ.showMessages(data.status, data.msg, 2000, function(){
					if (data.status == 'success'){
						localStorageService.remove('token');
						$window.location.href = '/';
					}
				});
			});
		}
	}

	this.init();
});



moneyApp.controller('usersCtrl', function($location, $scope, messagesServ, usersServ, localStorageService){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		if (!$scope.isAuth){
			$location.url('home');
		}
		$scope.users = [];

		usersServ.getUsers(function(data){
			if (data.status == 'success'){
				data.arr     = data.arr ? data.arr : [];
				$scope.users = data.arr;
			}
			else{
				messagesServ.showMessages(data.status, data.msg);
			}
		});
	}

	this.init();
});
