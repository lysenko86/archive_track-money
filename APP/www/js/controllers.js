"use strict";

angular.module('moneyApp.controllers', []);



moneyApp.controller('homeCtrl', function($location, $window, $scope, $rootScope, $ionicPopup, localStorageService, usersServ, accountsServ){
    this.init = function(){
		$rootScope.isAuth = localStorageService.get('token');
		$scope.user = {
			email: '',
			password: ''
		};
        accountsServ.getAccountsPanel();
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



moneyApp.controller('actionsCtrl', function($location, $scope, $rootScope, $state, $ionicModal, $ionicPopup, $filter, actionsServ, categoriesServ, accountsServ, localStorageService, ionicDatePicker){
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
    $scope.parseSum = function(sum){
        var result = 0;
        if (!/^[\d\.\+\-]+$/.test(sum)){
            result = NaN;
        }
        if (result === 0){
            var number = '';
            for (let i=0; i<sum.length; i++){
                if (number && (sum[i] == '+' || sum[i] == '-')){
                    result += parseInt(number);
                    number = '';
                }
                number += sum[i];
            }
            result += parseInt(number);
        }
        return result != 0 ? result : NaN;
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
    $scope.openDatePicker = function(){
        ionicDatePicker.openDatePicker({
            callback: function (val) {
                $scope.action.date = $filter('date')(val, 'dd.MM.yyyy');
            }
        });
    };
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
		else if ($scope.action.type == 'move' && (!$scope.action.date || !$scope.action.accountFrom_id || !$scope.action.accountTo_id)){
            $ionicPopup.alert({title:'Помилка!', template: 'Помилка! Поля "Дата", "Звідки" та "Куди" обов\'язкові для заповнення!'});
		}
		else if ($scope.action.type != 'move' && (!$scope.action.date || !$scope.action.accountFrom_id || !$scope.action.category_id)){
            $ionicPopup.alert({title:'Помилка!', template: 'Помилка! Поля "Дата", "Рахунок" та "Категорія" обов\'язкові для заповнення!'});
		}
		else if (!/^\d{2}\.\d{2}\.\d{4}$/.test($scope.action.date)){
            $ionicPopup.alert({title:'Помилка!', template: 'Помилка! Значення поля "Дата" має бути наступного формату: дд.мм.рррр!'});
		}
		else if (Number.isNaN($scope.parseSum($scope.action.sum))){
            $ionicPopup.alert({title:'Помилка!', template: 'Помилка! Значення поля "Сума" має бути числовим і не нуль!'});
		}
		else{
            $scope.action.sum = $scope.parseSum($scope.action.sum);
			if ($scope.action.type == 'move'){
				$scope.action.category_id = '0';
			}
			else if ($scope.action.type != 'move'){
				$scope.action.accountTo_id = '0';
			}
			$scope.action.date = $scope.dateToAPI($scope.action.date);
			actionsServ.editAction($scope.action, function(data){
				if (data.status == 'success'){
                    data.arr.date = $scope.dateToWEB(data.arr.date);
                    $scope.editActionCloseModal();
                    if ($scope.action.id){     // edit transaction
						for (var i=0; i<$scope.actions.length; i++){
							if ($scope.actions[i].id == $scope.action.id){
								$scope.actions[i] = data.arr;
							}
						}
					}
					else{     // add transaction
                        if ($location.$$path == '/actions'){
                            if ($scope.$parent.$$prevSibling){
                                $scope.$parent.$$prevSibling.actions.unshift(data.arr);
                            }
                            else if ($scope.$parent.$$nextSibling){
                                $scope.$parent.$$nextSibling.actions.unshift(data.arr);
                            }
                        }
					}
                    accountsServ.getAccountsPanel();
				}
                else if(data.status == 'error'){
                    $scope.action.date = $scope.dateToWEB($scope.action.date);
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
                        accountsServ.getAccountsPanel();
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
                $ionicPopup.alert({title:'Помилка!', template: data.msg});
			}
		});
    }

	this.init();
});



moneyApp.controller('budgetsCtrl', function($location, $scope, $rootScope, $ionicPopup, budgetsServ, localStorageService){
    this.init = function(){
		$rootScope.isAuth = localStorageService.get('token');
		if (!$scope.isAuth){
			$location.url('home');
		}
        let obj        = new Date();
		var activeYear = obj.getFullYear();
		$scope.years   = [String(activeYear-1), String(activeYear), String(activeYear+1)];
		$scope.months  = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
		$scope.budget  = {
			month: String(obj.getMonth()+1),
			year: String(activeYear),
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
        $scope.mathAbs = window.Math.abs;
        $scope.getBudget($scope.budget.year, $scope.budget.month);
	}
    $scope.calculateTotalSum = function(){
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
		$scope.budget.plusRest    = $scope.budget.plusPlan - $scope.budget.plusFact;
		$scope.budget.minusRest   = $scope.budget.minusPlan - $scope.budget.minusFact;
		$scope.budget.balancePlan = $scope.budget.plusPlan - $scope.budget.minusPlan;
		$scope.budget.balanceFact = $scope.budget.plusFact - $scope.budget.minusFact;
	}
    $scope.getBudget = function(){
		budgetsServ.getBudget($scope.budget, function(data){
			if (data.status == 'success'){
				$scope.budget.categories = data.arr;
				$scope.calculateTotalSum();
			}
			else{
                $ionicPopup.alert({title:'Помилка!', template: data.msg});
			}
		});
	}

	this.init();
});



moneyApp.controller('forumCtrl', function($location, $scope, $rootScope, $state, $stateParams, $ionicModal, $ionicPopup, localStorageService, forumServ){
    this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		if (!$scope.isAuth){
			$location.url('home');
		}
		$scope.categories = [
			{key: 'public', title: 'Паблік'},
			{key: 'bug', title: 'Помилки'},
			{key: 'feature', title: 'Ідеї'},
			{key: 'thank', title: 'Подяки'},
			{key: 'question', title: 'Питання'},
			{key: 'forAdmin', title: 'Адміну'}
		];
		$scope.statuses = [
			{key: 'created', title: 'Створено'},
			{key: 'viewed', title: 'Переглянуто'},
            {key: 'progress', title: 'У розробці'},
			{key: 'fixed', title: 'Виправлено'},
            {key: 'cancel', title: 'Відхилено'},
            {key: 'done', title: 'Зроблено'},
			{key: 'closed', title: 'Закрито'}
		];
		$scope.post = {
			title: '',
			category: '',
			comment: ''
		};
        $scope.modal   = false;
		$scope.comment = {text: ''};
		$scope.posts   = $scope.comments = [];
		$scope.fid     = $stateParams.post;
		$scope.isAdmin = false;
		if (!$scope.fid){
			forumServ.getPosts($scope.posts.length, 20, function(data){
				if (data.status == 'success'){
					data.arr       = data.arr ? data.arr : [];
                    $scope.categories.forEach(function(category){
                        if (data.isAdmin || category.key != 'forAdmin'){
                            $scope.posts.push({
                                catKey: category.key,
                                catTitle: category.title
                            });
                        }
                        data.arr.filter(post=>post.category == category.key).forEach(function(post){
                            if (data.isAdmin || post.category != 'forAdmin'){
                                post.statusTitle = $scope.statuses.find(status=>status.key == post.status).title;
                                $scope.posts.push(post);
                            }
                        });
                    });
					$scope.isAdmin = data.isAdmin;
				}
				else{
                    $ionicPopup.alert({title:'Помилка!', template: data.msg});
				}
			});
		}
		else{
			forumServ.getPost($scope.fid, function(data){
				if (data.status == 'success'){
					$scope.post.id          = data.arr.id;
					$scope.post.title       = data.arr.title;
					$scope.post.category    = data.arr.category;
					$scope.post.status      = data.arr.status;
                    $scope.post.statusTitle = $scope.statuses.find(status=>status.key == data.arr.status).title;
					$scope.post.created     = data.arr.created;
					$scope.post.updated     = data.arr.updated;
					$scope.post.email       = data.arr.email;
					$scope.post.admin       = data.arr.admin;
					$scope.post.email_upd   = data.arr.email_upd;
					$scope.post.admin_upd   = data.arr.admin_upd;
					$scope.post.count       = data.arr.count;
					$scope.comments         = data.arr.comments;
					$scope.isAdmin          = data.isAdmin;
				}
				else{
					$ionicPopup.alert({title:'Помилка!', template: data.msg});
				}
			});
		}
	}
    $scope.editPostOpenModal = function(){
        $ionicModal.fromTemplateUrl('templates/postForm.html', {scope: $scope}).then(function(modal){
            $scope.modal = modal;
            $scope.modal.show();
        });
    }
    $scope.editPostCloseModal = function(){
        $scope.modal.remove();
        $scope.post.title = $scope.post.category = $scope.post.comment = '';
    }
    $scope.editPost = function(){
		if (!$scope.post.title || !$scope.post.category || !$scope.post.comment){
            $ionicPopup.alert({title:'Помилка!', template: 'Помилка! Поля "Тема", "Категорія" та "Перший коментар" обов\'язкові для заповнення!'});
		}
		else{
			forumServ.addPost($scope.post, function(data){
				if (data.status == 'success'){
                    let index = $scope.posts.findIndex(item=>item.catKey == data.arr.category);
                    if (index > -1){
                        data.arr.statusTitle = $scope.statuses.find(status=>status.key == data.arr.status).title;
                        $scope.posts.splice(++index, 0, data.arr);
                    }
					$scope.post.title = $scope.post.category = $scope.post.comment = '';
                    $scope.editPostCloseModal();
				}
            });
		}
	}
    $scope.editCommentOpenModal = function(){
        $ionicModal.fromTemplateUrl('templates/commentForm.html', {scope: $scope}).then(function(modal){
            $scope.modal = modal;
            $scope.modal.show();
        });
    }
    $scope.editCommentCloseModal = function(){
        $scope.modal.remove();
        $scope.comment.text = '';
    }
	$scope.editComment = function(){
		if (!$scope.comment.text){
            $ionicPopup.alert({title:'Помилка!', template: 'Помилка! Поле "Коментар" обов\'язкове для заповнення!'});
		}
		else{
			$scope.fid = $stateParams.post;
			forumServ.addComment($scope.fid, $scope.comment.text, function(data){
				if (data.status == 'success'){
					$scope.comments.push(data.arr);
					$scope.post.count     = $scope.comments.length;
					$scope.post.updated   = data.arr.created;
					$scope.post.email_upd = data.arr.email;
					$scope.comment.text   = '';
                    $scope.editCommentCloseModal();
				}
            });
		}
	}

	this.init();
});
