"use strict";

var isDev = location.href.indexOf('/web.trackmoney/') > -1;
var config = {
    isDev : isDev,
    api: isDev ? 'http://api.trackmoney/api.php' : 'http://api.trackmoney.com.ua/api.php'
}

moneyApp.service('usersServ', function($http, localStorageService){
    var token = localStorageService.get('token');
    this.getCount = function(cb){
        $http.get(config.api + '?action=getCountUsers&token=' + token)
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
    }
    this.signin = function(user, cb){
        $http.post(config.api, {
			action: 'signin',
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
    this.signup = function(user, cb){
        $http.post(config.api, {
			action: 'signup',
			email: user.email,
			password: user.password,
            agree: user.agree
		})
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
    }
    this.logout = function(cb){
        $http.get(config.api + '?action=logout&token=' + token)
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
    }
    this.confirm = function(confirm, cb){
        $http.get(config.api + '?action=confirmEmail&confirm='+confirm[0]+'.'+confirm[1])
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
    }
    this.reset = function(reset, cb){
        $http.get(config.api + '?action=resetPassword&reset='+reset[0]+'.'+reset[1])
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
    }
    this.sendConfirmMail = function(email, cb){
        $http.post(config.api, {
			action: 'sendConfirmMail',
			email: email
		})
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
    }
    this.sendPasswordMail = function(email, cb){
        $http.post(config.api, {
			action: 'sendPasswordMail',
			email: email
		})
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
    }
    this.getProfile = function(cb){
        $http.get(config.api + '?action=getProfile&token=' + token)
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
    }
    this.editPassword = function(chPassword, cb){
        $http.post(config.api + '?token=' + token, {
			action: 'editPassword',
			password: chPassword.password,
			newPassword: chPassword.newPassword,
            confirmPassword: chPassword.confirmPassword
		})
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
    }
    this.removeAccount = function(cb){
        $http.post(config.api + '?token=' + token, {
			action: 'removeAccount'
		})
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



moneyApp.service('forumServ', function($http, localStorageService){
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
    this.setPostStatus = function(id, status, cb){
		$http.post(config.api + '?token=' + token, {
			action: 'setPostStatus',
			id: id,
			status: status
		})
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
	}
});



moneyApp.service('actionsServ', function($http, localStorageService){
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
    this.editAction = function(action, cb){
		$http.post(config.api + '?token=' + token, {
			action: 'editAction',
            id: action.id,
			date: action.date,
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
    this.editCategory = function(category, cb){
		$http.post(config.api + '?token=' + token, {
			action: 'editCategory',
            id: category.id,
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
});



moneyApp.service('accountsServ', function($http, localStorageService){
    var token = localStorageService.get('token');
	this.getAccounts = function(cb){
        $http.get(config.api + '?action=getAccounts&token=' + token)
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
    }
	this.getAccount = function(id, cb){
        $http.get(config.api + '?action=getAccount&token=' + token + '&id=' + id)
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
    }
    this.editAccount = function(account, cb){
		$http.post(config.api + '?token=' + token, {
			action: 'editAccount',
            id: account.id,
            title: account.title,
            balance: account.balance,
            panel: account.panel
		})
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
	}
	this.delAccount = function(id, cb){
		$http.post(config.api + '?token=' + token, {
			action: 'delAccount',
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



moneyApp.service('budgetsServ', function($http, localStorageService){
    var token = localStorageService.get('token');
	this.getBudget = function(budget, cb){
        $http.get(config.api + '?action=getBudget&token=' + token + '&month=' + budget.month + '&year=' + budget.year)
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
    }
	this.getCategory = function(id, cb){
        $http.get(config.api + '?action=getBudgetCategory&token=' + token + '&id=' + id)
		.success(function(data){
            cb(data);
        })
        .error(function(error, status){
            cb('requestError');
        });
    }
    this.editCategory = function(category, cb){
		$http.post(config.api + '?token=' + token, {
			action: 'editBudgetCategory',
            id: category.id,
            month: category.month,
			year: category.year,
			category_id: category.category_id,
			sum: category.sum
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
			action: 'delBudgetCategory',
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
