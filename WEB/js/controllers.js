"use strict";



moneyApp.controller('menuCtrl', function($location, $scope, localStorageService){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		angular.element('nav.navbar li a:not(.dropdown-toggle)').click(function(){
			if (angular.element('nav.navbar .navbar-collapse.collapse').hasClass('in')){
				angular.element('nav.navbar .navbar-header button.navbar-toggle').click();
			}
		});
	}
	$scope.setActive = function(path){
		return ($location.path().substr(0, path.length) === path) ? 'active' : '';
	}

	this.init();
});



moneyApp.controller('homeCtrl', function($scope, messagesServ, localStorageService, usersServ){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		this.phrases = [
			{text:"Дешева рибка - погана юшка.", author:"Українське прислів'я"},
			{text:"Борги схожі на всяку іншу пастку: потрапити в них вельми легко, але вибратися досить важко.", author:"Джордж Бернард Шоу"},
			{text:"Якщо умієш щось, не роби цього безкоштовно.", author:"The Dark Knight"},
			{text:"Не в грошах щастя, а в покупках.", author:"Мерілін Монро"},
			{text:"Гроші не можуть змінити людей, вони можуть лише допомогти їм стати тими, ким вони є насправді.", author:"Сімпсони (The Simpsons)"},
			{text:"Накопичувати гроші – річ корисна, особливо якщо це вже зробили ваші батьки.", author:"Вінстон Черчилль"},
			{text:"Всім відомо, що за гроші можна купити туфлі, але не щастя, їжу, але не апетит, ліжко, але не сон, ліки, але не здоров'я, слуг, але не друзів, розваги, але не радість, вчителів, але не розум.", author:"Сократ"},
			{text:"Брак грошей компенсує надлишок смутку.", author:"Георгій Олександров"},
			{text:"Був час, коли гроші розлучалися з дурнем дуже скоро. Тепер для цього не обов’язково бути дурнем.", author:"Едлай Стівенсон"},
			{text:"Ви засліплені золотом, що виблискує в будинку багатих; ви, звичайно, бачите, що вони мають, але ви не бачите, чого їм бракує.", author:"Аврелій Августин"},
			{text:"Витрачай на один пенс менше, ніж заробляєш.", author:"Бенджамин Франклін"},
			{text:"Грошей на його банківському рахунку було мало, але рахунки у нього були у всіх банках.", author:"Валерій Афонченко"},
			{text:"Лінь є дочка багатства і мати бідності.", author:"Поль Декурсель"},
			{text:"Люди не хочуть бути багатими; люди хочуть бути багатше за інших.", author:"Джон Стюарт Мілль"},
			{text:"Мільйона багато – поки немає мільйона.", author:"Гарун Агацарський"},
			{text:"Найдорожчий скарб – втрачене.", author:"Олексій Нагель"},
			{text:"Краще голий та правдивий, нiж багатий та беззаконний.", author:"Григорій Сковорода"},
			{text:"Щоб заробити на життя, потрібно працювати. Але щоб розбагатіти, потрібно придумати щось інше.", author:"Альфонс КАРР"},
			{text:"Неважливо, скільки отримуєш в місяць, важливіше, скільки витрачаєш в день.", author:"Веселін Георгіев"},
			{text:"Поклопочися про пенс, а вже фунт поклопочеться про себе сам.", author:"Пилип Дормер Стенхоп Честерфілд"},
			{text:"Помилка скупих полягає в тому, що вони вважають золото і срібло благами, тоді як це тільки засоби для придбання благ.", author:"Франсуа де Ларошфуко"},
			{text:"Придбання грошей вимагає доблесть; збереження грошей вимагає розсудливості; витрата грошей вимагає мистецтва.", author:"Авербах Бертольд"},
			{text:"Гроші для розумних людей є засобом, для дурнів - метою.", author:"Адріан Декурсель"},
			{text:"Гроші потрібні навіть для того, щоби без них обходитись.", author:"Оноре де Бальзак"},
			{text:"Зневага до грошей буває нерідко,- особливо серед тих, у кого їх нема.", author:"Жорж Куртелін"},
			{text:"Не слід розмовляти про гроші з людьми, у яких їх набагато більше ніж у тебе, чи набагато менше.", author:"Кетрін Уайт Хорн"},
			{text:"Той, хто шукає мільйони, досить рідко їх знаходить, проте той, хто їх не шукає,- не знаходить ніколи!", author:"Оноре де Бальзак"},
			{text:"Той, хто часто набуває непотрібне, рано чи пізно розлучається з насущним.", author:"Бенджамін Франклін"},
			{text:"У моїх можливостях дати звіт за кожен мій мільйон, за винятком самого першого.", author:"Рокфеллер"},
			{text:"Працюйте так, немов гроші не мають для Вас жодного значення.",author:"Марк Твен"}
		];
		let index = Math.round(Math.random() * (this.phrases.length-1));
		$scope.phrase = this.phrases[index];
		usersServ.getCount(function(data){
			if (data == 'requestError'){
				messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
			}
			else{
				if (data.status == 'success'){
					$scope.countUsers = data.arr.count;
				}
				else{
					messagesServ.showMessages(data.status, data.msg);
				}
			}
		});
	}

	this.init();
});



