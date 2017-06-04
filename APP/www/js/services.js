"use strict";

angular.module('moneyApp.services', [])



.service('connectionServ', function($http){
    this.testConnection = function(cb){
        $http.get('http://money.fastovmanicure.com.ua/server.php?action=testConnection')
		.success(function(data){
            cb(true, data.arr.count >= 0 ? true : false);
        })
		.error(function(){
			cb(false, false);
		});
    }
})



.service('actionsServ', function($http){
    this.getActions = function(from, count, cb){
        $http.get('http://money.fastovmanicure.com.ua/server.php?action=getActions&from=' + from + '&count=' + count)
		.success(function(data){
            cb(data);
        });
    }
    this.addAction = function(action, cb){
		$http.post('http://money.fastovmanicure.com.ua/server.php', {
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
        })
        .error(function(){
			cb(false);
		});
	}
})



.service('categoriesServ', function($http){
    this.getCategories = function(cb){
        $http.get('http://money.fastovmanicure.com.ua/server.php?action=getCategories')
		.success(function(data){
            cb(data);
        });
    }
})



.service('accountsServ', function($http){
	this.getAccounts = function(cb){
		$http.get('http://money.fastovmanicure.com.ua/server.php?action=getAccounts')
		.success(function(data){
			cb(data);
		});
	}
})



.service('budgetsServ', function($http){
	this.getBudget = function(month, year, cb){
		$http.get('http://money.fastovmanicure.com.ua/server.php?action=getBudget&month=' + month + '&year=' + year)
		.success(function(data){
			cb(data);
		});
	}
});
