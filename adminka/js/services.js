"use strict";

var isDev = location.href.indexOf('/adminka.trackmoney/') > -1;
var config = {
    isDev : isDev,
    api: isDev ? 'http://api.trackmoney/api.php' : 'api.php'
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



/*moneyApp.service('forumServ', function($http, localStorageService){
    var token = localStorageService.get('token');
	this.getPosts = function(from, count, cb){
        $http.get(config.api + '?action=getPosts&token=' + token + '&from=' + from + '&count=' + count)
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
    }
    this.getPost = function(id, cb){
        $http.get(config.api + '?action=getPost&token=' + token + '&id=' + id)
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
    }
    this.addPost = function(post, cb){
		$http.post(config.api + '?token=' + token, {
			action: 'addPost',
			title: post.title,
			category: post.category,
			comment: post.comment
		})
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
	}
    this.addComment = function(fid, comment, cb){
		$http.post(config.api + '?token=' + token, {
			action: 'addComment',
            fid: fid,
			comment: comment
		})
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
	}
});



moneyApp.service('mailingServ', function($http, localStorageService){
    var token = localStorageService.get('token');
	this.getActions = function(from, count, cb){
        $http.get(config.api + '?action=getActions&token=' + token + '&from=' + from + '&count=' + count)
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
    }
	this.getAction = function(id, cb){
        $http.get(config.api + '?action=getAction&token=' + token + '&id=' + id)
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
    }
	this.addAction = function(action, cb){
		$http.post(config.api + '?token=' + token, {
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
        .error(function(error, status){
            cb('requestError');
        });
	}
	this.editAction = function(id, action, cb){
		$http.post(config.api + '?token=' + token, {
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
        .error(function(error, status){
            cb('requestError');
        });
	}
	this.delAction = function(id, cb){
		$http.post(config.api + '?token=' + token, {
			action: 'delAction',
			id: id
		})
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
    }
});



moneyApp.service('categoriesServ', function($http, localStorageService){
    var token = localStorageService.get('token');
    this.getCategories = function(cb){
        $http.get(config.api + '?action=getCategories&token=' + token)
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
    }
	this.getCategory = function(id, cb){
        $http.get(config.api + '?action=getCategory&token=' + token + '&id=' + id)
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
    }
	this.addCategory = function(category, cb){
		$http.post(config.api + '?token=' + token, {
			action: 'addCategory',
			title: category.title,
			type: category.type
		})
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
	}
	this.editCategory = function(id, category, cb){
		$http.post(config.api + '?token=' + token, {
			action: 'editCategory',
			id: id,
			title: category.title,
			type: category.type
		})
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
	}
	this.delCategory = function(id, cb){
		$http.post(config.api + '?token=' + token, {
			action: 'delCategory',
			id: id
		})
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
    }
});*/