moneyApp.controller('signinCtrl', function($location, $window, $scope, messagesServ, localStorageService, usersServ){
	this.init = function(){
		$scope.messages = messagesServ.messages;
		$scope.isAuth = localStorageService.get('token');
		if ($scope.isAuth){
			$location.url('home');
		}
		$scope.user = {
			email: '',
			password: ''
		};
		$scope.auth = {
			notConfirmed: false,
			email: ''
		};
	}
	$scope.signin = function(){
		if (!$scope.user.email || !$scope.user.password){
			$scope.auth.notConfirmed = false;
			$scope.auth.email = '';
			messagesServ.showMessages('error', 'Помилка! Поля "Email" та "Пароль" обов\'язкові для заповнення!');
		}
		else{
			usersServ.signin($scope.user, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					$scope.user.email = $scope.user.password = '';
					$scope.auth.notConfirmed = data.notConfirmed;
					$scope.auth.email = data.email;
					messagesServ.showMessages(data.status, data.msg, 2000, function(){
						if (data.status == 'success'){
							localStorageService.set('token', data.arr.token);
							$window.location.href = '/';
						}
					});
				}
            });
		}
	}
	$scope.sendConfirmMail = function(){
		usersServ.sendConfirmMail($scope.auth.email, function(data){
			if (data == 'requestError'){
				messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
			}
			else{
				$scope.auth.notConfirmed = false;
				$scope.auth.email = '';
				messagesServ.showMessages(data.status, data.msg);
			}
		});
	}

	this.init();
});



moneyApp.controller('signupCtrl', function($location, $scope, messagesServ, localStorageService, usersServ){
	this.init = function(){
		$scope.messages = messagesServ.messages;
		$scope.isAuth = localStorageService.get('token');
		if ($scope.isAuth){
			$location.url('home');
		}
		$scope.user = {
			email: '',
			password: '',
			agree: false
		};
	}
	$scope.signup = function(){
		if (!$scope.user.email || !$scope.user.password){
			messagesServ.showMessages('error', 'Помилка! Поля "Email" та "Пароль" обов\'язкові для заповнення!');
		}
		else if (!/^\S+@\S+$/.test($scope.user.email)){
			messagesServ.showMessages('error', 'Помилка! Значення поля "Email" має бути наступного формату: email@email.com!');
		}
		else if (!$scope.user.agree){
			messagesServ.showMessages('error', 'Помилка! Ви повинні прийняти умови користувацької угоди, повірте, це важливо, там не багато читати :)');
		}
		else{
			usersServ.signup($scope.user, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					$scope.user.email = $scope.user.password = $scope.user.agree = '';
					messagesServ.showMessages(data.status, data.msg, 6000, function(){
						if (data.status == 'success'){
							$location.url('home');
						}
					});
				}
			});
		}
	}

	this.init();
});



moneyApp.controller('logoutCtrl', function($location, $window, $scope, messagesServ, localStorageService, usersServ){
	this.init = function(){
		$scope.messages = messagesServ.messages;
		$scope.isAuth = localStorageService.get('token');
		if (!$scope.isAuth){
			$location.url('home');
		}
		else{
			usersServ.logout(function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					messagesServ.showMessages(data.status, data.msg, 2000, function(){
						if (data.status == 'success'){
							localStorageService.remove('token');
							$window.location.href = '/';
						}
					});
				}
			});
		}
	}

	this.init();
});



moneyApp.controller('confirmCtrl', function($location, $window, $scope, $routeParams, localStorageService, messagesServ, usersServ){
	this.init = function(){
		$scope.messages = messagesServ.messages;
		$scope.isAuth = localStorageService.get('token');
		if ($scope.isAuth){
			$location.url('home');
		}
		let confirm = $routeParams.confirm.split('.');
		usersServ.confirm(confirm, function(data){
			if (data == 'requestError'){
				messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
			}
			else{
				messagesServ.showMessages(data.status, data.msg, 2000, function(){
					if (data.status == 'success'){
						$location.url('home');
					}
				});
			}
		});
	}

	this.init();
});



