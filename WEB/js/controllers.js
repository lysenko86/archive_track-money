"use strict";

moneyApp.controller('menuCtrl', function($location, $scope){
	$scope.setActive = function(path){
		return ($location.path().substr(0, path.length) === path) ? 'active' : '';
	}
});



moneyApp.controller('homeCtrl', function($scope, messagesServ){
	$scope.message = messagesServ.message;
});



moneyApp.controller('actionsCtrl', function($scope, messagesServ, actionsServ, categoriesServ, accountsServ){
	$scope.message = messagesServ.message;
	let obj = new Date();
	let d = '0' + obj.getDate();
	let m = '0' + (obj.getMonth()+1);
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
	$scope.actions = $scope.categories = $scope.accounts = [];
	$scope.formType = 'add';
	$scope.editID = '';
	$scope.types = {
		plus: 'Доходи',
		minus: 'Витрати',
		move: 'Переказ'
	};
	$scope.isShowMoreButton = true;
	categoriesServ.getCategories(function(data){
		if (data.status == 'success'){
			data.arr = data.arr ? data.arr : [];
			$scope.categories = data.arr;
		}
	});
	accountsServ.getAccounts(function(data){
		if (data.status == 'success'){
			data.arr = data.arr ? data.arr : [];
			$scope.accounts = data.arr;
		}
	});
	$scope.getActions = function(data){
		actionsServ.getActions($scope.actions.length, 20, function(data){
			if (data.status == 'success'){
				data.arr = data.arr ? data.arr : [];
				$scope.actions = $scope.actions.concat(data.arr);
				if (!data.arr.length){
					$scope.isShowMoreButton = false;
				}
			}
		});
	}
	$scope.getActions();
	$scope.getAction = function(id){
		if (id == undefined){
			$scope.formType = 'add';
			$scope.action.date = $scope.today;
			$scope.action.type = $scope.action.accountFrom_id = $scope.action.accountTo_id = $scope.action.category_id = $scope.action.sum = $scope.action.description = $scope.editID = '';
		}
		else{
			$scope.editID = id;
			actionsServ.getAction(id, function(data){
				$scope.formType = 'edit';
				$scope.action.date = data.arr.date;
				$scope.action.type = data.arr.type;
				$scope.action.accountFrom_id = data.arr.accountFrom_id;
				$scope.action.accountTo_id = data.arr.accountTo_id;
				$scope.action.category_id = data.arr.category_id;
				$scope.action.sum = data.arr.sum;
				$scope.action.description = data.arr.description;
			});
		}
	}
	$scope.addAction = function(){
		if (!$scope.action.type){
			messagesServ.showMessage('error', 'Помилка! Поле "Тип" обов\'язкове для заповнення!');
		}
		else if ($scope.action.type == 'move' && (!$scope.action.date || !$scope.action.accountFrom_id || !$scope.action.accountTo_id || !$scope.action.sum)){
			messagesServ.showMessage('error', 'Помилка! Поля "Дата", "Звідки", "Куди" та "Сума" обов\'язкові для заповнення!');
		}
		else if ($scope.action.type != 'move' && (!$scope.action.date || !$scope.action.accountFrom_id || !$scope.action.category_id || !$scope.action.sum)){
			messagesServ.showMessage('error', 'Помилка! Поля "Дата", "Рахунок", "Категорія" та "Сума" обов\'язкові для заповнення!');
		}
		else if (!/^\d{2}\.\d{2}\.\d{4}$/.test($scope.action.date)){
			messagesServ.showMessage('error', 'Помилка! Значення поля "Дата" має бути наступного формату: 01.01.2017!');
		}
		else if (!/^[\d\.]+$/.test($scope.action.sum)){
			messagesServ.showMessage('error', 'Помилка! Значення поля "Сума" має бути числовим!');
		}
		else{
			if ($scope.action.type == 'move'){
				$scope.action.category_id = '0';
			}
			else if ($scope.action.type != 'move'){
				$scope.action.accountTo_id = '0';
			}
			actionsServ.addAction($scope.action, function(data){
				if (data.status == 'success'){
					$scope.actions.push(data.arr);
					$scope.action.date = $scope.today;
					$scope.action.type = $scope.action.accountFrom_id = $scope.action.accountTo_id = $scope.action.category_id = $scope.action.sum = $scope.action.description = '';
				}
				messagesServ.showMessage(data.status, data.msg);
            });
		}
	}
	$scope.editAction = function(){
		if (!$scope.action.type){
			messagesServ.showMessage('error', 'Помилка! Поле "Тип" обов\'язкове для заповнення!');
		}
		else if ($scope.action.type == 'move' && (!$scope.action.date || !$scope.action.accountFrom_id || !$scope.action.accountTo_id || !$scope.action.sum)){
			messagesServ.showMessage('error', 'Помилка! Поля "Дата", "Звідки", "Куди" та "Сума" обов\'язкові для заповнення!');
		}
		else if ($scope.action.type != 'move' && (!$scope.action.date || !$scope.action.accountFrom_id || !$scope.action.category_id || !$scope.action.sum)){
			messagesServ.showMessage('error', 'Помилка! Поля "Дата", "Рахунок", "Категорія" та "Сума" обов\'язкові для заповнення!');
		}
		else if (!/^\d{2}\.\d{2}\.\d{4}$/.test($scope.action.date)){
			messagesServ.showMessage('error', 'Помилка! Значення поля "Дата" має бути наступного формату: 01.01.2017!');
		}
		else if (!/^[\d\.]+$/.test($scope.action.sum)){
			messagesServ.showMessage('error', 'Помилка! Значення поля "Сума" має бути числовим!');
		}
		else{
			if ($scope.action.type == 'move'){
				$scope.action.category_id = '0';
			}
			else if ($scope.action.type != 'move'){
				$scope.action.accountTo_id = '0';
			}
			actionsServ.editAction($scope.editID, $scope.action, function(data){
				if (data.status == 'success'){
					$scope.formType = 'add';
					for (var i=0; i<$scope.actions.length; i++){
						if ($scope.actions[i].id == $scope.editID){
							$scope.actions[i] = data.arr;
						}
					}
					$scope.action.date = $scope.today;
					$scope.action.type = $scope.action.accountFrom_id = $scope.action.accountTo_id = $scope.action.category_id = $scope.action.sum = $scope.action.description = $scope.editID = '';
				}
				messagesServ.showMessage(data.status, data.msg);
			});
		}
	}
	$scope.delAction = function(id){
		if (confirm('Ви точно хочете видалити цю транзакцію?')){
			actionsServ.delAction(id, function(data){
				if (data.status == 'success'){
					for (var i=0; i<$scope.actions.length; i++){
						if ($scope.actions[i].id == id) $scope.actions.splice(i, 1);
					}
				}
				messagesServ.showMessage(data.status, data.msg);
			});
		}
	}
});



