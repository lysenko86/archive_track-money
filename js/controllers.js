moneyApp.controller('menuCtrl', function($scope, $cookies){
	$scope.auth = $cookies.get('user');
});



moneyApp.controller('homeCtrl', function(){});



moneyApp.controller('regCtrl', function($scope, usersServices, messagesServices){
	$scope.message = messagesServices.message;
	$scope.user = {
		email: '',
		pass: '',
		name: '',
		city: ''
	};
	$scope.submit = function(){
		if (!$scope.user.email || !$scope.user.pass || !$scope.user.name){
			messagesServices.showMessage('error', 'Помилка! Треба ввести E-mail, пароль та ім\'я!');
		}
		else{
			usersServices.regUser($scope.user, function(data){
				$scope.user.email = $scope.user.pass = $scope.user.name = $scope.user.city = '';
				messagesServices.showMessage(data.status, data.msg);
            });
		}
	}
});



moneyApp.controller('loginCtrl', function($scope, $cookies, $location, $window, usersServices, messagesServices){
	$scope.message = messagesServices.message;
	$scope.email = '';
	$scope.pass = '';
	$scope.submit = function(){
        if (!$scope.email || !$scope.pass){
            messagesServices.showMessage('error', 'Помилка! Треба ввести E-mail та пароль!');
        }
        else{
            usersServices.getUserByEmailPass($scope.email, $scope.pass, function(data){
                $scope.email = $scope.pass = '';
                messagesServices.showMessage(data.status, data.msg);
                if (data.status == 'success'){
					$cookies.put('user', data.arr.id);
					$location.path('/');
					$window.location.reload();
                }
            });
        }
	}
});



moneyApp.controller('logoutCtrl', function($cookies, $location, $window){
	$cookies.remove('user');
	$location.path('/');
	$window.location.reload();
});



moneyApp.controller('categoriesCtrl', function($scope, $cookies, categoriesServices, messagesServices){
	$scope.message = messagesServices.message;
	$scope.catsPlus = [];
	$scope.catsMinus = [];
	categoriesServices.getCategories($cookies.get('user'), function(data){
		if (data.status == 'success'){
			data.arr = data.arr ? data.arr : [];
			for (var i=0; i<data.arr.length; i++){
				if (data.arr[i].type == 'plus') $scope.catsPlus.push(data.arr[i]);
				else $scope.catsMinus.push(data.arr[i]);
			}
		}
	});
	$scope.addCategory = function(type){
		var title = 'Нова категорія ' + (type == 'plus' ? 'доходів' : 'витрат');
		categoriesServices.addCategory($cookies.get('user'), type, title, function(data){
			messagesServices.showMessage(data.status, data.msg);
			if (data.arr.type == 'plus') $scope.catsPlus.push({title: data.arr.title});
			else $scope.catsMinus.push({title: data.arr.title});
		});
	}
	$scope.delCategory = function(type, cid){
		if (confirm('Ви точно хочете видалити цю категорію?')){
			categoriesServices.delCategory(cid, function(data){
				var arr = type == 'plus' ? $scope.catsPlus : $scope.catsMinus;
				for (var i=0; i<arr.length; i++){
					if (arr[i].id == cid) arr.splice(i, 1);
				}
				if (type == 'plus') $scope.catsPlus = arr;
				else $scope.catsMinus = arr;
				messagesServices.showMessage(data.status, data.msg);
			});
		}
	}
	$scope.editCategory = function(type, cid, title){
		console.log(type, cid, title);
	}
});