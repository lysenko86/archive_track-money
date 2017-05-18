"use strict";

moneyApp.service('messagesServ', function($timeout){
    var self = this;
    this.message = {
        status: '',
        class: '',
        text: ''
    }
    this.delay = 4000;
    this.showMessage = function(status, text){
        self.message.status = status;
        self.message.class = status == 'error' ? 'alert-danger' : 'alert-success';
        self.message.text = text;
        $timeout(function(){
            self.message.status = self.message.class = self.message.text = '';
        }, this.delay);
    }
});



moneyApp.service('actionsServ', function($http){
	this.getActions = function(cb){
        $http.get('server.php?action=getActions')
		.success(function(data){
            cb(data);
        });
    }
	this.getAction = function(id, cb){
        $http.get('server.php?action=getAction&id=' + id)
		.success(function(data){
			data.arr.date = data.arr.date.substr(8,2) + '.' + data.arr.date.substr(5,2) + '.' + data.arr.date.substr(0,4);
            cb(data);
        });
    }
	this.addAction = function(action, cb){
		$http.post('server.php', {
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
		$http.post('server.php', {
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
		$http.post('server.php', {
			action: 'delAction',
			id: id
		})
		.success(function(data){
            cb(data);
        });
    }
});



moneyApp.service('categoriesServ', function($http){
    this.getCategories = function(cb){
        $http.get('server.php?action=getCategories')
		.success(function(data){
            cb(data);
        });
    }
	this.getCategory = function(id, cb){
        $http.get('server.php?action=getCategory&id=' + id)
		.success(function(data){
            cb(data);
        });
    }
	this.addCategory = function(category, cb){
		$http.post('server.php', {
			action: 'addCategory',
			title: category.title,
			type: category.type
		})
		.success(function(data){
            cb(data);
        });
	}
	this.editCategory = function(id, category, cb){
		$http.post('server.php', {
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
		$http.post('server.php', {
			action: 'delCategory',
			id: id
		})
		.success(function(data){
            cb(data);
        });
    }
});



moneyApp.service('accountsServ', function($http){
	this.getAccounts = function(cb){
        $http.get('server.php?action=getAccounts')
		.success(function(data){
            cb(data);
        });
    }
	this.getAccount = function(id, cb){
        $http.get('server.php?action=getAccount&id=' + id)
		.success(function(data){
            cb(data);
        });
    }
	this.addAccount = function(account, cb){
		$http.post('server.php', {
			action: 'addAccount',
			title: account.title,
			balance: account.balance
		})
		.success(function(data){
            cb(data);
        });
	}
	this.editAccount = function(id, account, cb){
		$http.post('server.php', {
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
		$http.post('server.php', {
			action: 'delAccount',
			id: id
		})
		.success(function(data){
            cb(data);
        });
    }
});



moneyApp.service('budgetsServ', function($http){
	this.getBudget = function(budget, cb){
        $http.get('server.php?action=getBudget&month=' + budget.month + '&year=' + budget.year)
		.success(function(data){
            cb(data);
        });
    }
	this.getCategory = function(id, cb){
        $http.get('server.php?action=getBudgetCategory&id=' + id)
		.success(function(data){
            cb(data);
        });
    }
	this.addCategory = function(category, cb){
		$http.post('server.php', {
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
		$http.post('server.php', {
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
		$http.post('server.php', {
			action: 'delBudgetCategory',
			id: id
		})
		.success(function(data){
            cb(data);
        });
    }
});