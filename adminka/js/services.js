"use strict";

var isDev = location.href.indexOf('/adminka.trackmoney/') > -1;
var config = {
    isDev : isDev,
    api: isDev ? 'http://api.trackmoney/api.php' : 'http://api.trackmoney.com.ua/api.php'
}

moneyApp.service('usersServ', function($http, localStorageService){
    var token = localStorageService.get('token');
    this.signin = function(user, cb){
        $http.post(config.api, {
			action: 'admin_signin',
			email: user.email,
			password: user.password
		})
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
    }
    this.logout = function(cb){
        $http.get(config.api + '?action=admin_logout&token=' + token)
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
    }
    this.getUsers = function(cb){
        $http.get(config.api + '?action=admin_getUsers&token=' + token)
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
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
