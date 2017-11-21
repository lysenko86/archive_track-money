"use strict";

angular.module('moneyApp.controllers', []);



moneyApp.controller('homeCtrl', function($location, $window, $scope, $rootScope, $ionicPopup, localStorageService, usersServ){
    this.init = function(){
		$rootScope.isAuth = localStorageService.get('token');
		$scope.user = {
			email: '',
			password: ''
		};
	}
    $scope.signin = function(){
		if (!$scope.user.email || !$scope.user.password){
            $ionicPopup.alert({
                title: 'Помилка!',
                template: 'Помилка! Поля "Email" та "Пароль" обов\'язкові для заповнення!'
            });
		}
		else{
			usersServ.signin($scope.user, function(data){
				$scope.user.email = $scope.user.password = '';
                if (data.status == 'error'){
                    $ionicPopup.alert({title:'Помилка!', template: data.msg});
                }
				else if (data.status == 'success'){
					localStorageService.set('token', data.arr.token);
					$window.location.href = '/';
				}
            });
		}
	}

    this.init();
});



moneyApp.controller('actionsCtrl', function($location, $scope, $rootScope, $state, $ionicModal, $ionicPopup, actionsServ, categoriesServ, accountsServ, localStorageService){
    this.init = function(){
		$rootScope.isAuth = localStorageService.get('token');
		if (!$scope.isAuth){
			$location.url('home');
		}
        $scope.action = {
			id: false,
			date: $scope.getToday(),
			type: '',
			accountFrom_id: '',
			accountTo_id: '',
			category_id: '',
			sum: '',
			description: ''
		};
        $scope.actions = $scope.categories = $scope.accounts = [];
        $scope.types   = {
			plus: 'Доходи',
			minus: 'Витрати',
			move: 'Переказ'
		};
        $scope.isShowMoreButton = true;
        $scope.modal = false;
        categoriesServ.getCategories(function(data){
            if (data.status == 'success'){
                $scope.categories = data.arr ? data.arr : [];
            }
            else{
                $ionicPopup.alert({title:'Помилка!', template: data.msg});
            }
        });
        accountsServ.getAccounts(function(data){
			if (data.status == 'success'){
				$scope.accounts = data.arr ? data.arr : [];
			}
			else{
				$ionicPopup.alert({title:'Помилка!', template: data.msg});
			}
		});
        $scope.getActions();
	}
    $scope.getToday = function(){
        let obj = new Date();
        let d = '0' + obj.getDate();
        let m = '0' + (obj.getMonth()+1);
        return d.substr(d.length-2, 2) + '.' + m.substr(m.length-2, 2) + '.' + obj.getFullYear();
    }
    $scope.dateToWEB = function(date){
		return date.substr(8,2) + '.' + date.substr(5,2) + '.' + date.substr(0,4);
	}
    $scope.dateToAPI = function(date){
		return date.substr(6,4) + '-' + date.substr(3,2) + '-' + date.substr(0,2);
	}
    $scope.editActionOpenModal = function(id){
        $scope.getAction(id, function(){
            $ionicModal.fromTemplateUrl('templates/actionForm.html', {
                scope: $scope
            }).then(function(modal){
                $scope.modal = modal;
                $scope.modal.show();
            });
        });
    }
    $scope.editActionCloseModal = function(){
        $scope.modal.remove();
        $scope.action.date = $scope.action.type = $scope.action.accountFrom_id = $scope.action.accountTo_id = $scope.action.category_id = $scope.action.sum = $scope.action.description = '';
    }
    $scope.getActions = function(data){
		actionsServ.getActions($scope.actions.length, 20, function(data){
			if (data.status == 'success'){
				$scope.actions = $scope.actions.concat(data.arr ? data.arr : []);
				if (!data.arr.length){
					$scope.isShowMoreButton = false;
				}
			}
			else{
				$ionicPopup.alert({title:'Помилка!', template: data.msg});
			}
		});
	}
    $scope.getAction = function(id, cb){
		if (!id){
			$scope.action.id   = false;
			$scope.action.date = $scope.getToday();
			$scope.action.type = $scope.action.accountFrom_id = $scope.action.accountTo_id = $scope.action.category_id = $scope.action.sum = $scope.action.description = '';
            if (!angular.isUndefined(cb)){
                cb();
            }
		}
		else{
			actionsServ.getAction(id, function(data){
				if (data.status == 'success'){
					$scope.action.id             = data.arr.id;
					$scope.action.date           = $scope.dateToWEB(data.arr.date);
					$scope.action.type           = data.arr.type;
					$scope.action.accountFrom_id = data.arr.accountFrom_id;
					$scope.action.accountTo_id   = data.arr.accountTo_id;
					$scope.action.category_id    = data.arr.category_id;
					$scope.action.sum            = data.arr.sum;
					$scope.action.description    = data.arr.description;
                    if (!angular.isUndefined(cb)){
                        cb();
                    }
				}
				else{
					$ionicPopup.alert({title:'Помилка!', template: data.msg});
				}
			});
		}
	}
    $scope.editAction = function(){
		if (!$scope.action.type){
            $ionicPopup.alert({title:'Помилка!', template: 'Помилка! Поле "Тип" обов\'язкове для заповнення!'});
		}
		else if ($scope.action.type == 'move' && (!$scope.action.date || !$scope.action.accountFrom_id || !$scope.action.accountTo_id || !$scope.action.sum)){
            $ionicPopup.alert({title:'Помилка!', template: 'Помилка! Поля "Дата", "Звідки", "Куди" та "Сума" обов\'язкові для заповнення!'});
		}
		else if ($scope.action.type != 'move' && (!$scope.action.date || !$scope.action.accountFrom_id || !$scope.action.category_id || !$scope.action.sum)){
            $ionicPopup.alert({title:'Помилка!', template: 'Помилка! Поля "Дата", "Рахунок", "Категорія" та "Сума" обов\'язкові для заповнення!'});
		}
		else if (!/^\d{2}\.\d{2}\.\d{4}$/.test($scope.action.date)){
            $ionicPopup.alert({title:'Помилка!', template: 'Помилка! Значення поля "Дата" має бути наступного формату: 01.01.2017!'});
		}
		else if (!/^[\d\.]+$/.test($scope.action.sum)){
            $ionicPopup.alert({title:'Помилка!', template: 'Помилка! Значення поля "Сума" має бути числовим!'});
		}
		else{
			if ($scope.action.type == 'move'){
				$scope.action.category_id = '0';
			}
			else if ($scope.action.type != 'move'){
				$scope.action.accountTo_id = '0';
			}
			$scope.action.date = $scope.dateToAPI($scope.action.date);
			actionsServ.editAction($scope.action, function(data){
				data.arr.date = $scope.dateToWEB(data.arr.date);
				if (data.status == 'success'){
                    $scope.editActionCloseModal();
                    if ($scope.action.id){     // edit transaction
						for (var i=0; i<$scope.actions.length; i++){
							if ($scope.actions[i].id == $scope.action.id){
								$scope.actions[i] = data.arr;
							}
						}
					}
					else{     // add transaction
                        $scope.actions.unshift(data.arr); // Не додає вперед масиву елемент
					}
					//accountsServ.getAccountsPanel();
				}
                else if(data.status == 'error'){
                    $ionicPopup.alert({title: 'Помилка!', template: data.msg});
                }
            });
		}
	}
    $scope.delAction = function(id){
        $ionicPopup.confirm({title: 'Увага!', template: 'Ви дійсно хочете видалити цю транзакцію?'}).then(function(res){
            if (res){
                actionsServ.delAction(id, function(data){
                    if (data.status == 'success'){
                        $scope.editActionCloseModal();
    					for (var i=0; i<$scope.actions.length; i++){
    						if ($scope.actions[i].id == id){
    							$scope.actions.splice(i, 1);
    						}
    					}
    					//accountsServ.getAccountsPanel();
    				}
                    else if(data.status == 'error'){
		                $ionicPopup.alert({title:'Помилка!', template: data.msg});
                    }
    			});
            }
        });
	}

	this.init();
});



