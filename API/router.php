<?php
class Router{
    private $action = 'none';
    private $params = [];
    private $user   = [];



    private $actions = [
        'getCountUsers' => [
            'ctrl'   => 'Users',
            'method' => 'getCountUsers',
            'access' => ['guest', 'user', 'admin']
        ],
        'signin' => [
            'ctrl'   => 'Users',
            'method' => 'signin',
            'access' => ['guest']
        ],
        'logout' => [
            'ctrl'   => 'Users',
            'method' => 'logout',
            'access' => ['user', 'admin']
        ],
        'sendPasswordMail' => [
            'ctrl'   => 'Users',
            'method' => 'sendPasswordMail',
            'access' => ['guest']
        ],
        'resetPassword' => [
            'ctrl'   => 'Users',
            'method' => 'resetPassword',
            'access' => ['guest']
        ],
        'signup' => [
            'ctrl'   => 'Users',
            'method' => 'signup',
            'access' => ['guest']
        ],
        'confirmEmail' => [
            'ctrl'   => 'Users',
            'method' => 'confirmEmail',
            'access' => ['guest']
        ],
        'sendConfirmMail' => [
            'ctrl'   => 'Users',
            'method' => 'sendConfirmMail',
            'access' => ['guest']
        ],
        'getActions' => [
            'ctrl'   => 'Actions',
            'method' => 'getActions',
            'access' => ['user', 'admin']
        ]
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