moneyApp.controller('passwordCtrl', function($location, $window, $scope, $routeParams, localStorageService, messagesServ, usersServ){
	this.init = function(){
		$scope.messages = messagesServ.messages;
		$scope.isAuth = localStorageService.get('token');
		if ($scope.isAuth){
			$location.url('home');
		}
		$scope.email = ''
	}
	$scope.resetPassword = function(){
		if (!$scope.email){
			messagesServ.showMessages('error', 'Помилка! Поле "Email" обов\'язкове для заповнення!');
		}
		else{
			usersServ.sendPasswordMail($scope.email, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					if (data.status == 'success'){
						$scope.email = '';
					}
					messagesServ.showMessages(data.status, data.msg);
				}
            });
		}
	}

	this.init();
});



moneyApp.controller('resetCtrl', function($location, $window, $scope, $routeParams, localStorageService, messagesServ, usersServ){
	this.init = function(){
		$scope.messages = messagesServ.messages;
		$scope.isAuth = localStorageService.get('token');
		if ($scope.isAuth){
			$location.url('home');
		}
		let reset = $routeParams.password.split('.');
		usersServ.reset(reset, function(data){
			if (data == 'requestError'){
				messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
			}
			else{
				messagesServ.showMessages(data.status, data.msg, false, function(){
					if (data.status == 'success'){
						$location.url('home');
					}
				});
			}
		});
	}

	this.init();
});



moneyApp.controller('profileCtrl', function($location, $window, $scope, messagesServ, localStorageService, usersServ){
	this.init = function(){
		$scope.messages = messagesServ.messages;
		$scope.isAuth = localStorageService.get('token');
		if (!$scope.isAuth){
			$location.url('home');
		}
		$scope.email = '';
		$scope.chPassword = {
			password: '',
			newPassword: '',
			confirmPassword: ''
		};

		usersServ.getProfile(function(data){
			if (data == 'requestError'){
				messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
			}
			else{
				if (data.status == 'success'){
					$scope.email = data.arr.email;
					$scope.created = data.arr.created;
				}
				else{
					messagesServ.showMessages(data.status, data.msg);
				}
			}
		});
	}
	$scope.editPassword = function(){
		if (!$scope.chPassword.password || !$scope.chPassword.newPassword || !$scope.chPassword.confirmPassword){
			messagesServ.showMessages('error', 'Помилка! Поля "Актуальний пароль", "Новий пароль" та "Повтор нового паролю" обов\'язкові для заповнення!');
		}
		else if ($scope.chPassword.newPassword != $scope.chPassword.confirmPassword){
			messagesServ.showMessages('error', 'Помилка! Значення поля "Новий пароль" та "Повтор нового паролю" мають бути однаковими!');
		}
		else{
			usersServ.editPassword($scope.chPassword, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					if (data.status == 'success'){
						$scope.chPassword.password = $scope.chPassword.newPassword = $scope.chPassword.confirmPassword = '';
					}
					messagesServ.showMessages(data.status, data.msg);
				}
            });
		}
	}
	$scope.removeAccount = function(){
		if (confirm('Ви дійсно хочете видалити всю інформацію (транзакції, категорії, рахунки, бюджети) а також сам акаунт без можливості відновлення?')){
			usersServ.removeAccount(function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					messagesServ.showMessages(data.status, data.msg, false, function(){
						if (data.status == 'success'){
							localStorageService.remove('token');
							$window.location.href = '/';
						}
					});
				}
			});
		}
	}

	this.init();
});



