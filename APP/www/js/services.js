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
});



moneyApp.service('actionsServ', function(requestServ){
    this.getActions = function(filter, cb){
        requestServ.sendRequest('get', 'getActions', {
            start:        filter.start,
            timeInterval: filter.timeInterval,
            searchBy:     filter.searchBy,
            searchText:   filter.searchText
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
    this.getGoals = function(cb){
        requestServ.sendRequest('get', 'getGoals', {}, cb);
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



moneyApp.service('propertiesServ', function(requestServ){
    this.getProperties = function(cb){
        requestServ.sendRequest('get', 'getProperties', {}, cb);
    }
});



moneyApp.service('analyticsServ', function($http, requestServ){
    this.getExchangeRateFromNBU = function(cb){
        angular.element(document).find('#loaderPage').css('display', 'flex');
        $http.get('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
            .success(function(data){
                let rate = {};
                data.map(item => {
                    if (item.cc == 'USD' || item.cc == 'EUR'){
                        rate[item.cc] = Math.round(item.rate * 100) / 100;
                    }
                });
                requestServ.getResponse(rate, cb);
            })
            .error(function(error, status){
                requestServ.getResponse('requestError', cb);
            });
    }
    this.getDatesToFrom = function(years){
        let dateFrom = new Date();
        let dateTo = new Date();
        dateTo.setDate(0);
        dateFrom.setDate(1);
        dateFrom.setMonth(dateTo.getMonth() + 1);
        dateFrom.setFullYear(dateTo.getFullYear() - (years ? years : 1));
        let dateToMonth = (dateTo.getMonth() + 1 < 10 ? '0' : '') + (dateTo.getMonth() + 1);
        let dateFromMonth = (dateFrom.getMonth() + 1 < 10 ? '0' : '') + (dateFrom.getMonth() + 1);
        let dateToDay = (dateTo.getDate() < 10 ? '0' : '') + dateTo.getDate();
        let dateFromDay = (dateFrom.getDate() < 10 ? '0' : '') + dateFrom.getDate();
        return {
            dateFrom: dateFrom.getFullYear() + '-' + dateFromMonth + '-' + dateFromDay,
            dateTo: dateTo.getFullYear() + '-' + dateToMonth + '-' + dateToDay
        }
    }
    this.getIncomeByMonth = function(cb){
        let dates = this.getDatesToFrom();
        requestServ.sendRequest('get', 'getIncomeByMonth', {
            dateFrom: dates.dateFrom,
            dateTo: dates.dateTo
        }, cb);
    }
    this.getCostByMonth = function(cb){
        let dates = this.getDatesToFrom();
        requestServ.sendRequest('get', 'getCostByMonth', {
            dateFrom: dates.dateFrom,
            dateTo: dates.dateTo
        }, cb);
    }
    this.getActiveByMonth = function(cb){
        let dates = this.getDatesToFrom();
        requestServ.sendRequest('get', 'getActiveByMonth', {
            dateFrom: dates.dateFrom,
            dateTo: dates.dateTo
        }, cb);
    }
    this.getPassiveByMonth = function(cb){
        let dates = this.getDatesToFrom();
        requestServ.sendRequest('get', 'getPassiveByMonth', {
            dateFrom: dates.dateFrom,
            dateTo: dates.dateTo
        }, cb);
    }
    this.getCapitalByMonth = function(cb){
        let dates = this.getDatesToFrom(2);
        requestServ.sendRequest('get', 'getCapitalByMonth', {
            dateFrom: dates.dateFrom,
            dateTo: dates.dateTo
        }, cb);
    }
});