moneyApp.controller('categoriesCtrl', function($scope, messagesServ, categoriesServ){
	$scope.message = messagesServ.message;
	$scope.category = {
		title: '',
		type: ''
	};
	$scope.categories = [];
	$scope.formType = 'add';
	$scope.editID = '';
	$scope.types = {
		plus: 'Доходи',
		minus: 'Витрати'
	};
	categoriesServ.getCategories(function(data){
		if (data.status == 'success'){
			data.arr = data.arr ? data.arr : [];
			$scope.categories = data.arr;
		}
	});
	$scope.getCategory = function(id){
		if (id == undefined){
			$scope.formType = 'add';
			$scope.category.title = $scope.category.type = $scope.editID = '';
		}
		else{
			$scope.editID = id;
			categoriesServ.getCategory(id, function(data){
				$scope.formType = 'edit';
				$scope.category.title = data.arr.title;
				$scope.category.type = data.arr.type;
			});
		}
	}
	$scope.addCategory = function(){
		if (!$scope.category.title || !$scope.category.type){
			messagesServ.showMessage('error', 'Помилка! Поля "Назва" та "Тип" обов\'язкові для заповнення!');
		}
		else{
			categoriesServ.addCategory($scope.category, function(data){
				if (data.status == 'success'){
					$scope.categories.push(data.arr);
					$scope.category.title = $scope.category.type = '';
				}
				messagesServ.showMessage(data.status, data.msg);
            });
		}
	}
	$scope.editCategory = function(){
		if (!$scope.category.title || !$scope.category.type){
			messagesServ.showMessage('error', 'Помилка! Поля "Назва" та "Тип" обов\'язкові для заповнення!');
		}
		else{
			categoriesServ.editCategory($scope.editID, $scope.category, function(data){
				if (data.status == 'success'){
					$scope.formType = 'add';
					for (var i=0; i<$scope.categories.length; i++){
						if ($scope.categories[i].id == $scope.editID){
							$scope.categories[i] = data.arr;
						}
					}
					$scope.category.title = $scope.category.type = $scope.editID = '';
				}
				messagesServ.showMessage(data.status, data.msg);
			});
		}
	}
	$scope.delCategory = function(id){
		if (confirm('Ви точно хочете видалити цю категорію?')){
			categoriesServ.delCategory(id, function(data){
				if (data.status == 'success'){
					for (var i=0; i<$scope.categories.length; i++){
						if ($scope.categories[i].id == id) $scope.categories.splice(i, 1);
					}
				}
				messagesServ.showMessage(data.status, data.msg);
			});
		}
	}
});