moneyApp.controller('forumCtrl', function($location, $scope, $routeParams, messagesServ, localStorageService, forumServ){
	this.init = function(){
		$scope.messages = messagesServ.messages;
		$scope.isAuth = localStorageService.get('token');
		if (!$scope.isAuth){
			$location.url('home');
		}
		$scope.categories = {
			public: 'Паблік',
			bug: 'Помилки',
			feature: 'Ідеї',
			thank: 'Подяки',
			question: 'Питання',
			forAdmin: 'Адміну'
		};
		$scope.statuses = {
			created: 'Створено',
			viewed: 'Переглянуто',
			fixed: 'Вирішено',
			closed: 'Закрито'
		};
		$scope.post = {
			title: '',
			category: '',
			comment: ''
		};
		$scope.comment = '';
		$scope.posts = $scope.comments = [];
		$scope.fid = $routeParams.post;
		if (!$scope.fid){
			forumServ.getPosts($scope.posts.length, 20, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					if (data.status == 'success'){
						data.arr = data.arr ? data.arr : [];
						$scope.posts = data.arr;
					}
					else{
						messagesServ.showMessages(data.status, data.msg);
					}
				}
			});
		}
		else{
			forumServ.getPost($scope.fid, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					if (data.status == 'success'){
						$scope.post.title = data.arr.title;
						$scope.post.category = data.arr.category;
						$scope.post.status = data.arr.status;
						$scope.post.created = data.arr.created;
						$scope.post.updated = data.arr.updated;
						$scope.post.email = data.arr.email;
						$scope.post.email_upd = data.arr.email_upd;
						$scope.post.count = data.arr.count;
						$scope.comments = data.arr.comments;
					}
					else{
						messagesServ.showMessages(data.status, data.msg);
					}
				}
			});
		}
	}
	$scope.addPost = function(){
		if (!$scope.post.title || !$scope.post.category || !$scope.post.comment){
			messagesServ.showMessages('error', 'Помилка! Поля "Тема", "Категорія" та "Перший коментар" обов\'язкові для заповнення!');
		}
		else{
			forumServ.addPost($scope.post, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					if (data.status == 'success'){
						$scope.posts.push(data.arr);
						$scope.post.title = $scope.post.category = $scope.post.comment = '';
					}
					messagesServ.showMessages(data.status, data.msg);
				}
            });
		}
	}
	$scope.addComment = function(){
		if (!$scope.comment){
			messagesServ.showMessages('error', 'Помилка! Поле "Коментар" обов\'язкове для заповнення!');
		}
		else{
			$scope.fid = $routeParams.post;
			forumServ.addComment($scope.fid, $scope.comment, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					if (data.status == 'success'){
						$scope.comments.push(data.arr);
						$scope.post.count = $scope.comments.length;
						$scope.post.updated = data.arr.created;
						$scope.post.email_upd = data.arr.email;
						$scope.comment = '';
					}
					messagesServ.showMessages(data.status, data.msg);
				}
            });
		}
	}

	this.init();
});



