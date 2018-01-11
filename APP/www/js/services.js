"use strict";

var isDev  = location.href.indexOf('http://192.168') > -1 || location.href.indexOf('http://localhost:') > -1;
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



moneyApp.service('forumServ', function(requestServ){
    this.getPosts = function(from, count, cb){
        requestServ.sendRequest('get', 'getPosts', {
            from:  from,
            count: count
        }, cb);
    }
    this.getPost = function(id, cb){
        requestServ.sendRequest('get', 'getPost', {
            id: id
        }, cb);
    }
    this.addPost = function(post, cb){
        requestServ.sendRequest('post', 'addPost', {
            title:    post.title,
			category: post.category,
			comment:  post.comment
        }, cb);
	}
    this.addComment = function(fid, comment, cb){
        requestServ.sendRequest('post', 'addComment', {
            fid:     fid,
			comment: comment
        }, cb);
	}
    this.setPostStatus = function(id, status, cb){
        requestServ.sendRequest('post', 'setPostStatus', {
            id:     id,
			status: status
        }, cb);
	}
});



moneyApp.service('actionsServ', function(requestServ){
    this.getActions = function(from, count, cb){
        requestServ.sendRequest('get', 'getActions', {
            from:  from,
            count: count
        }, cb);
    }
    this.getAction = function(id, cb){
        requestServ.sendRequest('get', 'getAction', {
            id: id
        }, cb);
    }
    this.editAction = function(action, cb){
        requestServ.sendRequest('post', 'editAction', {
            id:             action.id,
			date:           action.date,
			type:           action.type,
			accountFrom_id: action.accountFrom_id,
			accountTo_id:   action.accountTo_id,
			category_id:    action.category_id,
			sum:            action.sum,
			description:    action.description
        }, cb);
	}
    this.delAction = function(id, cb){
        requestServ.sendRequest('post', 'delAction', {
			id: id
        }, cb);
    }
});



moneyApp.service('categoriesServ', function(requestServ){
    this.getCategories = function(cb){
        requestServ.sendRequest('get', 'getCategories', {}, cb);
    }
});



moneyApp.service('accountsServ', function($rootScope, requestServ, $ionicPopup){
    this.getAccounts = function(cb){
        requestServ.sendRequest('get', 'getAccounts', {}, cb);
    }
    this.getAccountsPanel = function(){
        requestServ.sendRequest('get', 'getAccounts', {}, function(data){
            if (data.status != 'success'){
                $ionicPopup.alert({
                    title: 'Помилка!',
                    template: data.msg
                });
			}
            else{
                $rootScope.accountsPanel = data.arr ? data.arr.filter(a=>a.panel == 1) : [];
            }
        });
    }
});



moneyApp.service('budgetsServ', function(requestServ){
    this.getBudget = function(budget, cb){
        requestServ.sendRequest('get', 'getBudget', {
            month: budget.month,
            year:  budget.year
        }, cb);
    }
});
