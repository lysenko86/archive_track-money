<?php
class Router{
    private $action  = 'none';
    private $actions = [
        'getActions' => [
            'ctrl'   => 'Actions',
            'method' => 'getActions',
            'params' => ['uid', 'from', 'count'],
            'access' => 'user'   // user, guest, admin
        ],
        'getSignup' => [
            'ctrl' => 'Actions',
            'method' => 'getActions',
            'params' => [],
            'access' => 'guest'
        ],
        'getPostStatus' => [
            'ctrl' => 'Actions',
            'method' => 'getActions',
            'params' => [],
            'access' => 'admin'
        ]
    ];
    function __construct(){
        $request      = json_decode(file_get_contents('php://input'));
        $this->action = $_GET['action'] ? $_GET['action'] : ($request->action ? $request->action : 'none');
    }
    function getAction(){
        return $this->action;
    }
    function checkAction(){
        return $this->actions[$this->action];
    }
    function getController(){
        return $this->actions[$this->action]['ctrl'];
    }
    function getMethod(){
        return $this->actions[$this->action]['method'];
    }
    function getParams(){
        return $this->actions[$this->action]['params'];
    }
    function getAccess(){
        return $this->actions[$this->action]['access'];
    }
}
?>