moneyApp.controller('actionsCtrl', function($location, $scope, messagesServ, actionsServ, categoriesServ, accountsServ, localStorageService){
	this.init = function(){
		$scope.messages = messagesServ.messages;
		$scope.isAuth = localStorageService.get('token');
		if (!$scope.isAuth){
			$location.url('home');
		}
		let obj = new Date();
		let d = '0' + obj.getDate();
		let m = '0' + (obj.getMonth()+1);
		$scope.today = d.substr(d.length-2, 2) + '.' + m.substr(m.length-2, 2) + '.' + obj.getFullYear();
		$scope.action = {
			date: $scope.today,
			type: '',
			accountFrom_id: '',
			accountTo_id: '',
			category_id: '',
			sum: '',
			description: ''
		};
		$scope.actions = $scope.categories = $scope.accounts = [];
		$scope.formType = 'add';
		$scope.editID = '';
		$scope.types = {
			plus: 'Доходи',
			minus: 'Витрати',
			move: 'Переказ'
		};
		$scope.isShowMoreButton = true;
		categoriesServ.getCategories(function(data){
			if (data == 'requestError'){
				messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
			}
			else{
				if (data.status == 'success'){
					data.arr = data.arr ? data.arr : [];
					$scope.categories = data.arr;
				}
				else{
					messagesServ.showMessages(data.status, data.msg);
				}
			}
		});
		accountsServ.getAccounts(function(data){
			if (data == 'requestError'){
				messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
			}
			else{
				if (data.status == 'success'){
					data.arr = data.arr ? data.arr : [];
					$scope.accounts = data.arr;
				}
				else{
					messagesServ.showMessages(data.status, data.msg);
				}
			}
		});
		$scope.getActions();
	};
	$scope.getActions = function(data){
		actionsServ.getActions($scope.actions.length, 20, function(data){
			if (data == 'requestError'){
				messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
			}
			else{
				if (data.status == 'success'){
					data.arr = data.arr ? data.arr : [];
					$scope.actions = $scope.actions.concat(data.arr);
					if (!data.arr.length){
						$scope.isShowMoreButton = false;
					}
				}
				else{
					messagesServ.showMessages(data.status, data.msg);
				}
			}
		});
	}
	$scope.getAction = function(id){
		if (id == undefined){
			$scope.formType = 'add';
			$scope.action.date = $scope.today;
			$scope.action.type = $scope.action.accountFrom_id = $scope.action.accountTo_id = $scope.action.category_id = $scope.action.sum = $scope.action.description = $scope.editID = '';
		}
		else{
			$scope.editID = id;
			actionsServ.getAction(id, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					if (data.status == 'success'){
						data.arr.date = data.arr.date.substr(8,2) + '.' + data.arr.date.substr(5,2) + '.' + data.arr.date.substr(0,4);
						$scope.formType = 'edit';
						$scope.action.date = data.arr.date;
						$scope.action.type = data.arr.type;
						$scope.action.accountFrom_id = data.arr.accountFrom_id;
						$scope.action.accountTo_id = data.arr.accountTo_id;
						$scope.action.category_id = data.arr.category_id;
						$scope.action.sum = data.arr.sum;
						$scope.action.description = data.arr.description;
					}
					else{
						messagesServ.showMessages(data.status, data.msg);
					}
				}
			});
		}
	}
	$scope.addAction = function(){
		if (!$scope.action.type){
			messagesServ.showMessages('error', 'Помилка! Поле "Тип" обов\'язкове для заповнення!');
		}
		else if ($scope.action.type == 'move' && (!$scope.action.date || !$scope.action.accountFrom_id || !$scope.action.accountTo_id || !$scope.action.sum)){
			messagesServ.showMessages('error', 'Помилка! Поля "Дата", "Звідки", "Куди" та "Сума" обов\'язкові для заповнення!');
		}
		else if ($scope.action.type != 'move' && (!$scope.action.date || !$scope.action.accountFrom_id || !$scope.action.category_id || !$scope.action.sum)){
			messagesServ.showMessages('error', 'Помилка! Поля "Дата", "Рахунок", "Категорія" та "Сума" обов\'язкові для заповнення!');
		}
		else if (!/^\d{2}\.\d{2}\.\d{4}$/.test($scope.action.date)){
			messagesServ.showMessages('error', 'Помилка! Значення поля "Дата" має бути наступного формату: 01.01.2017!');
		}
		else if (!/^[\d\.]+$/.test($scope.action.sum)){
			messagesServ.showMessages('error', 'Помилка! Значення поля "Сума" має бути числовим!');
		}
		else{
			if ($scope.action.type == 'move'){
				$scope.action.category_id = '0';
			}
			else if ($scope.action.type != 'move'){
				$scope.action.accountTo_id = '0';
			}
			actionsServ.addAction($scope.action, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					if (data.status == 'success'){
						$scope.actions.push(data.arr);
						$scope.action.date = $scope.today;
						$scope.action.type = $scope.action.accountFrom_id = $scope.action.accountTo_id = $scope.action.category_id = $scope.action.sum = $scope.action.description = '';
					}
					messagesServ.showMessages(data.status, data.msg);
				}
            });
		}
	}
	$scope.editAction = function(){
		if (!$scope.action.type){
			messagesServ.showMessages('error', 'Помилка! Поле "Тип" обов\'язкове для заповнення!');
		}
		else if ($scope.action.type == 'move' && (!$scope.action.date || !$scope.action.accountFrom_id || !$scope.action.accountTo_id || !$scope.action.sum)){
			messagesServ.showMessages('error', 'Помилка! Поля "Дата", "Звідки", "Куди" та "Сума" обов\'язкові для заповнення!');
		}
		else if ($scope.action.type != 'move' && (!$scope.action.date || !$scope.action.accountFrom_id || !$scope.action.category_id || !$scope.action.sum)){
			messagesServ.showMessages('error', 'Помилка! Поля "Дата", "Рахунок", "Категорія" та "Сума" обов\'язкові для заповнення!');
		}
		else if (!/^\d{2}\.\d{2}\.\d{4}$/.test($scope.action.date)){
			messagesServ.showMessages('error', 'Помилка! Значення поля "Дата" має бути наступного формату: 01.01.2017!');
		}
		else if (!/^[\d\.]+$/.test($scope.action.sum)){
			messagesServ.showMessages('error', 'Помилка! Значення поля "Сума" має бути числовим!');
		}
		else{
			if ($scope.action.type == 'move'){
				$scope.action.category_id = '0';
			}
			else if ($scope.action.type != 'move'){
				$scope.action.accountTo_id = '0';
			}
			actionsServ.editAction($scope.editID, $scope.action, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					if (data.status == 'success'){
						$scope.formType = 'add';
						for (var i=0; i<$scope.actions.length; i++){
							if ($scope.actions[i].id == $scope.editID){
								$scope.actions[i] = data.arr;
							}
						}
						$scope.action.date = $scope.today;
						$scope.action.type = $scope.action.accountFrom_id = $scope.action.accountTo_id = $scope.action.category_id = $scope.action.sum = $scope.action.description = $scope.editID = '';
					}
					messagesServ.showMessages(data.status, data.msg);
				}
			});
		}
	}
	$scope.delAction = function(id){
		if (confirm('Ви точно хочете видалити цю транзакцію?')){
			actionsServ.delAction(id, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					if (data.status == 'success'){
						for (var i=0; i<$scope.actions.length; i++){
							if ($scope.actions[i].id == id) $scope.actions.splice(i, 1);
						}
					}
					messagesServ.showMessages(data.status, data.msg);
				}
			});
		}
	}

	this.init();
});



