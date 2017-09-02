<?php
class Forum{
    private $forumEmail = 'lysenkoa86@gmail.com';
    private $params     = [];
    private $data       = [];
    private $db         = NULL;
    function __construct($params, &$data, &$db){
        $this->params = $params;
        $this->data   = &$data;
        $this->db     = &$db;
    }
    function getPosts(){
        $this->data['arr'] = $this->db->query("
            SELECT
                `f`.*,
                DATE_FORMAT(`f`.`created`, '%d.%m.%Y') AS `created`,
                DATE_FORMAT(`f`.`updated`, '%d.%m.%Y') AS `updated`,
                IFNULL(`u`.`email`, 'Користувач видалений') AS `email`,
                `u`.`admin`,
                IFNULL(`uu`.`email`, 'Користувач видалений') AS `email_upd`,
                `uu`.`admin` AS `admin_upd`,
                (SELECT COUNT(*) FROM `forum_comments` WHERE `fid` = `f`.`id`) AS `count`
            FROM `forum` AS `f`
                LEFT JOIN `users` AS `u` ON (`u`.`id` = `f`.`uid`)
                LEFT JOIN `users` AS `uu` ON (`uu`.`id` = `f`.`uid_upd`)
            ORDER BY `f`.`category` ASC, `f`.`updated` DESC
        ", [], false);
        $user                  = $this->db->query("SELECT `id`, `admin` FROM `users` WHERE `id` = ?", [$this->params['uid']]);
        $this->data['isAdmin'] = $user[0]['admin'];
        $this->data['status']  = 'success';
    }
    function getPost(){
        $this->data['arr'] = $this->db->query("
            SELECT
                `f`.*,
                DATE_FORMAT(`f`.`created`, '%d.%m.%Y') AS `created`,
                DATE_FORMAT(`f`.`updated`, '%d.%m.%Y') AS `updated`,
                IFNULL(`u`.`email`, 'Користувач видалений') AS `email`,
                `u`.`admin`,
                IFNULL(`uu`.`email`, 'Користувач видалений') AS `email_upd`,
                `uu`.`admin` AS `admin_upd`,
                (SELECT COUNT(*) FROM `forum_comments` WHERE `fid` = `f`.`id`) AS `count`
            FROM `forum` AS `f`
                LEFT JOIN `users` AS `u` ON (`u`.`id` = `f`.`uid`)
                LEFT JOIN `users` AS `uu` ON (`uu`.`id` = `f`.`uid_upd`)
            WHERE `f`.`id` = ?
        ", [$this->params['id']]);
        if (!$this->data['arr']){
            $this->data['msg']    = 'Помилка! Такого посту немає!';
            $this->data['status'] = 'error';
        }
        else{
            $this->data['arr'] = $this->data['arr'][0];
            $this->data['arr']['comments'] = $this->db->query("
                SELECT
                    `fc`.*,
                    DATE_FORMAT(`fc`.`created`, '%d.%m.%Y') AS `created`,
                    IFNULL(`u`.`email`, 'Користувач видалений') AS `email`,
                    `u`.`admin`
                FROM `forum_comments` AS `fc`
                    LEFT JOIN `users` AS `u` ON (`u`.`id` = `fc`.`uid`)
                WHERE `fc`.`fid` = ?
            ", [$this->params['id']]);
            $user                  = $this->db->query("SELECT `id`, `admin` FROM `users` WHERE `id` = ?", [$this->params['uid']]);
            $this->data['isAdmin'] = $user[0]['admin'];
            $this->data['status']  = 'success';
        }
    }
    function addPost(){
        if (!$this->params['title'] || !$this->params['category'] || !$this->params['comment']){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Поля "Тема", "Категорія" та "Перший коментар" обов\'язкові для заповнення!';
        }
        else{
            $date = date("Y-m-d H:i:s");
            $id   = $this->db->query(
                "INSERT INTO `forum` (`uid`, `uid_upd`, `title`, `category`, `created`, `updated`) VALUES(?, ?, ?, ?, ?, ?)",
                [$this->params['uid'], $this->params['uid'], $this->params['title'], $this->params['category'], $date, $date], NULL, true
            );
            $this->db->query(
                "INSERT INTO `forum_comments` (`fid`, `uid`, `created`, `comment`) VALUES(?, ?, ?, ?)",
                [$id, $this->params['uid'], $date, $this->params['comment']]
            );
            $this->data['arr'] = $this->db->query("
                SELECT
                    `f`.*,
                    DATE_FORMAT(`f`.`created`, '%d.%m.%Y') AS `created`,
                    DATE_FORMAT(`f`.`updated`, '%d.%m.%Y') AS `updated`,
                    IFNULL(`u`.`email`, 'Користувач видалений') AS `email`,
                    `u`.`admin`,
                    IFNULL(`uu`.`email`, 'Користувач видалений') AS `email_upd`,
                    `uu`.`admin` AS `admin_upd`,
                    (SELECT COUNT(*) FROM `forum_comments` WHERE `fid` = `f`.`id`) AS `count`
                FROM `forum` AS `f`
                    LEFT JOIN `users` AS `u` ON (`u`.`id` = `f`.`uid`)
                    LEFT JOIN `users` AS `uu` ON (`uu`.`id` = `f`.`uid_upd`)
                WHERE `f`.`id` = ?
            ", [$id]);
            $this->data['arr'] = $this->data['arr'][0];
            $subject           = 'TrackMoney.com.ua - Нове повідомлення на форумі';
            $mail              = 'Новий пост на форумі, для перегляду перейдіть за посиланням: http://trackmoney.com.ua/#/forum/'.$id;
            mail($this->forumEmail, $subject, $mail);
            $this->data['status'] = 'success';
            $this->data['msg']    = "Готово! Пост успішно доданий.";
        }
    }
    function addCommentt(){
        if (!$this->params['comment']){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Поле "Коментар" обов\'язкове для заповнення!';
        }
        else{
            $date = date("Y-m-d H:i:s");
            $id   = $this->db->query(
                "INSERT INTO `forum_comments` (`fid`, `uid`, `created`, `comment`) VALUES(?, ?, ?, ?)",
                [$this->params['fid'], $this->params['uid'], $date, $this->params['comment']], NULL, true
            );
            $this->db->query(
                "UPDATE `forum` SET `uid_upd` = ?, `updated` = ? WHERE `id` = ?",
                [$this->params['uid'], $date, $this->params['fid']]
            );
            $this->data['arr'] = $this->db->query("
                SELECT
                    `fc`.*,
                    DATE_FORMAT(`fc`.`created`, '%d.%m.%Y') AS `created`,
                    `u`.`email`,
                    (SELECT `f`.`uid` FROM `forum` AS `f` WHERE `f`.`id` = `fc`.`fid`) AS `uid_created`,
                    (SELECT `u`.`email` FROM `users` AS `u` WHERE `u`.`id` = `uid_created`) AS `email_created`
                FROM `forum_comments` AS `fc`
                    LEFT JOIN `users` AS `u` ON (`u`.`id` = `fc`.`uid`)
                WHERE `fc`.`id` = ?
            ", [$id]);
            $this->data['arr'] = $this->data['arr'][0];
            $subject           = 'TrackMoney.com.ua - Нове повідомлення на форумі';
            $mail              = 'Нове повідомлення на форумі, для перегляду перейдіть за посиланням: http://trackmoney.com.ua/#/forum/'.$this->params['fid'];
            mail($this->forumEmail, $subject, $mail);
            mail($this->data['arr']['email_created'], $subject, $mail);
            $this->data['status'] = 'success';
            $this->data['msg']    = "Готово! Коментар успішно доданий.";
        }
    }
    function setPostStatus(){
        $this->db->query("UPDATE `forum` SET `status` = ? WHERE `id` = ?", [$this->params['status'], $this->params['id']]);
        $this->data['arr']['id']     = $this->params['id'];
        $this->data['arr']['status'] = $this->params['status'];
        $this->data['status']        = 'success';
        $this->data['msg']           = "Готово! Статус поста успішно змінено.";
    }
}
?>
