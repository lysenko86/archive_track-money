moneyApp.service('messagesServices', function($timeout){
    var self = this;
    this.message = {
        status: '',
        class: '',
        text: ''
    }
    this.delay = 3000;
    this.showMessage = function(status, text){
        self.message.status = status;
        self.message.class = status == 'error' ? 'alert-danger' : 'alert-success';
        self.message.text = text;
        $timeout(function(){
            self.message.status = '';
            self.message.class = '';
            self.message.text = '';
        }, this.delay);
    }
});



moneyApp.service('usersServices', function($http){
    this.getUserByEmailPass = function(email, pass, cb){
        $http.post('server.php', {
            action: 'login',
            email: email,
            pass: pass
        }).success(function(data){
            cb(data);
        });
    }
	this.regUser = function(user, cb){
        $http.post('server.php', {
            action: 'reg',
            email: user.email,
            pass: user.pass,
			name: user.name,
			city: user.city
        }).success(function(data){
            cb(data);
        });
    }
});



moneyApp.service('categoriesServices', function($http){
    this.getCategories = function(uid, cb){
        $http.get('server.php?action=getCategories&uid=' + uid)
		.success(function(data){
            cb(data);
        });
    }
	this.addCategory = function(uid, type, title, cb){
		$http.post('server.php', {
			action: 'addCategory',
			uid: uid,
			type: type,
			title: title
		})
		.success(function(data){
            cb(data);
        });
	}
	this.delCategory = function(cid, cb){
        $http.get('server.php?action=delCategory&cid=' + cid)
		.success(function(data){
            cb(data);
        });
    }
});