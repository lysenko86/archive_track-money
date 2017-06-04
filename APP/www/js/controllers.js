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



.controller('homeCtrl', function($scope, $ionicPopup, connectionServ){
    connectionServ.testConnection(testConnection($ionicPopup));
})



.controller('actionsCtrl', function($scope, $ionicPopup, connectionServ){
    connectionServ.testConnection(testConnection($ionicPopup));
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