moneyApp.controller('accountsCtrl', function($scope, messagesServ, accountsServ){
	$scope.message = messagesServ.message;
	$scope.account = {
		title: '',
		balance: ''
	};
	$scope.accounts = [];
	$scope.formType = 'add';
	$scope.editID = '';
	accountsServ.getAccounts(function(data){
		if (data.status == 'success'){
			data.arr = data.arr ? data.arr : [];
			$scope.accounts = data.arr;
		}
	});
	$scope.getAccount = function(id){
		if (id == undefined){
			$scope.formType = 'add';
			$scope.account.title = $scope.account.balance = $scope.editID = '';
		}
		else{
			$scope.editID = id;
			accountsServ.getAccount(id, function(data){
				$scope.formType = 'edit';
				$scope.account.title = data.arr.title;
				$scope.account.balance = data.arr.balance;
			});
		}
	}
	$scope.addAccount = function(){
		if (!$scope.account.title || $scope.account.balance == ''){
			messagesServ.showMessage('error', 'Помилка! Поля "Назва" та "Баланс" обов\'язкові для заповнення!');
		}
		else if (!/^[\-\+\d\.]+$/.test($scope.account.balance)){
			messagesServ.showMessage('error', 'Помилка! Значення поля "Баланс" має бути числовим!');
		}
		else{
			accountsServ.addAccount($scope.account, function(data){
				if (data.status == 'success'){
					$scope.accounts.push(data.arr);
					$scope.account.title = $scope.account.balance = '';
				}
				messagesServ.showMessage(data.status, data.msg);
            });
		}
	}
	$scope.editAccount = function(){
		if (!$scope.account.title || $scope.account.balance == ''){
			messagesServ.showMessage('error', 'Помилка! Поля "Назва" та "Баланс" обов\'язкові для заповнення!');
		}
		else if (!/^[\-\+\d\.]+$/.test($scope.account.balance)){
			messagesServ.showMessage('error', 'Помилка! Значення поля "Баланс" має бути числовим!');
		}
		else{
			accountsServ.editAccount($scope.editID, $scope.account, function(data){
				if (data.status == 'success'){
					$scope.formType = 'add';
					for (var i=0; i<$scope.accounts.length; i++){
						if ($scope.accounts[i].id == $scope.editID){
							$scope.accounts[i] = data.arr;
						}
					}
					$scope.account.title = $scope.account.balance = $scope.editID = '';
				}
				messagesServ.showMessage(data.status, data.msg);
			});
		}
	}
	$scope.delAccount = function(id){
		if (confirm('Ви точно хочете видалити цей рахунок?')){
			accountsServ.delAccount(id, function(data){
				if (data.status == 'success'){
					for (var i=0; i<$scope.accounts.length; i++){
						if ($scope.accounts[i].id == id) $scope.accounts.splice(i, 1);
					}
				}
				messagesServ.showMessage(data.status, data.msg);
			});
		}
	}
});



