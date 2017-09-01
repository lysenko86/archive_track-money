<?php
class Users{
    private $salt            = 'mySUPERsalt';
    private $defaultPassword = '123456';
    function getCountUsers($params, &$data, &$db){
        $data['arr']    = $db->query("SELECT COUNT(*) AS `count` FROM `users` WHERE `confirm` = ?", ['1']);
        $data['arr']    = $data['arr'][0];
        $data['status'] = 'success';
    }
    function signin($params, &$data, &$db){
        if (!$params['email'] || !$params['password']){
            $data['status'] = 'error';
            $data['msg']    = 'Помилка! Поля "Email" та "Пароль" обов\'язкові для заповнення!';
        }
        else{
            $password = md5($this->salt.md5($params['password']).$this->salt);
            $isUser   = $db->query("SELECT `id`, `token`, `email`, `confirm` FROM `users` WHERE `email` = ? AND `password` = ?", [$params['email'], $password]);
            if (!$isUser){
                $data['token']  = false;
                $data['status'] = 'error';
                $data['msg']    = "Помилка! Невірний логін або пароль.";
            }
            elseif (!$isUser[0]['confirm']){
                $data['notConfirmed'] = true;
                $data['email']        = $isUser[0]['email'];
                $data['token']        = false;
                $data['status']       = 'error';
                $data['msg']          = "Помилка! Ваш Email не підтверджено.";
            }
            else{
                if ($isUser[0]['token']){
                    $token = $isUser[0]['token'];
                }
                else{
                    $token = md5(uniqid(rand(), 1));
                    $db->query("UPDATE `users` SET `token` = ? WHERE `email` = ?", [$token, $email]);
                }
                $data['arr']['token'] = $isUser[0]['id'].'.'.$token;
                $data['status']       = 'success';
                $data['msg']          = "Готово! Авторизація пройшла успішно.";
            }
        }
    }
    function logout($params, &$data, &$db){
        $data['arr']    = $db->query("UPDATE `users` SET `token` = ? WHERE `id` = ?", ['', $uid]);
        $data['status'] = 'success';
        $data['msg']    = "Готово! Ви успішно вийшли зі свого аккаунту.";
    }
    function sendPasswordMail($params, &$data, &$db){
        if (!$params['email']){
            $data['status'] = 'error';
            $data['msg']    = 'Помилка! Поле "Email" обов\'язкове для заповнення!';
        }
        else{
            $user = $db->query("SELECT `id`, `password` FROM `users` WHERE `email` = ?", [$params['email']]);
            if (!$user){
                $data['status'] = 'error';
                $data['msg']    = "Помилка! Такого Email не зареєстровано.";
            }
            else{
                $user    = $user[0];
                $subject = 'TrackMoney.com.ua - Скидування паролю';
                $mail    = 'Для скидування паролю перейдіть будь ласка за посиланням: http://trackmoney.com.ua/#/reset/'.$user['id'].'.'.$user['password'];
                mail($params['email'], $subject, $mail);
                $data['status'] = 'success';
                $data['msg']    = "Готово! На вказану вами пошту вислано листа, для скидування паролю - перейдіть по посиланню.";
            }
        }
    }
    function resetPassword($params, &$data, &$db){
        $reset  = explode('.', $params['reset']);
        $isUser = $db->query("SELECT `id`, `email` FROM `users` WHERE `id` = ? AND `password` = ?", [$reset[0], $reset[1]]);
        if (!$isUser){
            $data['status'] = 'error';
            $data['msg']    = "Помилка! Такого користувача не знайдено.";
        }
        else{
            $isUser   = $isUser[0];
            $password = md5($this->salt.md5($this->defaultPassword).$this->salt);
            $db->query("UPDATE `users` SET `password` = ? WHERE `id` = ? AND `password` = ?", [$password, $reset[0], $reset[1]]);
            $subject = 'TrackMoney.com.ua - Ваш пароль змінено';
            $mail    = "Ваш новий пароль:\n".$this->defaultPassword."\n Будь ласка, зразу змініть його, як тільки авторизуєтесь, оскільки це дуже не надійний пароль.";
            mail($isUser['email'], $subject, $mail);
            $data['status'] = 'success';
            $data['msg']    = "Готово! Пароль успішно змінено.";
        }
    }
    function signup($params, &$data, &$db){
        if (!$params['email'] || !$params['password']){
            $data['status'] = 'error';
            $data['msg']    = 'Помилка! Поля "Email" та "Пароль" обов\'язкові для заповнення!';
        }
        elseif (!preg_match('/^\S+@\S+$/', $params['email'])){
            $data['status'] = 'error';
            $data['msg']    = 'Помилка! Значення поля "Email" має бути наступного формату: email@email.com!';
        }
        elseif (!$params['agree']){
            $data['status'] = 'error';
            $data['msg']    = 'Помилка! Ви повинні прийняти умови користувацької угоди, повірте, це важливо, там не багато читати :)';
        }
        else{
            $isUser = $db->query("SELECT `id` FROM `users` WHERE `email` = ?", [$params['email']]);
            if ($isUser){
                $data['status'] = 'error';
                $data['msg']    = "Помилка! Даний Email вже зайнятий, оберіть інший.";
            }
            else{
                $date    = date("Y-m-d H:i:s");
                $hash    = md5($this->salt.md5($params['password']).$this->salt);
                $id      = $db->query("INSERT INTO `users` (`email`, `password`, `created`) VALUES(?, ?, ?)", [$params['email'], $hash, $date], NULL, true);
                $subject = 'TrackMoney.com.ua - Підтвердження Email';
                $mail    = "Вітаємо в сервісі TrackMoney.com.ua, маємо надію, що вам все сподобається.\nВаш логін: $email\nВаш пароль: $password\n\nДля підтвердження Email перейдіть будь ласка за посиланням: http://trackmoney.com.ua/#/confirm/".$id.'.'.$hash;
                mail($params['email'], $subject, $mail);
                $data['status'] = 'success';
                $data['msg']    = "Готово! Реєстрація пройшла успішно. На вказану вами пошту вислано листа, для підтвердження Email - перейдіть по посиланню.";
            }
        }
    }
    function confirmEmail($params, &$data, &$db){
        $confirm = explode('.', $params['confirm']);
        $isUser  = $db->query("SELECT `id` FROM `users` WHERE `id` = ? AND `password` = ?", [$confirm[0], $confirm[1]]);
        if (!$isUser){
            $data['status'] = 'error';
            $data['msg']    = "Помилка! Такого користувача не знайдено.";
        }
        else{
            $db->query("UPDATE `users` SET `confirm` = '1' WHERE `id` = ? AND `password` = ?", [$confirm[0], $confirm[1]]);
            $data['status'] = 'success';
            $data['msg']    = "Готово! Email успішно підтверджено.";
        }
    }
    function sendConfirmMail($params, &$data, &$db){
        $user = $db->query("SELECT `id`, `password` FROM `users` WHERE `email` = ?", [$params['email']]);
        $user = $user[0];
        $subject = 'TrackMoney.com.ua - Підтвердження Email';
        $mail = 'Для підтвердження Email перейдіть будь ласка за посиланням: http://trackmoney.com.ua/#/confirm/'.$user['id'].'.'.$user['password'];
        mail($params['email'], $subject, $mail);
        $data['status'] = 'success';
        $data['msg']    = "Готово! На вказану вами пошту вислано листа, для підтвердження Email - перейдіть по посиланню.";
    }
}
?>
