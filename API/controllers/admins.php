<?php
class Admins{
    private $superEmail    = 'a@a';
    private $superPassword = 'tm_admin';
    private $superToken    = 'bAYOBNDFC1oiI46TkEOfyafJQymccGHJGThEl6dp0moFK3ksZNg220HHosl3rukt';
    private $params        = [];
    private $data          = [];
    private $db            = NULL;
    function __construct($params, &$data, &$db){
        $this->params = $params;
        $this->data   = &$data;
        $this->db     = &$db;
    }
    function signin(){
        if (!$this->params['email'] || !$this->params['password']){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Поля "Email" та "Пароль" обов\'язкові для заповнення!';
        }
        else{
            if ($this->params['email'] != $this->superEmail || $this->params['password'] != $this->superPassword){
                $this->data['token']  = false;
                $this->data['status'] = 'error';
                $this->data['msg']    = "Помилка! Невірний логін або пароль.";
            }
            else{
                $this->data['arr']['token'] = $this->superToken;
				$this->data['status']       = 'success';
				$this->data['msg']          = "Готово! Авторизація пройшла успішно.";
            }
        }
    }
    function logout(){
        $this->data['status'] = 'success';
        $this->data['msg']    = "Готово! Ви успішно вийшли зі свого аккаунту.";
    }
    function getUsers(){
        $this->data['arr']    = $this->db->query("SELECT *, DATE_FORMAT(`created`, '%d.%m.%Y %H:%i:%s') AS `created` FROM `users` ORDER BY `created` DESC, `id` DESC", []);
        $this->data['status'] = 'success';
        $this->data['msg']    = "";
    }
}
?>
