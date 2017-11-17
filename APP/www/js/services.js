"use strict";

var isDev  = location.href.indexOf('http://192.168') > -1;
var config = {
    isDev : isDev,
    api: isDev ? 'http://api.trackmoney/api.php' : 'http://api.trackmoney.com.ua/api.php'
};

angular.module('moneyApp.services', []);



moneyApp.service('requestServ', function($http, localStorageService, $ionicPopup){
    var token = localStorageService.get('token');
    var link  = this;
    this.sendRequest = function(method, action, data, cb){
        angular.element(document.getElementById('loaderPage')).css('display', 'flex');
        let url = config.api + '?token=' + token;
        if (method === 'get'){
            url += '&action=' + action;
            for (let key in data){
                url += '&'+key+'=' + data[key];
                delete data[key];
            }
            $http.get(url)
                .success(function(data){
                    link.getResponse(data, cb);
                })
                .error(function(error, status){
                    link.getResponse('requestError', cb);
                });
        }
        else if (method === 'post'){
            data.action = action;
            $http.post(url, data)
                 .success(function(data){
                     link.getResponse(data, cb);
                 })
                 .error(function(error, status){
                     link.getResponse('requestError', cb);
                 });
        }
        else{
            link.getResponse('requestError', cb);
        }
    }
    this.getResponse = function(data, cb){
        angular.element(document.getElementById('loaderPage')).css('display', 'none');
        if (data == 'requestError'){
            $ionicPopup.alert({
                title: 'Помилка!',
                template: 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!'
            });
        }
        else{
            cb(data);
        }
    }
});



moneyApp.service('usersServ', function(requestServ){
    this.signin = function(user, cb){
        requestServ.sendRequest('post', 'signin', {
            email:    user.email,
            password: user.password
        }, cb);
    }
});


/*
.service('actionsServ', function($http){
    this.getActions = function(from, count, cb){
        $http.get('http://trackmoney.com.ua/server.php?action=getActions&from=' + from + '&count=' + count)
		.success(function(data){
            cb(data);
        });
    }
    this.getAction = function(id, cb){
        $http.get('http://trackmoney.com.ua/server.php?action=getAction&id=' + id)
		.success(function(data){
			data.arr.date = data.arr.date.substr(8,2) + '.' + data.arr.date.substr(5,2) + '.' + data.arr.date.substr(0,4);
            cb(data);
        });
    }
    this.editAction = function(id, action, cb){
		$http.post('http://trackmoney.com.ua/server.php', {
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
        })
        .error(function(){
			cb(false);
		});
	}
    this.deleteAction = function(id, cb){
		$http.post('http://trackmoney.com.ua/server.php', {
			action: 'delAction',
			id: id
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
        $http.get('http://trackmoney.com.ua/server.php?action=getCategories')
		.success(function(data){
            cb(data);
        });
    }
})



.service('accountsServ', function($http){
	this.getAccounts = function(cb){
		$http.get('http://trackmoney.com.ua/server.php?action=getAccounts')
		.success(function(data){
			cb(data);
		});
	}
})



.service('budgetsServ', function($http){
	this.getBudget = function(month, year, cb){
		$http.get('http://trackmoney.com.ua/server.php?action=getBudget&month=' + month + '&year=' + year)
		.success(function(data){
			cb(data);
		});
	}
});
*/