moneyApp.controller('categoriesCtrl', function($location, $scope, messagesServ, categoriesServ, localStorageService){
	this.init = function(){
		$scope.messages = messagesServ.messages;
		$scope.isAuth = localStorageService.get('token');
		if (!$scope.isAuth){
			$location.url('home');
		}
		$scope.category = {
			title: '',
			type: ''
		};
		$scope.categories = [];
		$scope.formType = 'add';
		$scope.editID = '';
		$scope.types = {
			plus: 'Доходи',
			minus: 'Витрати'
		};
		$scope.getCategories();
	}
	$scope.getCategories = function(){
		categoriesServ.getCategories(function(data){
			if (data == 'requestError'){
				messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
			}
			else{
				if (data.status == 'success'){
					data.arr = data.arr ? data.arr : [];
					$scope.categories = data.arr;
				}
				else{
					messagesServ.showMessages(data.status, data.msg);
				}
			}
		});
	}
	$scope.getCategory = function(id){
		if (id == undefined){
			$scope.formType = 'add';
			$scope.category.title = $scope.category.type = $scope.editID = '';
		}
		else{
			$scope.editID = id;
			categoriesServ.getCategory(id, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					if (data.status == 'success'){
						$scope.formType = 'edit';
						$scope.category.title = data.arr.title;
						$scope.category.type = data.arr.type;
					}
					else{
						messagesServ.showMessages(data.status, data.msg);
					}
				}
			});
		}
	}
	$scope.addCategory = function(){
		if (!$scope.category.title || !$scope.category.type){
			messagesServ.showMessages('error', 'Помилка! Поля "Назва" та "Тип" обов\'язкові для заповнення!');
		}
		else{
			categoriesServ.addCategory($scope.category, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					if (data.status == 'success'){
						$scope.categories.push(data.arr);
						$scope.category.title = $scope.category.type = '';
					}
					messagesServ.showMessages(data.status, data.msg);
				}
            });
		}
	}
	$scope.editCategory = function(){
		if (!$scope.category.title || !$scope.category.type){
			messagesServ.showMessages('error', 'Помилка! Поля "Назва" та "Тип" обов\'язкові для заповнення!');
		}
		else{
			categoriesServ.editCategory($scope.editID, $scope.category, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					if (data.status == 'success'){
						$scope.formType = 'add';
						for (var i=0; i<$scope.categories.length; i++){
							if ($scope.categories[i].id == $scope.editID){
								$scope.categories[i] = data.arr;
							}
						}
						$scope.category.title = $scope.category.type = $scope.editID = '';
					}
					messagesServ.showMessages(data.status, data.msg);
				}
			});
		}
	}
	$scope.delCategory = function(id){
		if (confirm('Ви точно хочете видалити цю категорію?')){
			categoriesServ.delCategory(id, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					if (data.status == 'success'){
						for (var i=0; i<$scope.categories.length; i++){
							if ($scope.categories[i].id == id) $scope.categories.splice(i, 1);
						}
					}
					messagesServ.showMessages(data.status, data.msg);
				}
			});
		}
	}

	this.init();
});



