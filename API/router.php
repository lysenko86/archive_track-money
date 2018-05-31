<?php
class Router{
    private $action     = 'none';
    private $params     = [];
    private $user       = [];
    private $superToken = 'bAYOBNDFC1oiI46TkEOfyafJQymccGHJGThEl6dp0moFK3ksZNg220HHosl3rukt';



    private $actions = [
        'admin_signin'   => ['ctrl' => 'Admins', 'method' => 'signin',   'access' => ['guest']],
        'admin_logout'   => ['ctrl' => 'Admins', 'method' => 'logout',   'access' => ['super']],
        'admin_getUsers' => ['ctrl' => 'Admins', 'method' => 'getUsers', 'access' => ['super']],
        'admin_getMails' => ['ctrl' => 'Admins', 'method' => 'getMails', 'access' => ['super']],
        'admin_getMail'  => ['ctrl' => 'Admins', 'method' => 'getMail',  'access' => ['super']],
        'admin_mailSave' => ['ctrl' => 'Admins', 'method' => 'mailSave', 'access' => ['super']],
        'admin_mailTest' => ['ctrl' => 'Admins', 'method' => 'mailTest', 'access' => ['super']],
        'admin_mailSend' => ['ctrl' => 'Admins', 'method' => 'mailSend', 'access' => ['super']],

        'getCountUsers'    => ['ctrl' => 'Users', 'method' => 'getCountUsers',    'access' => ['guest', 'user', 'admin']],
        'signin'           => ['ctrl' => 'Users', 'method' => 'signin',           'access' => ['guest']],
        'logout'           => ['ctrl' => 'Users', 'method' => 'logout',           'access' => ['user', 'admin']],
        'sendPasswordMail' => ['ctrl' => 'Users', 'method' => 'sendPasswordMail', 'access' => ['guest']],
        'resetPassword'    => ['ctrl' => 'Users', 'method' => 'resetPassword',    'access' => ['guest']],
        'signup'           => ['ctrl' => 'Users', 'method' => 'signup',           'access' => ['guest']],
        'confirmEmail'     => ['ctrl' => 'Users', 'method' => 'confirmEmail',     'access' => ['guest']],
        'sendConfirmMail'  => ['ctrl' => 'Users', 'method' => 'sendConfirmMail',  'access' => ['guest']],
        'getProfile'       => ['ctrl' => 'Users', 'method' => 'getProfile',       'access' => ['user', 'admin']],
        'editPassword'     => ['ctrl' => 'Users', 'method' => 'editPassword',     'access' => ['user', 'admin']],
        'removeAccount'    => ['ctrl' => 'Users', 'method' => 'removeAccount',    'access' => ['user', 'admin']],

        'getPosts'      => ['ctrl' => 'Forum', 'method' => 'getPosts',      'access' => ['user', 'admin']],
        'getPost'       => ['ctrl' => 'Forum', 'method' => 'getPost',       'access' => ['user', 'admin']],
        'addPost'       => ['ctrl' => 'Forum', 'method' => 'addPost',       'access' => ['user', 'admin']],
        'addComment'    => ['ctrl' => 'Forum', 'method' => 'addCommentt',   'access' => ['user', 'admin']],
        'setPostStatus' => ['ctrl' => 'Forum', 'method' => 'setPostStatus', 'access' => ['admin']],

        'getActions' => ['ctrl' => 'Actions', 'method' => 'getActions', 'access' => ['user', 'admin']],
        'getAction'  => ['ctrl' => 'Actions', 'method' => 'getAction',  'access' => ['user', 'admin']],
        'editAction' => ['ctrl' => 'Actions', 'method' => 'editAction', 'access' => ['user', 'admin']],
        'delAction'  => ['ctrl' => 'Actions', 'method' => 'delAction',  'access' => ['user', 'admin']],
        'getIncomeByMonth' => ['ctrl' => 'Actions', 'method' => 'getIncomeByMonth', 'access' => ['user', 'admin']],
        'getCostByMonth' => ['ctrl' => 'Actions', 'method' => 'getCostByMonth', 'access' => ['user', 'admin']],

        'getCategories' => ['ctrl' => 'Categories', 'method' => 'getCategories', 'access' => ['user', 'admin']],
        'getGoals'      => ['ctrl' => 'Categories', 'method' => 'getGoals',      'access' => ['user', 'admin']],
        'getCategory'   => ['ctrl' => 'Categories', 'method' => 'getCategory',   'access' => ['user', 'admin']],
        'editCategory'  => ['ctrl' => 'Categories', 'method' => 'editCategory',  'access' => ['user', 'admin']],
        'delCategory'   => ['ctrl' => 'Categories', 'method' => 'delCategory',   'access' => ['user', 'admin']],

        'getAccounts' => ['ctrl' => 'Accounts', 'method' => 'getAccounts', 'access' => ['user', 'admin']],
        'getBalances' => ['ctrl' => 'Accounts', 'method' => 'getBalances', 'access' => ['user', 'admin']],
        'getAccount'  => ['ctrl' => 'Accounts', 'method' => 'getAccount',  'access' => ['user', 'admin']],
        'editAccount' => ['ctrl' => 'Accounts', 'method' => 'editAccount', 'access' => ['user', 'admin']],
        'delAccount'  => ['ctrl' => 'Accounts', 'method' => 'delAccount',  'access' => ['user', 'admin']],

        'getBudget'          => ['ctrl' => 'Budgets', 'method' => 'getBudget',    'access' => ['user', 'admin']],
        'getBudgetCategory'  => ['ctrl' => 'Budgets', 'method' => 'getCategory',  'access' => ['user', 'admin']],
        'editBudgetCategory' => ['ctrl' => 'Budgets', 'method' => 'editCategory', 'access' => ['user', 'admin']],
        'delBudgetCategory'  => ['ctrl' => 'Budgets', 'method' => 'delCategory',  'access' => ['user', 'admin']],
        'copyBudget'         => ['ctrl' => 'Budgets', 'method' => 'copyBudget',   'access' => ['user', 'admin']],

        'getProperties' => ['ctrl' => 'Properties', 'method' => 'getProperties', 'access' => ['user', 'admin']],
        'getProperty'   => ['ctrl' => 'Properties', 'method' => 'getProperty',   'access' => ['user', 'admin']],
        'editProperty'  => ['ctrl' => 'Properties', 'method' => 'editProperty',  'access' => ['user', 'admin']],
        'delProperty'   => ['ctrl' => 'Properties', 'method' => 'delProperty',   'access' => ['user', 'admin']],
        'getActiveByMonth' => ['ctrl' => 'Properties', 'method' => 'getActiveByMonth', 'access' => ['user', 'admin']],
        'getPassiveByMonth' => ['ctrl' => 'Properties', 'method' => 'getPassiveByMonth', 'access' => ['user', 'admin']],
        'getCapitalByMonth' => ['ctrl' => 'Properties', 'method' => 'getCapitalByMonth', 'access' => ['user', 'admin']]
    ];



