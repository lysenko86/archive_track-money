"use strict";

var isDev  = location.href.indexOf('/web.trackmoney/') > -1;
var config = {
    isDev : isDev,
    api: isDev ? 'http://api.trackmoney/api.php' : 'http://api.trackmoney.com.ua/api.php'
};



moneyApp.service('messagesServ', function($rootScope, $timeout){
    $rootScope.messages = [];
    this.showMessages = function(status, text, delay, cb){
        $rootScope.messages.push({
            status: status,
            class:  status == 'error' ? 'alert-danger' : 'alert-success',
            text:   text
        });
        $timeout(function(){
            $rootScope.messages.shift();
            if (cb){
                cb();
            }
        }, delay ? delay : 4000);
    }
});



moneyApp.service('requestServ', function($http, localStorageService, messagesServ){
    var token = localStorageService.get('token');
    var link  = this;
    this.sendRequest = function(method, action, data, cb){
        angular.element(document).find('#loaderPage').css('display', 'flex');
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
        angular.element(document).find('#loaderPage').css('display', 'none');
        if (data == 'requestError'){
            messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
        }
        else{
            cb(data);
        }
    }
});



moneyApp.service('printServ', function($rootScope){
    $rootScope.printMode = false;
    this.togglePrintMode = function(){
		$rootScope.printMode = !$rootScope.printMode;
	}
});



moneyApp.service('usersServ', function(requestServ){
    this.getCount = function(cb){
        requestServ.sendRequest('get', 'getCountUsers', {}, cb);
    }
    this.signin = function(user, cb){
        requestServ.sendRequest('post', 'signin', {
            email:    user.email,
            password: user.password
        }, cb);
    }
    this.signup = function(user, cb){
        requestServ.sendRequest('post', 'signup', {
            email:    user.email,
            password: user.password,
            agree:    user.agree
        }, cb);
    }
    this.logout = function(cb){
        requestServ.sendRequest('get', 'logout', {}, cb);
    }
    this.confirm = function(confirm, cb){
        requestServ.sendRequest('get', 'confirmEmail', {
            confirm: confirm[0]+'.'+confirm[1]
        }, cb);
    }
    this.reset = function(reset, cb){
        requestServ.sendRequest('get', 'resetPassword', {
            reset: reset[0]+'.'+reset[1]
        }, cb);
    }
    this.sendConfirmMail = function(email, cb){
        requestServ.sendRequest('post', 'sendConfirmMail', {
            email: email
        }, cb);
    }
    this.sendPasswordMail = function(email, cb){
        requestServ.sendRequest('post', 'sendPasswordMail', {
            email: email
        }, cb);
    }
    this.getProfile = function(cb){
        requestServ.sendRequest('get', 'getProfile', {}, cb);
    }
    this.editPassword = function(chPassword, cb){
        requestServ.sendRequest('post', 'editPassword', {
            password:        chPassword.password,
            newPassword:     chPassword.newPassword,
            confirmPassword: chPassword.confirmPassword
        }, cb);
    }
    this.removeAccount = function(cb){
        requestServ.sendRequest('post', 'removeAccount', {}, cb);
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
    this.getCategory = function(id, cb){
        requestServ.sendRequest('get', 'getCategory', {
            id: id
        }, cb);
    }
    this.editCategory = function(category, cb){
        requestServ.sendRequest('post', 'editCategory', {
            id:    category.id,
			title: category.title,
			type:  category.type,
            cat:   category.type == 'minus' ? category.cat : '',
            goal:  category.goal ? category.goal : '0'
        }, cb);
	}
    this.delCategory = function(id, cb){
        requestServ.sendRequest('post', 'delCategory', {
			id: id
        }, cb);
    }
});



moneyApp.service('accountsServ', function($rootScope, requestServ, messagesServ){
    this.getAccounts = function(cb){
        requestServ.sendRequest('get', 'getAccounts', {}, cb);
    }
    this.getBalances = function(cb){
        requestServ.sendRequest('get', 'getBalances', {}, cb);
    }
    this.getAccount = function(id, cb){
        requestServ.sendRequest('get', 'getAccount', {
            id: id
        }, cb);
    }
    this.editAccount = function(account, cb){
        let date = new Date();
        let dateMonth = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
        let dateDay = (date.getDate() < 10 ? '0' : '') + date.getDate();
        requestServ.sendRequest('post', 'editAccount', {
            id:      account.id,
			title:   account.title,
            balance: account.balance,
            panel:   account.panel,
            date:    date.getFullYear() + '-' + dateMonth + '-' + dateDay
        }, cb);
	}
    this.delAccount = function(id, cb){
        let date = new Date();
        let dateMonth = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
        let dateDay = (date.getDate() < 10 ? '0' : '') + date.getDate();
        requestServ.sendRequest('post', 'delAccount', {
			id:   id,
            date: date.getFullYear() + '-' + dateMonth + '-' + dateDay
        }, cb);
    }
    this.getAccountsPanel = function(){
        requestServ.sendRequest('get', 'getAccounts', {}, function(data){
            if (data.status != 'success'){
                messagesServ.showMessages(data.status, data.msg);
			}
            $rootScope.accountsPanel = data.arr ? data.arr : [];
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
    this.getCategory = function(id, cb){
        requestServ.sendRequest('get', 'getBudgetCategory', {
            id: id
        }, cb);
    }
    this.editCategory = function(category, cb){
        requestServ.sendRequest('post', 'editBudgetCategory', {
            id:          category.id,
			month:       category.month,
			year:        category.year,
            category_id: category.category_id,
            sum:         category.sum
        }, cb);
	}
    this.delCategory = function(id, cb){
        requestServ.sendRequest('post', 'delBudgetCategory', {
			id: id
        }, cb);
    }
    this.copyBudget = function(data, cb){
        requestServ.sendRequest('get', 'copyBudget', data, cb);
    }
});



moneyApp.service('propertiesServ', function(requestServ){
    this.getProperties = function(cb){
        requestServ.sendRequest('get', 'getProperties', {}, cb);
    }
    this.getProperty = function(id, cb){
        requestServ.sendRequest('get', 'getProperty', {
            id: id
        }, cb);
    }
    this.editProperty = function(property, cb){
        let date = new Date();
        let dateMonth = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
        let dateDay = (date.getDate() < 10 ? '0' : '') + date.getDate();
        requestServ.sendRequest('post', 'editProperty', {
            id:    property.id,
			title: property.title,
            price: property.price,
            date: date.getFullYear() + '-' + dateMonth + '-' + dateDay
        }, cb);
	}
    this.delProperty = function(id, cb){
        let date = new Date();
        let dateMonth = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
        let dateDay = (date.getDate() < 10 ? '0' : '') + date.getDate();
        requestServ.sendRequest('post', 'delProperty', {
			id: id,
            date: date.getFullYear() + '-' + dateMonth + '-' + dateDay
        }, cb);
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