moneyApp.controller('accountsCtrl', function($location, $scope, messagesServ, accountsServ, localStorageService){
	this.init = function(){
		$scope.messages = messagesServ.messages;
		$scope.isAuth = localStorageService.get('token');
		if (!$scope.isAuth){
			$location.url('home');
		}
		$scope.account = {
			title: '',
			balance: ''
		};
		$scope.accounts = [];
		$scope.formType = 'add';
		$scope.editID = '';
		$scope.getAccounts();
	}
	$scope.getAccounts = function(){
		accountsServ.getAccounts(function(data){
			if (data == 'requestError'){
				messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
			}
			else{
				if (data.status == 'success'){
					data.arr = data.arr ? data.arr : [];
					$scope.accounts = data.arr;
				}
				else{
					messagesServ.showMessages(data.status, data.msg);
				}
			}
		});
	}
	$scope.getAccount = function(id){
		if (id == undefined){
			$scope.formType = 'add';
			$scope.account.title = $scope.account.balance = $scope.editID = '';
		}
		else{
			$scope.editID = id;
			accountsServ.getAccount(id, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					if (data.status == 'success'){
						$scope.formType = 'edit';
						$scope.account.title = data.arr.title;
						$scope.account.balance = data.arr.balance;
					}
					else{
						messagesServ.showMessages(data.status, data.msg);
					}
				}
			});
		}
	}
	$scope.addAccount = function(){
		if (!$scope.account.title || $scope.account.balance == ''){
			messagesServ.showMessages('error', 'Помилка! Поля "Назва" та "Баланс" обов\'язкові для заповнення!');
		}
		else if (!/^[\-\+\d\.]+$/.test($scope.account.balance)){
			messagesServ.showMessages('error', 'Помилка! Значення поля "Баланс" має бути числовим!');
		}
		else{
			accountsServ.addAccount($scope.account, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					if (data.status == 'success'){
						$scope.accounts.push(data.arr);
						$scope.account.title = $scope.account.balance = '';
					}
					messagesServ.showMessages(data.status, data.msg);
				}
            });
		}
	}
	$scope.editAccount = function(){
		if (!$scope.account.title || $scope.account.balance == ''){
			messagesServ.showMessages('error', 'Помилка! Поля "Назва" та "Баланс" обов\'язкові для заповнення!');
		}
		else if (!/^[\-\+\d\.]+$/.test($scope.account.balance)){
			messagesServ.showMessages('error', 'Помилка! Значення поля "Баланс" має бути числовим!');
		}
		else{
			accountsServ.editAccount($scope.editID, $scope.account, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					if (data.status == 'success'){
						$scope.formType = 'add';
						for (var i=0; i<$scope.accounts.length; i++){
							if ($scope.accounts[i].id == $scope.editID){
								$scope.accounts[i] = data.arr;
							}
						}
						$scope.account.title = $scope.account.balance = $scope.editID = '';
					}
					messagesServ.showMessages(data.status, data.msg);
				}
			});
		}
	}
	$scope.delAccount = function(id){
		if (confirm('Ви точно хочете видалити цей рахунок?')){
			accountsServ.delAccount(id, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					if (data.status == 'success'){
						for (var i=0; i<$scope.accounts.length; i++){
							if ($scope.accounts[i].id == id) $scope.accounts.splice(i, 1);
						}
					}
					messagesServ.showMessages(data.status, data.msg);
				}
			});
		}
	}

	this.init();
});