    function __construct(){
        $request = json_decode(file_get_contents('php://input'));
        if (!empty($_GET)){
            foreach ($_GET as $k=>$v){
                $this->params[$k] = trim($v);
            }
        }
        if (!empty($request)){
            foreach ($request as $k=>$v){
                $this->params[$k] = trim($v);
            }
        }
        if (!empty($this->params['token'])){
            $this->params['uid'] = explode('.', $_GET['token']);
            $this->params['uid'] = $this->params['uid'][0];
        }
        $this->action = $this->params['action'] ? $this->params['action'] : 'none';
    }



    function getAction(){
        return $this->action;
    }
    function checkAction(){
        return $this->actions[$this->action];
    }
    function checkAccess(&$db){
        if (!$this->params['token']){
            array_push($this->user, 'guest');
        }
        if ($this->params['token']){
            $token = explode('.', $this->params['token']);
            $user  = $db->query("SELECT `id`, `admin` FROM `users` WHERE `id` = ? AND `token` = ?", [$token[0], $token[1]]);
            if ($user['id']){
                array_push($this->user, 'user');
            }
            if ($user['admin']){
                array_push($this->user, 'admin');
            }
            if ($this->params['token'] == $this->superToken){
                array_push($this->user, 'super');
            }
        }
        $access = true;
        foreach ($this->user as $v){
            if (!in_array($v, $this->actions[$this->action]['access'])){
                $access = false;
            }
        }
        return $access;
    }



    function getController(){
        return $this->actions[$this->action]['ctrl'];
    }
    function getMethod(){
        return $this->actions[$this->action]['method'];
    }
    function getParams(){
        return $this->params;
    }
}
?>
