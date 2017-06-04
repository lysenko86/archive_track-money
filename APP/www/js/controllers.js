"use strict";

function testConnection(serv){
    return function(host, base){
        if (!host){
            serv.alert({
                title: 'Помилка!',
                template: 'Відсутнє підключення до мережі Інтернет.'
            });
        }
        else if(!base){
            serv.alert({
                title: 'Помилка!',
                template: 'Відсутнє підключення до бази данних.'
            });
        }
    }
}

angular.module('moneyApp.controllers', [])



.controller('headerCtrl', function($scope, $ionicModal, $ionicPopup, actionsServ, categoriesServ, accountsServ){
    var obj = new Date();
	var d = '0' + obj.getDate();
	var m = '0' + (obj.getMonth()+1);
	$scope.today = d.substr(d.length-2, 2) + '.' + m.substr(m.length-2, 2) + '.' + obj.getFullYear();
	$scope.action = {
		date: $scope.today,
		type: '',
		accountFrom_id: '',
		accountTo_id: '',
		category_id: '',
		sum: '',
		description: ''
	};
    $scope.categories = $scope.accounts = [];
    $scope.modal = false;

    $ionicModal.fromTemplateUrl('templates/actionForm.html', {
        scope: $scope
    }).then(function(modal){
        $scope.modal = modal;
    });
    $scope.openModal = function(){
        $scope.modal.show();
    }
    $scope.closeModal = function(){
        $scope.modal.hide();
        $scope.action.date = $scope.today;
        $scope.action.type = $scope.action.accountFrom_id = $scope.action.accountTo_id = $scope.action.category_id = $scope.action.sum = $scope.action.description = '';
    }

    accountsServ.getAccounts(function(data){
		if (data.status == 'success'){
			data.arr = data.arr ? data.arr : [];
			$scope.accounts = data.arr;
		}
	});
    categoriesServ.getCategories(function(data){
		if (data.status == 'success'){
			data.arr = data.arr ? data.arr : [];
			$scope.categories = data.arr;
		}
	});

    $scope.addAction = function(){
		if (!$scope.action.type){
            $ionicPopup.alert({
                title: 'Помилка!',
                template: 'Поле "Тип" обов\'язкове для заповнення!'
            });
		}
		else if ($scope.action.type == 'move' && (!$scope.action.date || !$scope.action.accountFrom_id || !$scope.action.accountTo_id || !$scope.action.sum)){
            $ionicPopup.alert({
                title: 'Помилка!',
                template: 'Поля "Дата", "Звідки", "Куди" та "Сума" обов\'язкові для заповнення!'
            });
		}
		else if ($scope.action.type != 'move' && (!$scope.action.date || !$scope.action.accountFrom_id || !$scope.action.category_id || !$scope.action.sum)){
            $ionicPopup.alert({
                title: 'Помилка!',
                template: 'Поля "Дата", "Рахунок", "Категорія" та "Сума" обов\'язкові для заповнення!'
            });
		}
		else if (!/^\d{2}\.\d{2}\.\d{4}$/.test($scope.action.date)){
            $ionicPopup.alert({
                title: 'Помилка!',
                template: 'Значення поля "Дата" має бути наступного формату: 01.01.2017!'
            });
		}
		else if (!/^[\d\.]+$/.test($scope.action.sum)){
            $ionicPopup.alert({
                title: 'Помилка!',
                template: 'Значення поля "Сума" має бути числовим!'
            });
		}
		else{
			if ($scope.action.type == 'move'){
				$scope.action.category_id = '0';
			}
			else if ($scope.action.type != 'move'){
				$scope.action.accountTo_id = '0';
			}
			actionsServ.addAction($scope.action, function(data){
                if (data === false){
                    $ionicPopup.alert({
                        title: 'Помилка!',
                        template: 'Відсутнє підключення до мережі Інтернет.'
                    });
                }
                else if (data.status == 'error'){
                    $ionicPopup.alert({
                        title: 'Помилка!',
                        template: data.msg
                    });
                }
				else if (data.status == 'success'){
                    $scope.closeModal();
				}
            });
		}
	}
})



.controller('homeCtrl', function($scope, $ionicPopup, connectionServ){
    connectionServ.testConnection(testConnection($ionicPopup));
})



.controller('actionsCtrl', function($scope, $ionicPopup, connectionServ, actionsServ){
    connectionServ.testConnection(testConnection($ionicPopup));
    $scope.actions = [];
    $scope.isShowMoreButton = true;
    $scope.types = {
		plus: 'Доходи',
		minus: 'Витрати',
		move: 'Переказ'
	};
	actionsServ.getActions($scope.actions.length, 20, function(data){
		if (data.status == 'success'){
			data.arr = data.arr ? data.arr : [];
			$scope.actions = $scope.actions.concat(data.arr);
			if (!data.arr.length){
				$scope.isShowMoreButton = false;
			}
		}
	});
})



.controller('accountsCtrl', function($scope, $ionicPopup, connectionServ, accountsServ){
    connectionServ.testConnection(testConnection($ionicPopup));
    $scope.accounts = [];
    accountsServ.getAccounts(function(data){
		if (data.status == 'success'){
			data.arr = data.arr ? data.arr : [];
			$scope.accounts = data.arr;
		}
	});
})



.controller('budgetsCtrl', function($scope, $ionicPopup, connectionServ, budgetsServ){
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
})
