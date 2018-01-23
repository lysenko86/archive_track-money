<?php
class Users{
    private $salt            = 'mySUPERsalt';
    private $defaultPassword = '123456';
    private $params          = [];
    private $data            = [];
    private $db              = NULL;
    function __construct($params, &$data, &$db){
        $this->params = $params;
        $this->data   = &$data;
        $this->db     = &$db;
    }
    function getCountUsers(){
        $this->data['arr']    = $this->db->query("SELECT COUNT(*) AS `count` FROM `users` WHERE `confirm` = ?", ['1']);
        $this->data['arr']    = $this->data['arr'][0];
        $this->data['status'] = 'success';
    }
    function signin(){
        if (!$this->params['email'] || !$this->params['password']){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Поля "Email" та "Пароль" обов\'язкові для заповнення!';
        }
        else{
            $password = md5($this->salt.md5($this->params['password']).$this->salt);
            $isUser   = $this->db->query(
                "SELECT `id`, `token`, `email`, `confirm` FROM `users` WHERE `email` = ? AND `password` = ?",
                [$this->params['email'], $password]
            );
            if (!$isUser){
                $this->data['token']  = false;
                $this->data['status'] = 'error';
                $this->data['msg']    = "Помилка! Невірний логін або пароль.";
            }
            elseif (!$isUser[0]['confirm']){
                $this->data['notConfirmed'] = true;
                $this->data['email']        = $isUser[0]['email'];
                $this->data['token']        = false;
                $this->data['status']       = 'error';
                $this->data['msg']          = "Помилка! Ваш Email не підтверджено.";
            }
            else{
                if ($isUser[0]['token']){
                    $token = $isUser[0]['token'];
                }
                else{
                    $token = md5(uniqid(rand(), 1));
                    $this->db->query("UPDATE `users` SET `token` = ? WHERE `email` = ?", [$token, $this->params['email']]);
                }
                $this->data['arr']['token'] = $isUser[0]['id'].'.'.$token;
                $this->data['status']       = 'success';
                $this->data['msg']          = "Готово! Авторизація пройшла успішно.";
            }
        }
    }
    function logout(){
        $this->data['arr']    = $this->db->query("UPDATE `users` SET `token` = ? WHERE `id` = ?", ['', $this->params['uid']]);
        $this->data['status'] = 'success';
        $this->data['msg']    = "Готово! Ви успішно вийшли зі свого аккаунту.";
    }
    function sendPasswordMail(){
        if (!$this->params['email']){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Поле "Email" обов\'язкове для заповнення!';
        }
        else{
            $user = $this->db->query("SELECT `id`, `password` FROM `users` WHERE `email` = ?", [$this->params['email']]);
            if (!$user){
                $this->data['status'] = 'error';
                $this->data['msg']    = "Помилка! Такого Email не зареєстровано.";
            }
            else{
                $user    = $user[0];
                $subject = 'TrackMoney.com.ua - Скидування паролю';
                $mail    = 'Для скидування паролю перейдіть будь ласка за посиланням: http://trackmoney.com.ua/#/reset/'.$user['id'].'.'.$user['password'];
                mail($this->params['email'], $subject, $mail);
                $this->data['status'] = 'success';
                $this->data['msg']    = "Готово! На вказану вами пошту вислано листа, для скидування паролю - перейдіть по посиланню.";
            }
        }
    }
    function resetPassword(){
        $reset  = explode('.', $this->params['reset']);
        $isUser = $this->db->query("SELECT `id`, `email` FROM `users` WHERE `id` = ? AND `password` = ?", [$reset[0], $reset[1]]);
        if (!$isUser){
            $this->data['status'] = 'error';
            $this->data['msg']    = "Помилка! Такого користувача не знайдено.";
        }
        else{
            $isUser   = $isUser[0];
            $password = md5($this->salt.md5($this->defaultPassword).$this->salt);
            $this->db->query("UPDATE `users` SET `password` = ? WHERE `id` = ? AND `password` = ?", [$password, $reset[0], $reset[1]]);
            $subject = 'TrackMoney.com.ua - Ваш пароль змінено';
            $mail    = "Ваш новий пароль:\n".$this->defaultPassword."\n Будь ласка, зразу змініть його, як тільки авторизуєтесь, оскільки це дуже не надійний пароль.";
            mail($isUser['email'], $subject, $mail);
            $this->data['status'] = 'success';
            $this->data['msg']    = "Готово! Пароль успішно змінено.";
        }
    }
    function signup(){
        if (!$this->params['email'] || !$this->params['password']){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Поля "Email" та "Пароль" обов\'язкові для заповнення!';
        }
        elseif (!preg_match('/^\S+@\S+$/', $this->params['email'])){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Значення поля "Email" має бути наступного формату: email@email.com!';
        }
        elseif (!$this->params['agree']){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Ви повинні прийняти умови користувацької угоди, повірте, це важливо, там не багато читати :)';
        }
        else{
            $isUser = $this->db->query("SELECT `id` FROM `users` WHERE `email` = ?", [$this->params['email']]);
            if ($isUser){
                $this->data['status'] = 'error';
                $this->data['msg']    = "Помилка! Даний Email вже зайнятий, оберіть інший.";
            }
            else{
                $date = date("Y-m-d H:i:s");
                $hash = md5($this->salt.md5($this->params['password']).$this->salt);
                $id   = $this->db->query(
                    "INSERT INTO `users` (`email`, `password`, `created`) VALUES(?, ?, ?)",
                    [$this->params['email'], $hash, $date], NULL, true
                );
                $subject = 'TrackMoney.com.ua - Підтвердження Email';
                $mail    = "Вітаємо в сервісі TrackMoney.com.ua, маємо надію, що вам все сподобається.\nВаш логін: {$this->params['email']}\nВаш пароль: {$this->params['password']}\n\nДля підтвердження Email перейдіть будь ласка за посиланням: http://trackmoney.com.ua/#/confirm/".$id.'.'.$hash;
                mail($this->params['email'], $subject, $mail);
                $this->data['status'] = 'success';
                $this->data['msg']    = "Готово! Реєстрація пройшла успішно. На вказану вами пошту вислано листа, для підтвердження Email - перейдіть по посиланню.";
            }
        }
    }
    function confirmEmail(){
        $confirm = explode('.', $this->params['confirm']);
        $isUser  = $this->db->query("SELECT `id` FROM `users` WHERE `id` = ? AND `password` = ?", [$confirm[0], $confirm[1]]);
        if (!$isUser){
            $this->data['status'] = 'error';
            $this->data['msg']    = "Помилка! Такого користувача не знайдено.";
        }
        else{
            $this->db->query("UPDATE `users` SET `confirm` = '1' WHERE `id` = ? AND `password` = ?", [$confirm[0], $confirm[1]]);
            $this->data['status'] = 'success';
            $this->data['msg']    = "Готово! Email успішно підтверджено.";
        }
    }
    function sendConfirmMail(){
        $user    = $this->db->query("SELECT `id`, `password` FROM `users` WHERE `email` = ?", [$this->params['email']]);
        $user    = $user[0];
        $subject = 'TrackMoney.com.ua - Підтвердження Email';
        $mail    = 'Для підтвердження Email перейдіть будь ласка за посиланням: http://trackmoney.com.ua/#/confirm/'.$user['id'].'.'.$user['password'];
        mail($this->params['email'], $subject, $mail);
        $this->data['status'] = 'success';
        $this->data['msg']    = "Готово! На вказану вами пошту вислано листа, для підтвердження Email - перейдіть по посиланню.";
    }
    function getProfile(){
        $this->data['arr']    = $this->db->query("SELECT *, DATE_FORMAT(`created`, '%d.%m.%Y') AS `created` FROM `users` WHERE `id` = ?", [$this->params['uid']]);
        $this->data['arr']    = $this->data['arr'][0];
        $this->data['status'] = 'success';
    }
    function editPassword(){
        if (!$this->params['password'] || !$this->params['newPassword'] || !$this->params['confirmPassword']){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Поля "Актуальний пароль", "Новий пароль" та "Повтор нового паролю" обов\'язкові для заповнення!';
        }
        elseif ($this->params['newPassword'] != $this->params['confirmPassword']){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Значення поля "Новий пароль" та "Повтор нового паролю" мають бути однаковими!';
        }
        else{
            $password    = md5($this->salt.md5($this->params['password']).$this->salt);
            $newPassword = md5($this->salt.md5($this->params['newPassword']).$this->salt);
            $isUser      = $this->db->query("SELECT `id` FROM `users` WHERE `id` = ? AND `password` = ?", [$this->params['uid'], $password]);
            if (!$isUser){
                $this->data['status'] = 'error';
                $this->data['msg']    = "Помилка! Невірний актуальний пароль.";
            }
            else{
                $this->db->query("UPDATE `users` SET `password` = ? WHERE `id` = ?", [$newPassword, $this->params['uid']]);
                $this->data['status'] = 'success';
                $this->data['msg']    = "Готово! Пароль успішно змінено, наступний раз при авторизації вводьте новий пароль.";
            }
        }
    }
    function removeAccount(){
        $this->db->query("DELETE FROM `accounts` WHERE `uid` = ?", [$this->params['uid']]);
        $this->db->query("DELETE FROM `actions` WHERE `uid` = ?", [$this->params['uid']]);
        $this->db->query("DELETE FROM `budgets` WHERE `uid` = ?", [$this->params['uid']]);
        $this->db->query("DELETE FROM `categories` WHERE `uid` = ?", [$this->params['uid']]);
        $this->db->query("DELETE FROM `users` WHERE `id` = ?", [$this->params['uid']]);
        $this->data['status'] = 'success';
        $this->data['msg']    = "Готово! Ваш акаунт успішно видалений, дякуємо, що користувались сервісом.";
    }
}
?>
