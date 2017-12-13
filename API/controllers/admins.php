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
        $this->data['arr']    = $this->db->query("SELECT *, DATE_FORMAT(`created`, '%d.%m.%Y %H:%i:%s') AS `created` FROM `users` ORDER BY `id` DESC", []);
        $this->data['status'] = 'success';
        $this->data['msg']    = "";
    }
    function getMails(){
        $this->data['arr']    = $this->db->query("SELECT *, DATE_FORMAT(`date`, '%d.%m.%Y') AS `date` FROM `mailing_mails` ORDER BY `id` DESC", []);
        $this->data['status'] = 'success';
        $this->data['msg']    = "";
    }
    function getMail(){
        $this->data['arr'] = $this->db->query(
            "SELECT * FROM `mailing_mails` WHERE `id` = ?",
            [$this->params['id']]
        );
        $this->data['arr']    = $this->data['arr'][0];
        $this->data['status'] = 'success';
    }
    function mailSave(){
        if (!$this->params['theme'] || !$this->params['content']){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Поля "Тема" та "Вміст" обов\'язкові для заповнення!';
        }
        else{
            if ($this->params['id']){     // edit mail
                $this->db->query("
                    UPDATE `mailing_mails` SET `theme` = ?, `content` = ? WHERE `id` = ?
                ", [$this->params['theme'], $this->params['content'], $this->params['id']]);
                $this->data['msg'] = "Готово! Лист успішно змінено.";
            }
            else{     // add mail
                $id = $this->db->query("
                    INSERT INTO `mailing_mails` (`theme`, `content`)
                    VALUES(?, ?)
                ", [$this->params['theme'], $this->params['content']], NULL, true);
                $this->data['msg'] = "Готово! Лист успішно створено.";
            }
            $id                = $this->params['id'] ? $this->params['id'] : $id;
            $this->data['arr'] = [
                id      => $id,
                date    => $this->params['date'],
                theme   => $this->params['theme'],
                content => $this->params['content']
            ];
            $this->data['status'] = 'success';
        }
    }
    function mailTest(){
        if (!$this->params['theme'] || !$this->params['content']){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Поля "Тема" та "Вміст" обов\'язкові для заповнення!';
        }
        else{
            global $officialEmail;
            mail($officialEmail, $this->params['theme'], $this->params['content']);
            $this->data['status'] = 'success';
            $this->data['msg']    = "Готово! Тестовий лист успішно відправлено на адресу $officialEmail";
        }
    }
    function mailSend(){
        if (!$this->params['theme'] || !$this->params['content']){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Поля "Тема" та "Вміст" обов\'язкові для заповнення!';
        }
        else{
            $isQueue = $this->db->query("SELECT COUNT(*) AS `count` FROM `mailing_cron`", []);
            if ($isQueue[0]['count'] > 0){
                $this->data['status'] = 'error';
                $this->data['msg']    = "Помилка! На даний момент лишається розіслати щє {$isQueue[0]['count']} листів, треба почекати.";
            }
            else{
                if ($this->params['id']){
                    $date1 = date('Y-m-d');
                    $date2 = date('d.m.Y');
                    $this->db->query("UPDATE `mailing_mails` SET `date` = ? WHERE `id` = ?", [$date1, $this->params['id']]);
                    $this->data['arr'] = [
                        id      => $this->params['id'],
                        date    => $date2,
                        theme   => $this->params['theme'],
                        content => $this->params['content']
                    ];
                }
                $this->db->query("INSERT INTO `mailing_cron` (`email`) SELECT `email` FROM `users` WHERE `confirm` = 1", []);
                $this->db->query("UPDATE `mailing_cron` SET `theme` = ?, `content` = ?", [$this->params['theme'], $this->params['content']]);
                $this->data['status'] = 'success';
                $this->data['msg']    = "Готово! Розсилання листів успішно розпочате";
            }
        }
    }
}
?>
