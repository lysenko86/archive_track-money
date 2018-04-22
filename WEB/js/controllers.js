"use strict";



moneyApp.controller('menuCtrl', function($location, $scope, localStorageService, accountsServ){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		accountsServ.getAccountsPanel();
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
		this.phrases  = [
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
		let index     = Math.round(Math.random() * (this.phrases.length-1));
		$scope.phrase = this.phrases[index];
		usersServ.getCount(function(data){
			if (data.status == 'success'){
				$scope.countUsers = data.arr.count;
			}
			else{
				messagesServ.showMessages(data.status, data.msg);
			}
		});
	}

	this.init();
});



moneyApp.controller('signinCtrl', function($location, $window, $scope, messagesServ, localStorageService, usersServ){
	this.init = function(){
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
			$scope.auth.email        = '';
			messagesServ.showMessages('error', 'Помилка! Поля "Email" та "Пароль" обов\'язкові для заповнення!');
		}
		else{
			usersServ.signin($scope.user, function(data){
				$scope.user.password = '';
				$scope.auth.notConfirmed = data.notConfirmed;
				$scope.auth.email        = data.email;
				if (data.status == 'success'){
					localStorageService.set('token', data.arr.token);
					$window.location.href = '/';
				}
				else{
					messagesServ.showMessages(data.status, data.msg);
				}
            });
		}
	}
	$scope.sendConfirmMail = function(){
		usersServ.sendConfirmMail($scope.auth.email, function(data){
			$scope.auth.notConfirmed = false;
			$scope.auth.email        = '';
			messagesServ.showMessages(data.status, data.msg);
		});
	}

	this.init();
});



moneyApp.controller('signupCtrl', function($location, $scope, messagesServ, localStorageService, usersServ){
	this.init = function(){
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
				$scope.user.email = $scope.user.password = $scope.user.agree = '';
				messagesServ.showMessages(data.status, data.msg, 6000, function(){
					if (data.status == 'success'){
						$location.url('home');
					}
				});
			});
		}
	}

	this.init();
});



moneyApp.controller('logoutCtrl', function($location, $window, $scope, messagesServ, localStorageService, usersServ){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		if (!$scope.isAuth){
			$location.url('home');
		}
		else{
			usersServ.logout(function(data){
				if (data.status == 'success'){
					localStorageService.remove('token');
					$window.location.href = '/';
				}
				else{
					messagesServ.showMessages(data.status, data.msg);
				}
			});
		}
	}

	this.init();
});



moneyApp.controller('confirmCtrl', function($location, $window, $scope, $routeParams, localStorageService, messagesServ, usersServ){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		if ($scope.isAuth){
			$location.url('home');
		}
		let confirm = $routeParams.confirm.split('.');
		usersServ.confirm(confirm, function(data){
			messagesServ.showMessages(data.status, data.msg, 2000, function(){
				if (data.status == 'success'){
					$location.url('home');
				}
			});
		});
	}

	this.init();
});



moneyApp.controller('passwordCtrl', function($location, $window, $scope, $routeParams, localStorageService, messagesServ, usersServ){
	this.init = function(){
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
				if (data.status == 'success'){
					$scope.email = '';
				}
				messagesServ.showMessages(data.status, data.msg);
            });
		}
	}

	this.init();
});



moneyApp.controller('resetCtrl', function($location, $window, $scope, $routeParams, localStorageService, messagesServ, usersServ){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		if ($scope.isAuth){
			$location.url('home');
		}
		let reset = $routeParams.password.split('.');
		usersServ.reset(reset, function(data){
			messagesServ.showMessages(data.status, data.msg, false, function(){
				if (data.status == 'success'){
					$location.url('home');
				}
			});
		});
	}

	this.init();
});



