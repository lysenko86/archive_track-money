<?php
class Router{
    private $action  = 'none';
    private $params  = [];



    private $actions = [
        'getActions' => [
            'ctrl'   => 'Actions',
            'method' => 'getActions',
            'access' => 'user'   // user, guest, admin
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
        $token  = explode('.', trim($_GET['token']));
        $access = $db->query("SELECT `id` FROM `users` WHERE `id` = ? AND `token` = ?", array($token[0], $token[1]));
        return $access ? true : false;
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