moneyApp.controller('budgetsCtrl', function($scope, messagesServ, budgetsServ, categoriesServ){
	$scope.message = messagesServ.message;
	let obj = new Date();
	$scope.budget = {
		month: obj.getMonth()+1+'',
		year: obj.getFullYear(),
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
	$scope.category = {
		month: '',
		year: '',
		category_id: '',
		sum: ''
	};
	$scope.categories = [];
	$scope.formType = 'add';
	$scope.editID = '';
	$scope.mathAbs = window.Math.abs;
	categoriesServ.getCategories(function(data){
		if (data.status == 'success'){
			data.arr = data.arr ? data.arr : [];
			$scope.categories = data.arr;
		}
	});
	$scope.getBudget = function(){
		if (!$scope.budget.month || !$scope.budget.year){
			messagesServ.showMessage('error', 'Помилка! Поля "Місяць" та "Рік" обов\'язкові для заповнення!');
		}
		else if (!/^\d{4}$/.test($scope.budget.year)){
			messagesServ.showMessage('error', 'Помилка! Значення поля "Рік" має бути наступного формату: 2017!');
		}
		else{
			budgetsServ.getBudget($scope.budget, function(data){
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
		}
	}
	$scope.getBudget();
	$scope.getCategory = function(id){
		if (id == undefined){
			$scope.formType = 'add';
			$scope.category.month = $scope.category.year = $scope.category.category_id = $scope.category.sum = $scope.editID = '';
		}
		else{
			$scope.editID = id;
			budgetsServ.getCategory(id, function(data){
				$scope.formType = 'edit';
				$scope.category.month = data.arr.month;
				$scope.category.year = data.arr.year;
				$scope.category.category_id = data.arr.category_id;
				$scope.category.sum = data.arr.sum;
			});
		}
	}
	$scope.addCategory = function(){
		if (!$scope.category.month || !$scope.category.year || !$scope.category.category_id || !$scope.category.sum){
			messagesServ.showMessage('error', 'Помилка! Поля "Місяць", "Рік", "Категорія" та "Сума" обов\'язкові для заповнення!');
		}
		else if (!/^\d{4}$/.test($scope.category.year)){
			messagesServ.showMessage('error', 'Помилка! Значення поля "Рік" має бути наступного формату: 2017!');
		}
		else if (!/^[\d\.]+$/.test($scope.category.sum)){
			messagesServ.showMessage('error', 'Помилка! Значення поля "Сума" має бути числовим!');
		}
		else{
			budgetsServ.addCategory($scope.category, function(data){
				if (data.status == 'success'){
					$scope.category.month = $scope.category.year = $scope.category.category_id = $scope.category.sum = '';
				}
				messagesServ.showMessage(data.status, data.msg);
            });
		}
	}
	$scope.editCategory = function(){
		if (!$scope.category.month || !$scope.category.year || !$scope.category.category_id || !$scope.category.sum){
			messagesServ.showMessage('error', 'Помилка! Поля "Місяць", "Рік", "Категорія" та "Сума" обов\'язкові для заповнення!');
		}
		else if (!/^\d{4}$/.test($scope.category.year)){
			messagesServ.showMessage('error', 'Помилка! Значення поля "Рік" має бути наступного формату: 2017!');
		}
		else if (!/^[\d\.]+$/.test($scope.category.sum)){
			messagesServ.showMessage('error', 'Помилка! Значення поля "Сума" має бути числовим!');
		}
		else{
			budgetsServ.editCategory($scope.editID, $scope.category, function(data){
				if (data.status == 'success'){
					$scope.formType = 'add';
					for (var i=0; i<$scope.budget.categories.length; i++){
						if ($scope.budget.categories[i].id == $scope.editID){
							$scope.budget.categories[i] = data.arr;
						}
					}
					$scope.category.month = $scope.category.year = $scope.category.category_id = $scope.category.sum = $scope.editID = '';
				}
				messagesServ.showMessage(data.status, data.msg);
			});
		}
	}
	$scope.delCategory = function(id){
		if (confirm('Ви точно хочете видалити цю категорію?')){
			budgetsServ.delCategory(id, function(data){
				if (data.status == 'success'){
					for (var i=0; i<$scope.budget.categories.length; i++){
						if ($scope.budget.categories[i].id == id) $scope.budget.categories.splice(i, 1);
					}
				}
				messagesServ.showMessage(data.status, data.msg);
			});
		}
	}
});