moneyApp.controller('profileCtrl', function($location, $window, $scope, messagesServ, localStorageService, usersServ){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		if (!$scope.isAuth){
			$location.url('home');
		}
		$scope.email      = '';
		$scope.chPassword = {
			password: '',
			newPassword: '',
			confirmPassword: ''
		};

		usersServ.getProfile(function(data){
			if (data.status == 'success'){
				$scope.email   = data.arr.email;
				$scope.created = data.arr.created;
			}
			else{
				messagesServ.showMessages(data.status, data.msg);
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
				if (data.status == 'success'){
					$scope.chPassword.password = $scope.chPassword.newPassword = $scope.chPassword.confirmPassword = '';
				}
				messagesServ.showMessages(data.status, data.msg);
            });
		}
	}
	$scope.removeAccount = function(){
		if (confirm('Ви дійсно хочете видалити всю інформацію (транзакції, категорії, рахунки, бюджети) а також сам акаунт без можливості відновлення?')){
			usersServ.removeAccount(function(data){
				messagesServ.showMessages(data.status, data.msg, false, function(){
					if (data.status == 'success'){
						localStorageService.remove('token');
						$window.location.href = '/';
					}
				});
			});
		}
	}

	this.init();
});



moneyApp.controller('forumCtrl', function($location, $scope, $routeParams, messagesServ, localStorageService, forumServ){
	this.init = function(){
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
			fixed: 'Виправлено',
			closed: 'Закрито'
		};
		$scope.post = {
			title: '',
			category: '',
			comment: ''
		};
		$scope.comment     = '';
		$scope.posts       = $scope.comments = [];
		$scope.fid         = $routeParams.post;
		$scope.isAdmin     = false;
		$scope.formIsShown = false;
		angular.element(document).find('#popupEditForm').on('hidden.bs.modal', function(){
			$scope.formIsShown = false;
		});
		if (!$scope.fid){
			forumServ.getPosts($scope.posts.length, 20, function(data){
				if (data.status == 'success'){
					data.arr       = data.arr ? data.arr : [];
					$scope.posts   = data.arr;
					$scope.isAdmin = data.isAdmin;
				}
				else{
					messagesServ.showMessages(data.status, data.msg);
				}
			});
		}
		else{
			forumServ.getPost($scope.fid, function(data){
				if (data.status == 'success'){
					$scope.post.id        = data.arr.id;
					$scope.post.title     = data.arr.title;
					$scope.post.category  = data.arr.category;
					$scope.post.status    = data.arr.status;
					$scope.post.created   = data.arr.created;
					$scope.post.updated   = data.arr.updated;
					$scope.post.email     = data.arr.email;
					$scope.post.admin     = data.arr.admin;
					$scope.post.email_upd = data.arr.email_upd;
					$scope.post.admin_upd = data.arr.admin_upd;
					$scope.post.count     = data.arr.count;
					$scope.comments       = data.arr.comments;
					$scope.isAdmin        = data.isAdmin;
				}
				else{
					messagesServ.showMessages(data.status, data.msg);
				}
			});
		}
	}
	$scope.setFormIsShown = function(){
		$scope.formIsShown = true;
	}
	$scope.addPost = function(){
		if (!$scope.post.title || !$scope.post.category || !$scope.post.comment){
			messagesServ.showMessages('error', 'Помилка! Поля "Тема", "Категорія" та "Перший коментар" обов\'язкові для заповнення!');
		}
		else{
			forumServ.addPost($scope.post, function(data){
				if (data.status == 'success'){
					$scope.posts.unshift(data.arr);
					$scope.post.title  = $scope.post.category = $scope.post.comment = '';
					angular.element(document).find('#popupEditForm').modal('hide');
					$scope.formIsShown = false;
				}
				messagesServ.showMessages(data.status, data.msg);
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
				if (data.status == 'success'){
					$scope.comments.push(data.arr);
					$scope.post.count     = $scope.comments.length;
					$scope.post.updated   = data.arr.created;
					$scope.post.email_upd = data.arr.email;
					$scope.comment        = '';
					angular.element(document).find('#popupEditForm').modal('hide');
					$scope.formIsShown    = false;
				}
				messagesServ.showMessages(data.status, data.msg);
            });
		}
	}
	$scope.setPostStatus = function(id, status){
		forumServ.setPostStatus(id, status, function(data){
			if (data.status == 'success'){
				$scope.post.status = data.arr.status;
			}
			else{
				messagesServ.showMessages(data.status, data.msg);
			}
        });
	}

	this.init();
});