moneyApp.controller('accountsCtrl', function($location, $scope, $rootScope, accountsServ, localStorageService){
    this.init = function(){
		$rootScope.isAuth = localStorageService.get('token');
		if (!$scope.isAuth){
			$location.url('home');
		}
		$scope.accounts = [];
		$scope.getAccounts();
	}
    $scope.getAccounts = function(){
		accountsServ.getAccounts(function(data){
			if (data.status == 'success'){
				data.arr = data.arr ? data.arr : [];
				$scope.accounts = data.arr;
			}
			else{
				messagesServ.showMessages(data.status, data.msg);
			}
		});
    }

	this.init();
});



/*.controller('budgetsCtrl', function($scope, $ionicPopup, connectionServ, budgetsServ){
    connectionServ.testConnection(testConnection($ionicPopup));
    $scope.budget = {
		categories: [],
		plusPlan: '',
		plusFact: '',
        plusRest: '',
		minusPlan: '',
		minusFact: '',
        minusRest: '',
        balancePlan: '',
        balanceFact: ''
	};
    var obj = new Date();
    $scope.mathAbs = window.Math.abs;
	budgetsServ.getBudget(obj.getMonth()+1+'', obj.getFullYear(), function(data){
		$scope.budget.categories = data.arr;
        $scope.budget.plusPlan = $scope.budget.plusFact = $scope.budget.plusRest = $scope.budget.minusPlan = $scope.budget.minusFact = $scope.budget.minusRest = $scope.budget.balancePlan = $scope.budget.balanceFact = '';
		for (var i=0; i<$scope.budget.categories.length; i++){
			if ($scope.budget.categories[i].type == 'plus'){
				$scope.budget.plusPlan = $scope.budget.plusPlan*1 + $scope.budget.categories[i].plan*1;
				$scope.budget.plusFact = $scope.budget.plusFact*1 + $scope.budget.categories[i].fact*1;
			}
			else{
				$scope.budget.minusPlan = $scope.budget.minusPlan*1 + $scope.budget.categories[i].plan*1;
				$scope.budget.minusFact = $scope.budget.minusFact*1 + $scope.budget.categories[i].fact*1;
			}
		}
        $scope.budget.plusRest = $scope.budget.plusPlan - $scope.budget.plusFact;
        $scope.budget.minusRest = $scope.budget.minusPlan - $scope.budget.minusFact;
        $scope.budget.balancePlan = $scope.budget.plusPlan - $scope.budget.minusPlan;
        $scope.budget.balanceFact = $scope.budget.plusFact - $scope.budget.minusFact;
	});
});
*/
