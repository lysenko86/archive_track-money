"use strict";

var isDev = location.href.indexOf('/adminka.trackmoney/') > -1;
var config = {
    isDev : isDev,
    api: isDev ? 'http://api.trackmoney/api.php' : 'http://api.trackmoney.com.ua/api.php'
}



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



moneyApp.service('usersServ', function(requestServ){
    this.signin = function(user, cb){
        requestServ.sendRequest('post', 'admin_signin', {
            email:    user.email,
            password: user.password
        }, cb);
    }
    this.logout = function(cb){
        requestServ.sendRequest('get', 'admin_logout', {}, cb);
    }
    this.getUsers = function(cb){
        requestServ.sendRequest('get', 'admin_getUsers', {}, cb);
    }
});



moneyApp.service('mailingServ', function(requestServ){
    this.getMails = function(cb){
        requestServ.sendRequest('get', 'admin_getMails', {}, cb);
    }
    this.getMail = function(id, cb){
        requestServ.sendRequest('get', 'admin_getMail', {
            id: id
        }, cb);
    }
    this.mailSave = function(mail, cb){
        requestServ.sendRequest('post', 'admin_mailSave', {
            id:      mail.id,
            theme:   mail.theme,
			content: mail.content
        }, cb);
	}
    this.mailTest = function(mail, cb){
        requestServ.sendRequest('post', 'admin_mailTest', {
            id:      mail.id,
            theme:   mail.theme,
			content: mail.content
        }, cb);
	}
    this.mailSend = function(mail, cb){
        requestServ.sendRequest('post', 'admin_mailSend', {
            id:      mail.id,
            theme:   mail.theme,
			content: mail.content
        }, cb);
	}
});