moneyApp.controller('actionsCtrl', function($location, $scope, messagesServ, actionsServ, categoriesServ, accountsServ, printServ, localStorageService){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		if (!$scope.isAuth){
			$location.url('home');
		}
		$scope.action = {
			id: false,
			date: $scope.getToday(),
			type: '',
			accountFrom_id: '',
			accountTo_id: '',
			category_id: '',
			sum: '',
			description: ''
		};
		$scope.actions = $scope.categories = $scope.accounts = [];
		$scope.types   = {
			plus: 'Доходи',
			minus: 'Витрати',
			move: 'Переказ'
		};
		$scope.isShowMoreButton = true;
		$scope.formIsShown      = false;
		angular.element(document).find('#popupEditForm').on('hidden.bs.modal', function(){
			$scope.formIsShown = false;
		});
		$scope.printMode = false;
		categoriesServ.getCategories(function(data){
			if (data.status == 'success'){
				data.arr          = data.arr ? data.arr : [];
				$scope.categories = data.arr;
			}
			else{
				messagesServ.showMessages(data.status, data.msg);
			}
		});
		accountsServ.getAccounts(function(data){
			if (data.status == 'success'){
				data.arr        = data.arr ? data.arr : [];
				$scope.accounts = data.arr;
			}
			else{
				messagesServ.showMessages(data.status, data.msg);
			}
		});
		$scope.getActions();
		$.fn.datepicker.dates['ua'] = {
    		days: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота", "Неділя"],
    		daysShort: ["Нед", "Пон", "Вів", "Сер", "Чет", "П'я", "Суб", "Нед"],
			daysMin: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"],
    		months: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
    		monthsShort: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"],
    		today: "Сьогодні"
		};
		$('#editForm input#date').datepicker({
			format: "dd.mm.yyyy",
			todayHighlight: true,
			autoclose: true,
			language: 'ua',
			weekStart: 1
		});
	};
	$scope.getToday = function(){
		let obj = new Date();
		let d = '0' + obj.getDate();
		let m = '0' + (obj.getMonth()+1);
		return d.substr(d.length-2, 2) + '.' + m.substr(m.length-2, 2) + '.' + obj.getFullYear();
	}
	$scope.dateToWEB = function(date){
		return date.substr(8,2) + '.' + date.substr(5,2) + '.' + date.substr(0,4);
	}
	$scope.dateToAPI = function(date){
		return date.substr(6,4) + '-' + date.substr(3,2) + '-' + date.substr(0,2);
	}
	$scope.parseSum = function(sum){
        var result = 0;
        if (!/^[\d\.\+\-]+$/.test(sum)){
            result = NaN;
        }
        if (result === 0){
            var number = '';
            for (let i=0; i<sum.length; i++){
                if (number && (sum[i] == '+' || sum[i] == '-')){
                    result += parseInt(number);
                    number = '';
                }
                number += sum[i];
            }
            result += parseInt(number);
        }
        return result != 0 ? result : NaN;
    }
	$scope.getActions = function(data){
		actionsServ.getActions($scope.actions.length, 20, function(data){
			if (data.status == 'success'){
				data.arr       = data.arr ? data.arr : [];
				$scope.actions = $scope.actions.concat(data.arr);
				if (!data.arr.length){
					$scope.isShowMoreButton = false;
				}
			}
			else{
				messagesServ.showMessages(data.status, data.msg);
			}
		});
	}
	$scope.getAction = function(id){
		$scope.formIsShown = true;
		if (!id){
			$scope.action.id   = false;
			$scope.action.date = $scope.getToday();
			$scope.action.type = $scope.action.accountFrom_id = $scope.action.accountTo_id = $scope.action.category_id = $scope.action.sum = $scope.action.description = '';
		}
		else{
			actionsServ.getAction(id, function(data){
				if (data.status == 'success'){
					$scope.action.id             = data.arr.id;
					$scope.action.date           = $scope.dateToWEB(data.arr.date);
					$scope.action.type           = data.arr.type;
					$scope.action.accountFrom_id = data.arr.accountFrom_id;
					$scope.action.accountTo_id   = data.arr.accountTo_id;
					$scope.action.category_id    = data.arr.category_id;
					$scope.action.sum            = data.arr.sum;
					$scope.action.description    = data.arr.description;
				}
				else{
					messagesServ.showMessages(data.status, data.msg);
				}
			});
		}
	}
	$scope.editAction = function(){
		if (!$scope.action.type){
			messagesServ.showMessages('error', 'Помилка! Поле "Тип" обов\'язкове для заповнення!');
		}
		else if ($scope.action.type == 'move' && (!$scope.action.date || !$scope.action.accountFrom_id || !$scope.action.accountTo_id)){
			messagesServ.showMessages('error', 'Помилка! Поля "Дата", "Звідки" та "Куди" обов\'язкові для заповнення!');
		}
		else if ($scope.action.type != 'move' && (!$scope.action.date || !$scope.action.accountFrom_id || !$scope.action.category_id)){
			messagesServ.showMessages('error', 'Помилка! Поля "Дата", "Рахунок" та "Категорія" обов\'язкові для заповнення!');
		}
		else if (!/^\d{2}\.\d{2}\.\d{4}$/.test($scope.action.date)){
			messagesServ.showMessages('error', 'Помилка! Значення поля "Дата" має бути наступного формату: дд.мм.рррр!');
		}
		else if (Number.isNaN($scope.parseSum($scope.action.sum))){
			messagesServ.showMessages('error', 'Помилка! Значення поля "Сума" має бути числовим і не нуль!');
		}
		else{
			$scope.action.sum = $scope.parseSum($scope.action.sum);
			if ($scope.action.type == 'move'){
				$scope.action.category_id = '0';
			}
			else if ($scope.action.type != 'move'){
				$scope.action.accountTo_id = '0';
			}
			$scope.action.date = $scope.dateToAPI($scope.action.date);
			actionsServ.editAction($scope.action, function(data){
				if (data.status == 'success'){
					data.arr.date = $scope.dateToWEB(data.arr.date);
					if ($scope.action.id){     // edit transaction
						for (var i=0; i<$scope.actions.length; i++){
							if ($scope.actions[i].id == $scope.action.id){
								$scope.actions[i] = data.arr;
							}
						}
					}
					else{     // add transaction
						$scope.actions.unshift(data.arr);
					}
					accountsServ.getAccountsPanel();
					angular.element(document).find('#popupEditForm').modal('hide');
					$scope.formIsShown = false;
				}
				else if(data.status == 'error'){
					$scope.action.date = $scope.dateToWEB($scope.action.date);
				}
				messagesServ.showMessages(data.status, data.msg);
            });
		}
	}
	$scope.delAction = function(id){
		if (confirm('Ви точно хочете видалити цю транзакцію?')){
			actionsServ.delAction(id, function(data){
				if (data.status == 'success'){
					for (var i=0; i<$scope.actions.length; i++){
						if ($scope.actions[i].id == id){
							$scope.actions.splice(i, 1);
						}
					}
					accountsServ.getAccountsPanel();
					$scope.formIsShown = false;
				}
				messagesServ.showMessages(data.status, data.msg);
			});
		}
	}
	$scope.togglePrintMode = function(){
		printServ.togglePrintMode();
	}

	this.init();
});