moneyApp.controller('budgetsCtrl', function($location, $scope, messagesServ, budgetsServ, categoriesServ, localStorageService){
	this.init = function(){
		$scope.messages = messagesServ.messages;
		$scope.isAuth = localStorageService.get('token');
		if (!$scope.isAuth){
			$location.url('home');
		}
		let obj = new Date();
		$scope.budget = {
			month: obj.getMonth()+1+'',
			year: obj.getFullYear(),
			categories: [],
			plusPlan: '',
			plusFact: '',
	        plusRest: '',
			minusPlan: '',
			minusFact: '',
	        minusRest: '',
	        balancePlan: '',
	        balanceFact: ''
		};
		$scope.category = {
			month: '',
			year: '',
			category_id: '',
			sum: ''
		};
		$scope.categories = [];
		$scope.formType = 'add';
		$scope.editID = '';
		$scope.mathAbs = window.Math.abs;
		categoriesServ.getCategories(function(data){
			if (data == 'requestError'){
				messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
			}
			else{
				if (data.status == 'success'){
					data.arr = data.arr ? data.arr : [];
					$scope.categories = data.arr;
				}
				else{
					messagesServ.showMessages(data.status, data.msg);
				}
			}
		});
		$scope.getBudget();
	}
	$scope.getBudget = function(){
		if (!$scope.budget.month || !$scope.budget.year){
			messagesServ.showMessages('error', 'Помилка! Поля "Місяць" та "Рік" обов\'язкові для заповнення!');
		}
		else if (!/^\d{4}$/.test($scope.budget.year)){
			messagesServ.showMessages('error', 'Помилка! Значення поля "Рік" має бути наступного формату: 2017!');
		}
		else{
			budgetsServ.getBudget($scope.budget, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					if (data.status == 'success'){
						$scope.budget.categories = data.arr;
						$scope.budget.plusPlan = $scope.budget.plusFact = $scope.budget.plusRest = $scope.budget.minusPlan = $scope.budget.minusFact = $scope.budget.minusRest = $scope.budget.balancePlan = $scope.budget.balanceFact = '';
						for (var i=0; i<$scope.budget.categories.length; i++){
							if ($scope.budget.categories[i].type == 'plus'){
								$scope.budget.plusPlan = $scope.budget.plusPlan*1 + $scope.budget.categories[i].plan*1;
								$scope.budget.plusFact = $scope.budget.plusFact*1 + $scope.budget.categories[i].fact*1;
							}
							else{
								$scope.budget.minusPlan = $scope.budget.minusPlan*1 + $scope.budget.categories[i].plan*1;
								$scope.budget.minusFact = $scope.budget.minusFact*1 + $scope.budget.categories[i].fact*1;
							}
						}
						$scope.budget.plusRest = $scope.budget.plusPlan - $scope.budget.plusFact;
				        $scope.budget.minusRest = $scope.budget.minusPlan - $scope.budget.minusFact;
						$scope.budget.balancePlan = $scope.budget.plusPlan - $scope.budget.minusPlan;
				        $scope.budget.balanceFact = $scope.budget.plusFact - $scope.budget.minusFact;
					}
					else{
						messagesServ.showMessages(data.status, data.msg);
					}
				}
			});
		}
	}
	$scope.getCategory = function(id){
		if (id == undefined){
			$scope.formType = 'add';
			$scope.category.month = $scope.category.year = $scope.category.category_id = $scope.category.sum = $scope.editID = '';
		}
		else{
			$scope.editID = id;
			budgetsServ.getCategory(id, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					if (data.status == 'success'){
						$scope.formType = 'edit';
						$scope.category.month = data.arr.month;
						$scope.category.year = data.arr.year;
						$scope.category.category_id = data.arr.category_id;
						$scope.category.sum = data.arr.sum;
					}
					else{
						messagesServ.showMessages(data.status, data.msg);
					}
				}
			});
		}
	}
	$scope.addCategory = function(){
		if (!$scope.category.month || !$scope.category.year || !$scope.category.category_id || !$scope.category.sum){
			messagesServ.showMessages('error', 'Помилка! Поля "Місяць", "Рік", "Категорія" та "Сума" обов\'язкові для заповнення!');
		}
		else if (!/^\d{4}$/.test($scope.category.year)){
			messagesServ.showMessages('error', 'Помилка! Значення поля "Рік" має бути наступного формату: 2017!');
		}
		else if (!/^[\d\.]+$/.test($scope.category.sum)){
			messagesServ.showMessages('error', 'Помилка! Значення поля "Сума" має бути числовим!');
		}
		else{
			budgetsServ.addCategory($scope.category, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					if (data.status == 'success'){
						$scope.category.month = $scope.category.year = $scope.category.category_id = $scope.category.sum = '';
					}
					messagesServ.showMessages(data.status, data.msg);
				}
            });
		}
	}
	$scope.editCategory = function(){
		if (!$scope.category.month || !$scope.category.year || !$scope.category.category_id || !$scope.category.sum){
			messagesServ.showMessages('error', 'Помилка! Поля "Місяць", "Рік", "Категорія" та "Сума" обов\'язкові для заповнення!');
		}
		else if (!/^\d{4}$/.test($scope.category.year)){
			messagesServ.showMessages('error', 'Помилка! Значення поля "Рік" має бути наступного формату: 2017!');
		}
		else if (!/^[\d\.]+$/.test($scope.category.sum)){
			messagesServ.showMessages('error', 'Помилка! Значення поля "Сума" має бути числовим!');
		}
		else{
			budgetsServ.editCategory($scope.editID, $scope.category, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					if (data.status == 'success'){
						$scope.formType = 'add';
						for (var i=0; i<$scope.budget.categories.length; i++){
							if ($scope.budget.categories[i].id == $scope.editID){
								$scope.budget.categories[i] = data.arr;
							}
						}
						$scope.category.month = $scope.category.year = $scope.category.category_id = $scope.category.sum = $scope.editID = '';
					}
					messagesServ.showMessages(data.status, data.msg);
				}
			});
		}
	}
	$scope.delCategory = function(id){
		if (confirm('Ви точно хочете видалити цю категорію?')){
			budgetsServ.delCategory(id, function(data){
				if (data == 'requestError'){
					messagesServ.showMessages('error', 'Помилка! Не вдалося з\'єднатися з сервером, можливо проблема з підключенням до мережі Інтернет!', 6000);
				}
				else{
					if (data.status == 'success'){
						for (var i=0; i<$scope.budget.categories.length; i++){
							if ($scope.budget.categories[i].id == id) $scope.budget.categories.splice(i, 1);
						}
					}
					messagesServ.showMessages(data.status, data.msg);
				}
			});
		}
	}

	this.init();
});
