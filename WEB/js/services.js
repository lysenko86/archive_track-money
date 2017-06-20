"use strict";

moneyApp.service('usersServ', function($http, localStorageService){
    var token = localStorageService.get('token');
    this.signin = function(user, cb){
        $http.post('server.php', {
			action: 'signin',
			email: user.email,
			password: user.password
		})
		.success(function(data){
            cb(data);
        });
    }
    this.signup = function(user, cb){
        $http.post('server.php', {
			action: 'signup',
			email: user.email,
			password: user.password,
            agree: user.agree
		})
		.success(function(data){
            cb(data);
        });
    }
    this.logout = function(cb){
        $http.get('server.php?action=logout&token=' + token)
		.success(function(data){
            cb(data);
        });
    }
    this.confirm = function(confirm, cb){
        $http.get('server.php?action=confirmEmail&confirm='+confirm[0]+'.'+confirm[1])
		.success(function(data){
            cb(data);
        });
    }
});



moneyApp.service('messagesServ', function($timeout){
    var self = this;
    this.messages = [];
    this.delay = 4000;
    this.showMessages = function(status, text, delay, cb){
        self.messages.push({
            status: status,
            class: status == 'error' ? 'alert-danger' : 'alert-success',
            text: text
        });
        $timeout(function(){
            self.messages.shift();
            if (cb){
                cb();
            }
        }, delay ? delay : this.delay);
    }
});



moneyApp.service('actionsServ', function($http, localStorageService){
    var token = localStorageService.get('token');
	this.getActions = function(from, count, cb){
        $http.get('server.php?action=getActions&token=' + token + '&from=' + from + '&count=' + count)
		.success(function(data){
            cb(data);
        });
    }
	this.getAction = function(id, cb){
        $http.get('server.php?action=getAction&token=' + token + '&id=' + id)
		.success(function(data){
            cb(data);
        });
    }
	this.addAction = function(action, cb){
		$http.post('server.php?token=' + token, {
			action: 'addAction',
			date: action.date.substr(6,4) + '-' + action.date.substr(3,2) + '-' + action.date.substr(0,2),
			type: action.type,
			accountFrom_id: action.accountFrom_id,
			accountTo_id: action.accountTo_id,
			category_id: action.category_id,
			sum: action.sum,
			description: action.description
		})
		.success(function(data){
            cb(data);
        });
	}
	this.editAction = function(id, action, cb){
		$http.post('server.php?token=' + token, {
			action: 'editAction',
			id: id,
			date: action.date.substr(6,4) + '-' + action.date.substr(3,2) + '-' + action.date.substr(0,2),
			type: action.type,
			accountFrom_id: action.accountFrom_id,
			accountTo_id: action.accountTo_id,
			category_id: action.category_id,
			sum: action.sum,
			description: action.description
		})
		.success(function(data){
            cb(data);
        });
	}
	this.delAction = function(id, cb){
		$http.post('server.php?token=' + token, {
			action: 'delAction',
			id: id
		})
		.success(function(data){
            cb(data);
        });
    }
});



moneyApp.service('categoriesServ', function($http, localStorageService){
    var token = localStorageService.get('token');
    this.getCategories = function(cb){
        $http.get('server.php?action=getCategories&token=' + token)
		.success(function(data){
            cb(data);
        });
    }
	this.getCategory = function(id, cb){
        $http.get('server.php?action=getCategory&token=' + token + '&id=' + id)
		.success(function(data){
            cb(data);
        });
    }
	this.addCategory = function(category, cb){
		$http.post('server.php?token=' + token, {
			action: 'addCategory',
			title: category.title,
			type: category.type
		})
		.success(function(data){
            cb(data);
        });
	}
	this.editCategory = function(id, category, cb){
		$http.post('server.php?token=' + token, {
			action: 'editCategory',
			id: id,
			title: category.title,
			type: category.type
		})
		.success(function(data){
            cb(data);
        });
	}
	this.delCategory = function(id, cb){
		$http.post('server.php?token=' + token, {
			action: 'delCategory',
			id: id
		})
		.success(function(data){
            cb(data);
        });
    }
});



moneyApp.service('accountsServ', function($http, localStorageService){
    var token = localStorageService.get('token');
	this.getAccounts = function(cb){
        $http.get('server.php?action=getAccounts&token=' + token)
		.success(function(data){
            cb(data);
        });
    }
	this.getAccount = function(id, cb){
        $http.get('server.php?action=getAccount&token=' + token + '&id=' + id)
		.success(function(data){
            cb(data);
        });
    }
	this.addAccount = function(account, cb){
		$http.post('server.php?token=' + token, {
			action: 'addAccount',
			title: account.title,
			balance: account.balance
		})
		.success(function(data){
            cb(data);
        });
	}
	this.editAccount = function(id, account, cb){
		$http.post('server.php?token=' + token, {
			action: 'editAccount',
			id: id,
			title: account.title,
			balance: account.balance
		})
		.success(function(data){
            cb(data);
        });
	}
	this.delAccount = function(id, cb){
		$http.post('server.php?token=' + token, {
			action: 'delAccount',
			id: id
		})
		.success(function(data){
            cb(data);
        });
    }
});



moneyApp.service('budgetsServ', function($http, localStorageService){
    var token = localStorageService.get('token');
	this.getBudget = function(budget, cb){
        $http.get('server.php?action=getBudget&token=' + token + '&month=' + budget.month + '&year=' + budget.year)
		.success(function(data){
            cb(data);
        });
    }
	this.getCategory = function(id, cb){
        $http.get('server.php?action=getBudgetCategory&token=' + token + '&id=' + id)
		.success(function(data){
            cb(data);
        });
    }
	this.addCategory = function(category, cb){
		$http.post('server.php?token=' + token, {
			action: 'addBudgetCategory',
			month: category.month,
			year: category.year,
			category_id: category.category_id,
			sum: category.sum
		})
		.success(function(data){
            cb(data);
        });
	}
	this.editCategory = function(id, category, cb){
		$http.post('server.php?token=' + token, {
			action: 'editBudgetCategory',
			id: id,
			month: category.month,
			year: category.year,
			category_id: category.category_id,
			sum: category.sum
		})
		.success(function(data){
            cb(data);
        });
	}
	this.delCategory = function(id, cb){
		$http.post('server.php?token=' + token, {
			action: 'delBudgetCategory',
			id: id
		})
		.success(function(data){
            cb(data);
        });
    }
});