moneyApp.controller('categoriesCtrl', function($location, $scope, messagesServ, categoriesServ, localStorageService){
	this.init = function(){
		$scope.isAuth   = localStorageService.get('token');
		if (!$scope.isAuth){
			$location.url('home');
		}
		$scope.category = {
			id:    false,
			title: '',
			type:  '',
			cat: ''
		};
		$scope.categories = [];
		$scope.types = {
			plus: 'Доходи',
			minus: 'Витрати'
		};
		$scope.cats = {
			need: 'Обов\'язкові витрати',
			want: 'Не обов\'язкові витрати',
			save: 'Збережені кошти'
		};
		$scope.getCategories();
		$scope.formIsShown = false;
		angular.element(document).find('#popupEditForm').on('hidden.bs.modal', function(){
			$scope.formIsShown = false;
		});
	}
	$scope.getCategories = function(){
		categoriesServ.getCategories(function(data){
			if (data.status == 'success'){
				data.arr          = data.arr ? data.arr : [];
				$scope.categories = data.arr;
			}
			else{
				messagesServ.showMessages(data.status, data.msg);
			}
		});
	}
	$scope.getCategory = function(id){
		$scope.formIsShown = true;
		if (!id){
			$scope.category.id = false;
			$scope.category.title = $scope.category.type = '';
		}
		else{
			categoriesServ.getCategory(id, function(data){
				if (data.status == 'success'){
					$scope.category.id    = data.arr.id;
					$scope.category.title = data.arr.title;
					$scope.category.type  = data.arr.type;
					$scope.category.cat   = data.arr.cat;
				}
				else{
					messagesServ.showMessages(data.status, data.msg);
				}
			});
		}
	}
	$scope.editCategory = function(){
		if (!$scope.category.title || !$scope.category.type){
			messagesServ.showMessages('error', 'Помилка! Поля "Назва" та "Тип" обов\'язкові для заповнення!');
		}
		else if($scope.category.type == 'minus' && !$scope.category.cat){
			messagesServ.showMessages('error', 'Помилка! Поле "Категорія" обов\'язкове для заповнення!');
		}
		else{
			categoriesServ.editCategory($scope.category, function(data){
				if (data.status == 'success'){
					if ($scope.category.id){     // edit category
						for (var i=0; i<$scope.categories.length; i++){
							if ($scope.categories[i].id == $scope.category.id){
								$scope.categories[i] = data.arr;
							}
						}
					}
					else{     // add category
						if (data.arr.type == 'plus'){
							$scope.categories.unshift(data.arr);
						}
						else{
							$scope.categories.push(data.arr);
						}
					}
					angular.element(document).find('#popupEditForm').modal('hide');
					$scope.formIsShown = false;
				}
				messagesServ.showMessages(data.status, data.msg);
            });
		}
	}
	$scope.delCategory = function(id){
		if (confirm('Ви точно хочете видалити цю категорію?')){
			categoriesServ.delCategory(id, function(data){
				if (data.status == 'success'){
					for (var i=0; i<$scope.categories.length; i++){
						if ($scope.categories[i].id == id) $scope.categories.splice(i, 1);
					}
				}
				$scope.formIsShown = false;
				messagesServ.showMessages(data.status, data.msg);
			});
		}
	}

	this.init();
});



