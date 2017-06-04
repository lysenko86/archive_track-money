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

})



.service('categoriesServ', function($http){

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
