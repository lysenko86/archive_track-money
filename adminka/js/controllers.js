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



moneyApp.controller('mailingCtrl', function($location, $scope, messagesServ, mailingServ, localStorageService){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		if (!$scope.isAuth){
			$location.url('home');
		}
		$scope.mail = {
			id: '',
			theme: '',
			content: ''
		};
		mailingServ.getMails(function(data){
			if (data.status == 'success'){
				data.arr     = data.arr ? data.arr : [];
				$scope.mails = data.arr;
			}
			else{
				messagesServ.showMessages(data.status, data.msg);
			}
		});
	}
	$scope.getMail = function(id){
		if (!id){
			$scope.mail.id = $scope.mail.theme = $scope.mail.content = '';
		}
		else{
			mailingServ.getMail(id, function(data){
				if (data.status == 'success'){
					$scope.mail.id      = data.arr.id;
					$scope.mail.theme   = data.arr.theme;
					$scope.mail.content = data.arr.content;
				}
				else{
					messagesServ.showMessages(data.status, data.msg);
				}
			});
		}
	}
	$scope.mailSave = function(){
		if (!$scope.mail.theme || !$scope.mail.content){
			messagesServ.showMessages('error', 'Помилка! Поля "Тема" та "Вміст" обов\'язкові для заповнення!');
		}
		else{
			mailingServ.mailSave($scope.mail, function(data){
				if (data.status == 'success'){
					if ($scope.mail.id){     // edit mail
						for (var i=0; i<$scope.mails.length; i++){
							if ($scope.mails[i].id == $scope.mail.id){
								$scope.mails[i] = data.arr;
							}
						}
					}
					else{     // add mail
						$scope.mails.unshift(data.arr);
						$scope.mail.id = data.arr.id;
					}
				}
				messagesServ.showMessages(data.status, data.msg);
            });
		}
	}
	$scope.mailTest = function(){
		if (!$scope.mail.theme || !$scope.mail.content){
			messagesServ.showMessages('error', 'Помилка! Поля "Тема" та "Вміст" обов\'язкові для заповнення!');
		}
		else{
			mailingServ.mailTest($scope.mail, function(data){
				messagesServ.showMessages(data.status, data.msg);
			});
		}
	}
	$scope.mailSend = function(){
		console.log('Send');
	}

	this.init();
});