moneyApp.controller('accountsCtrl', function($location, $scope, messagesServ, accountsServ, localStorageService){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		if (!$scope.isAuth){
			$location.url('home');
		}
		$scope.account = {
			id: false,
			title: '',
			balance: '',
			panel: false
		};
		$scope.accounts = [];
		$scope.getAccounts();
		$scope.formIsShown = false;
		angular.element(document).find('#popupEditForm').on('hidden.bs.modal', function(){
			$scope.formIsShown = false;
		});
	}
	$scope.getAccounts = function(){
		accountsServ.getAccounts(function(data){
			if (data.status == 'success'){
				data.arr = data.arr ? data.arr : [];
				$scope.accounts = data.arr;
			}
			else{
				messagesServ.showMessages(data.status, data.msg);
			}
		});
	}
	$scope.getAccount = function(id){
		$scope.formIsShown = true;
		if (!id){
			$scope.account.id    = false;
			$scope.account.title = $scope.account.balance = '';
		}
		else{
			accountsServ.getAccount(id, function(data){
				if (data.status == 'success'){
					$scope.account.id      = data.arr.id;
					$scope.account.title   = data.arr.title;
					$scope.account.balance = data.arr.balance;
					$scope.account.panel   = data.arr.panel == '1' ? true : false;
				}
				else{
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
			$scope.account.panel = $scope.account.panel ? '1' : '0';
			accountsServ.editAccount($scope.account, function(data){
				if (data.status == 'success'){
					if ($scope.account.id){     // edit account
						for (var i=0; i<$scope.accounts.length; i++){
							if ($scope.accounts[i].id == $scope.account.id){
								$scope.accounts[i] = data.arr;
							}
						}
					}
					else{     // add account
						$scope.accounts.push(data.arr);
					}
					accountsServ.getAccountsPanel();
					angular.element(document).find('#popupEditForm').modal('hide');
					$scope.formIsShown = false;
				}
				messagesServ.showMessages(data.status, data.msg);
            });
		}
	}
	$scope.delAccount = function(id){
		if (confirm('Ви точно хочете видалити цей рахунок?')){
			accountsServ.delAccount(id, function(data){
				if (data.status == 'success'){
					for (var i=0; i<$scope.accounts.length; i++){
						if ($scope.accounts[i].id == id){
							$scope.accounts.splice(i, 1);
						}
					}
					accountsServ.getAccountsPanel();
				}
				messagesServ.showMessages(data.status, data.msg);
			});
		}
	}

	this.init();
});



moneyApp.controller('budgetsCtrl', function($location, $scope, messagesServ, budgetsServ, categoriesServ, printServ, localStorageService){
	this.init = function(){
		$scope.isAuth = localStorageService.get('token');
		if (!$scope.isAuth){
			$location.url('home');
		};
		$scope.cats = {
			need: 'Обов\'язкові витрати',
			want: 'Не обов\'язкові витрати',
			save: 'Збережені кошти'
		};
		$scope.catPercent = 0;
		let obj        = new Date();
		var activeYear = obj.getFullYear();
		$scope.years   = [activeYear-1, activeYear, activeYear+1];
		$scope.months  = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
		$scope.budget  = {
			month: obj.getMonth()+1,
			year: activeYear,
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
			id: false,
			month: '',
			year: '',
			category_id: '',
			sum: ''
		};
		$scope.categories  = [];
		$scope.formIsShown = false;
		$scope.mathAbs     = window.Math.abs;
		angular.element(document).find('#popupEditForm').on('hidden.bs.modal', function(){
			$scope.formIsShown = false;
		});

		categoriesServ.getCategories(function(data){
			if (data.status == 'success'){
				data.arr = data.arr ? data.arr : [];
				$scope.categories = data.arr;
			}
			else{
				messagesServ.showMessages(data.status, data.msg);
			}
		});
		$scope.getBudget($scope.budget.year, $scope.budget.month);
	}
	$scope.calculateTotalSum = function(){
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
		$scope.budget.plusRest    = $scope.budget.plusPlan - $scope.budget.plusFact;
		$scope.budget.minusRest   = $scope.budget.minusPlan - $scope.budget.minusFact;
		$scope.budget.balancePlan = $scope.budget.plusPlan - $scope.budget.minusPlan;
		$scope.budget.balanceFact = $scope.budget.plusFact - $scope.budget.minusFact;
	}
	$scope.getBudget = function(year, month){
		$scope.budget.year  = year;
		$scope.budget.month = month;
		budgetsServ.getBudget($scope.budget, function(data){
			if (data.status == 'success'){
				$scope.budget.categories = data.arr;
				$scope.calculateTotalSum();
			}
			else{
				messagesServ.showMessages(data.status, data.msg);
			}
		});
	}
	$scope.getCategory = function(id){
		$scope.formIsShown = true;
		if (!id){
			$scope.category.id    = false;
			$scope.category.month = $scope.category.year = $scope.category.category_id = $scope.category.sum = '';
		}
		else{
			budgetsServ.getCategory(id, function(data){
				if (data.status == 'success'){
					$scope.category.id          = data.arr.id;
					$scope.category.month       = data.arr.month;
					$scope.category.year        = data.arr.year;
					$scope.category.category_id = data.arr.category_id;
					$scope.category.sum         = data.arr.sum;
				}
				else{
					messagesServ.showMessages(data.status, data.msg);
				}
			});
		}
	}
	$scope.editCategory = function(){
		if (!$scope.category.category_id || !$scope.category.sum){
			messagesServ.showMessages('error', 'Помилка! Поля "Категорія" та "Сума" обов\'язкові для заповнення!');
		}
		else if (!/^[\d\.]+$/.test($scope.category.sum)){
			messagesServ.showMessages('error', 'Помилка! Значення поля "Сума" має бути числовим!');
		}
		else{
			$scope.category.month = $scope.budget.month;
			$scope.category.year  = $scope.budget.year;
			budgetsServ.editCategory($scope.category, function(data){
				if (data.status == 'success'){
					if ($scope.category.id){     // edit budgetCategory
						for (var i=0; i<$scope.budget.categories.length; i++){
							if ($scope.budget.categories[i].id == $scope.category.id){
								$scope.budget.categories[i] = data.arr;
							}
						}
					}
					else{     // add budgetCategory
						$scope.budget.categories.push(data.arr);
					}
					$scope.calculateTotalSum();
					angular.element(document).find('#popupEditForm').modal('hide');
					$scope.formIsShown = false;
				}
				messagesServ.showMessages(data.status, data.msg);
            });
		}
	}
	$scope.delCategory = function(id){
		if (confirm('Ви точно хочете видалити цю категорію?')){
			budgetsServ.delCategory(id, function(data){
				if (data.status == 'success'){
					for (var i=0; i<$scope.budget.categories.length; i++){
						if ($scope.budget.categories[i].id == id) $scope.budget.categories.splice(i, 1);
					}
					$scope.calculateTotalSum();
				}
				messagesServ.showMessages(data.status, data.msg);
			});
		}
	}
	$scope.copyBudget = function(){
		let months = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
		let currentMonth = months[$scope.budget.month - 1] + ' ' + $scope.budget.year;
		let dateFrom = new Date();
		dateFrom.setFullYear($scope.budget.year, $scope.budget.month - 2);
		let prevMonth = months[dateFrom.getMonth()] + ' ' + dateFrom.getFullYear();
		if (confirm('Ви точно хочете скопіювати бюджет минулого місяця (' + prevMonth + ') в бюджет цього місяця (' + currentMonth + ')? Будьте уважні, якщо в цьому місяці у вас є заповнені якісь категорії - все видалиться і буде точна копія категорій і сум минулого місяця.')){
			budgetsServ.copyBudget({
				monthFrom: dateFrom.getMonth() + 1,
	            yearFrom:  dateFrom.getFullYear(),
	            monthTo: $scope.budget.month,
	            yearTo:  $scope.budget.year
			}, function(data){
				if (data.status == 'success'){
					$scope.getBudget($scope.budget.year, $scope.budget.month);
				}
				messagesServ.showMessages(data.status, data.msg);
			});
		}
	}
	$scope.togglePrintMode = function(){
		printServ.togglePrintMode();
	}

	this.init();
});
