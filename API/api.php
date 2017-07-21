<?php
    require_once('db.php');
    $db = new PDO("mysql:host=localhost;dbname=$dbName", $dbUser, $dbPass);
    $db->exec("set names utf8");
    $salt = 'mySUPERsalt';
    $defaultPassword = '123456';
    $adminEmail = 'a@a';
    $adminPassword = 'tm_admin';
    $adminToken = 'bAYOBNDFC1oiI46TkEOfyafJQymccGHJGThEl6dp0moFK3ksZNg220HHosl3rukt';

    $request = json_decode(file_get_contents('php://input'));
    $action = $_GET['action'] ? $_GET['action'] : ($request->action ? $request->action : 'none');
    $data = array(
        'status' => '',   // success, error
        'msg'    => '',   // status message
        'arr'    => array()   // JSON
    );
    function getAdminAccess($token){
        return $_GET['token'] == $token;
    }
    function getAccess($db){
        $token = explode('.', trim($_GET['token']));
        $query = $db->prepare("SELECT `id` FROM `users` WHERE `id` = ? AND `token` = ?");
        $query->execute(array($token[0], $token[1]));
        $access = $query->fetchAll(PDO::FETCH_ASSOC);
        return $access ? true : false;
    }
    function getUID(){
        $token = explode('.', trim($_GET['token']));
        return $token[0];
    }
    function isAdmin($db, $id){
        $query = $db->prepare("SELECT `admin` FROM `users` WHERE `id` = ?");
        $query->execute(array($id));
        $res = $query->fetchAll(PDO::FETCH_ASSOC);
        return $res[0]['admin'] ? true : false;
    }
    switch ($action){



        case 'testConnection':
            $query = $db->prepare("SELECT COUNT(*) AS `count` FROM `accounts`");
            $query->execute(array());
            $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
            $data['arr'] = $data['arr'][0];
            $data['status'] = 'success';
        break;



        case 'admin_signin':
            if (!getAdminAccess($adminToken)){
                $email = trim($request->email);
                $password = trim($request->password);
                if (!$email || !$password){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Поля "Email" та "Пароль" обов\'язкові для заповнення!';
                }
                else{
                    if ($email != $adminEmail || $password != $adminPassword){
                        $data['token'] = false;
                        $data['status'] = 'error';
                        $data['msg']    = "Помилка! Невірний логін або пароль.";
                    }
                    else{
                        $data['arr']['token'] = $adminToken;
        				$data['status'] = 'success';
        				$data['msg']    = "Готово! Авторизація пройшла успішно.";
                    }
                 }
             }
             else{
                 $data['msg'] = 'Помилка! Немає доступу!';
                 $data['status'] = 'error';
             }
        break;
        case 'admin_logout':
            if (getAdminAccess($adminToken)){
                $data['status'] = 'success';
                $data['msg']    = "Готово! Ви успішно вийшли зі свого аккаунту.";
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'admin_getUsers':
            if (getAdminAccess($adminToken)){
                $query = $db->prepare("SELECT *, DATE_FORMAT(`created`, '%d.%m.%Y %H:%i:%s') AS `created` FROM `users` ORDER BY `created` DESC, `id` DESC");
                $query->execute(array());
                $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
                $data['status'] = 'success';
                $data['msg']    = "";
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;



        case 'getCountUsers':
            $query = $db->prepare("SELECT COUNT(*) AS `count` FROM `users` WHERE `confirm` = ?");
            $query->execute(array('1'));
            $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
            $data['arr'] = $data['arr'][0];
            $data['status'] = 'success';
        break;
        case 'signin':
            if (!getAccess($db)){
                $email = trim($request->email);
                $password = trim($request->password);
                if (!$email || !$password){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Поля "Email" та "Пароль" обов\'язкові для заповнення!';
                }
                else{
                    $password = md5($salt . md5($password) . $salt);
    				$query = $db->prepare("SELECT `id`, `token`, `email`, `confirm` FROM `users` WHERE `email` = ? AND `password` = ?");
    				$query->execute(array($email, $password));
                    $isUser = $query->fetchAll(PDO::FETCH_ASSOC);
                    if (!$isUser){
                        $data['token'] = false;
                        $data['status'] = 'error';
                        $data['msg']    = "Помилка! Невірний логін або пароль.";
                    }
                    elseif (!$isUser[0]['confirm']){
                        $data['notConfirmed'] = true;
                        $data['email'] = $isUser[0]['email'];
                        $data['token'] = false;
                        $data['status'] = 'error';
                        $data['msg']    = "Помилка! Ваш Email не підтверджено.";
                    }
                    else{
                        if ($isUser[0]['token']){
                            $token = $isUser[0]['token'];
                        }
                        else{
                            $token = md5(uniqid(rand(), 1));
                            $query = $db->prepare("UPDATE `users` SET `token` = ? WHERE `email` = ?");
            				$query->execute(array($token, $email));
                        }
                        $data['arr']['token'] = $isUser[0]['id'].'.'.$token;
        				$data['status'] = 'success';
        				$data['msg']    = "Готово! Авторизація пройшла успішно.";
                    }
                 }
             }
             else{
                 $data['msg'] = 'Помилка! Немає доступу!';
                 $data['status'] = 'error';
             }
        break;
        case 'sendConfirmMail':
            if (!getAccess($db)){
                $email = trim($request->email);
                $query = $db->prepare("SELECT `id`, `password` FROM `users` WHERE `email` = ?");
                $query->execute(array($email));
                $user = $query->fetchAll(PDO::FETCH_ASSOC);
                $user = $user[0];
                $subject = 'TrackMoney.com.ua - Підтвердження Email';
                $mail = 'Для підтвердження Email перейдіть будь ласка за посиланням: http://trackmoney.com.ua/#/confirm/'.$user['id'].'.'.$user['password'];
                mail($email, $subject, $mail);
                $data['status'] = 'success';
                $data['msg']    = "Готово! На вказану вами пошту вислано листа, для підтвердження Email - перейдіть по посиланню.";
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'sendPasswordMail':
            if (!getAccess($db)){
                $email = trim($request->email);
                if (!$email){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Поле "Email" обов\'язкове для заповнення!';
                }
                else{
                    $query = $db->prepare("SELECT `id`, `password` FROM `users` WHERE `email` = ?");
                    $query->execute(array($email));
                    $user = $query->fetchAll(PDO::FETCH_ASSOC);
                    if (!$user){
                        $data['status'] = 'error';
                        $data['msg']    = "Помилка! Такого Email не зареєстровано.";
                    }
                    else{
                        $user = $user[0];
                        $subject = 'TrackMoney.com.ua - Скидування паролю';
                        $mail = 'Для скидування паролю перейдіть будь ласка за посиланням: http://trackmoney.com.ua/#/reset/'.$user['id'].'.'.$user['password'];
                        mail($email, $subject, $mail);
                        $data['status'] = 'success';
                        $data['msg']    = "Готово! На вказану вами пошту вислано листа, для скидування паролю - перейдіть по посиланню.";
                    }
                }
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'signup':
            if (!getAccess($db)){
                $email = trim($request->email);
                $password = trim($request->password);
                $agree = trim($request->agree);
                if (!$email || !$password){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Поля "Email" та "Пароль" обов\'язкові для заповнення!';
                }
                elseif (!preg_match('/^\S+@\S+$/', $email)){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення поля "Email" має бути наступного формату: email@email.com!';
                }
                elseif (!$agree){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Ви повинні прийняти умови користувацької угоди, повірте, це важливо, там не багато читати :)';
                }
                else{
                    $query = $db->prepare("SELECT `id` FROM `users` WHERE `email` = ?");
                    $query->execute(array($email));
                    $isUser = $query->fetchAll(PDO::FETCH_ASSOC);
                    if ($isUser){
                        $data['status'] = 'error';
                        $data['msg']    = "Помилка! Даний Email вже зайнятий, оберіть інший.";
                    }
                    else{
                        $date = date("Y-m-d H:i:s");
                        $hash = md5($salt . md5($password) . $salt);
                        $query = $db->prepare("INSERT INTO `users` (`email`, `password`, `created`) VALUES(?, ?, ?)");
                        $query->execute(array($email, $hash, $date));
                        $id = $db->lastInsertId();
                        $subject = 'TrackMoney.com.ua - Підтвердження Email';
                        $mail = "Вітаємо в сервісі TrackMoney.com.ua, маємо надію, що вам все сподобається.\nВаш логін: $email\nВаш пароль: $password\n\nДля підтвердження Email перейдіть будь ласка за посиланням: http://trackmoney.com.ua/#/confirm/".$id.'.'.$hash;
                        mail($email, $subject, $mail);
                        $data['status'] = 'success';
                        $data['msg']    = "Готово! Реєстрація пройшла успішно. На вказану вами пошту вислано листа, для підтвердження Email - перейдіть по посиланню.";
                    }
                }
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'logout':
            if (getAccess($db)){
                $uid = getUID();
                $query = $db->prepare("UPDATE `users` SET `token` = ? WHERE `id` = ?");
                $query->execute(array('', $uid));
                $data['status'] = 'success';
                $data['msg']    = "Готово! Ви успішно вийшли зі свого аккаунту.";
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'confirmEmail':
            if (!getAccess($db)){
                $confirm = explode('.', trim($_GET['confirm']));
                $query = $db->prepare("SELECT `id` FROM `users` WHERE `id` = ? AND `password` = ?");
                $query->execute(array($confirm[0], $confirm[1]));
                $isUser = $query->fetchAll(PDO::FETCH_ASSOC);
                if (!$isUser){
                    $data['status'] = 'error';
                    $data['msg']    = "Помилка! Такого користувача не знайдено.";
                }
                else{
                    $query = $db->prepare("UPDATE `users` SET `confirm` = '1' WHERE `id` = ? AND `password` = ?");
                    $query->execute(array($confirm[0], $confirm[1]));
                    $data['status'] = 'success';
                    $data['msg']    = "Готово! Email успішно підтверджено.";
                }
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'resetPassword':
            if (!getAccess($db)){
                $reset = explode('.', trim($_GET['reset']));
                $query = $db->prepare("SELECT `id`, `email` FROM `users` WHERE `id` = ? AND `password` = ?");
                $query->execute(array($reset[0], $reset[1]));
                $isUser = $query->fetchAll(PDO::FETCH_ASSOC);
                if (!$isUser){
                    $data['status'] = 'error';
                    $data['msg']    = "Помилка! Такого користувача не знайдено.";
                }
                else{
                    $isUser = $isUser[0];
                    $password = md5($salt . md5($defaultPassword) . $salt);
                    $query = $db->prepare("UPDATE `users` SET `password` = ? WHERE `id` = ? AND `password` = ?");
                    $query->execute(array($password, $reset[0], $reset[1]));
                    $subject = 'TrackMoney.com.ua - Ваш пароль змінено';
                    $mail = "Ваш новий пароль:\n".$defaultPassword."\n Будь ласка, зразу змініть його, як тільки авторизуєтесь, оскільки це дуже не надійний пароль.";
                    mail($isUser['email'], $subject, $mail);
                    $data['status'] = 'success';
                    $data['msg']    = "Готово! Пароль успішно змінено.";
                }
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'getProfile':
            if (getAccess($db)){
                $uid = getUID();
                $query = $db->prepare("SELECT *, DATE_FORMAT(`created`, '%d.%m.%Y') AS `created` FROM `users` WHERE `id` = ?");
                $query->execute(array($uid));
                $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
                $data['arr'] = $data['arr'][0];
                $data['status'] = 'success';
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'editPassword':
            if (getAccess($db)){
                $uid = getUID();
                $password = trim($request->password);
                $newPassword = trim($request->newPassword);
                $confirmPassword = trim($request->confirmPassword);
                if (!$password || !$newPassword || !$confirmPassword){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Поля "Актуальний пароль", "Новий пароль" та "Повтор нового паролю" обов\'язкові для заповнення!';
                }
                elseif ($newPassword != $confirmPassword){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення поля "Новий пароль" та "Повтор нового паролю" мають бути однаковими!';
                }
                else{
                    $password = md5($salt . md5($password) . $salt);
                    $newPassword = md5($salt . md5($newPassword) . $salt);
    				$query = $db->prepare("SELECT `id` FROM `users` WHERE `id` = ? AND `password` = ?");
    				$query->execute(array($uid, $password));
                    $isUser = $query->fetchAll(PDO::FETCH_ASSOC);
                    if (!$isUser){
                        $data['status'] = 'error';
                        $data['msg']    = "Помилка! Невірний актуальний пароль.";
                    }
                    else{
                        $query = $db->prepare("UPDATE `users` SET `password` = ? WHERE `id` = ?");
        				$query->execute(array($newPassword, $uid));
                        $data['status'] = 'success';
                        $data['msg']    = "Готово! Пароль успішно змінено, наступний раз при авторизації вводьте новий пароль.";
                    }
                }
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'removeAccount':
            if (getAccess($db)){
                $uid = getUID();
                $query = $db->prepare("DELETE FROM `accounts` WHERE `uid` = ?");
                $query->execute(array($uid));
                $query = $db->prepare("DELETE FROM `actions` WHERE `uid` = ?");
                $query->execute(array($uid));
                $query = $db->prepare("DELETE FROM `budgets` WHERE `uid` = ?");
                $query->execute(array($uid));
                $query = $db->prepare("DELETE FROM `categories` WHERE `uid` = ?");
                $query->execute(array($uid));
                $query = $db->prepare("DELETE FROM `users` WHERE `id` = ?");
                $query->execute(array($uid));
                $data['status'] = 'success';
                $data['msg']    = "Готово! Ваш акаунт успішно видалений, дякуємо, що користувались сервісом.";
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;



        case 'getPosts':
            if (getAccess($db)){
                $from = trim($_GET['from']);
                $count = trim($_GET['count']);
                $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
                $query = $db->prepare("
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
                ");
                $query->execute(array());
                $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
                $data['isAdmin'] = isAdmin($db, getUID());
                $data['status'] = 'success';
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'getPost':
            if (getAccess($db)){
                $id = trim($_GET['id']);
                $query = $db->prepare("
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
                ");
                $query->execute(array($id));
                $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
                if (!$data['arr']){
                    $data['msg'] = 'Помилка! Такого посту немає!';
                    $data['status'] = 'error';
                }
                else{
                    $data['arr'] = $data['arr'][0];
                    $query = $db->prepare("
                        SELECT
                            `fc`.*,
                            DATE_FORMAT(`fc`.`created`, '%d.%m.%Y') AS `created`,
                            IFNULL(`u`.`email`, 'Користувач видалений') AS `email`,
                            `u`.`admin`
                        FROM `forum_comments` AS `fc`
                            LEFT JOIN `users` AS `u` ON (`u`.`id` = `fc`.`uid`)
                        WHERE `fc`.`fid` = ?
                    ");
                    $query->execute(array($id));
                    $data['arr']['comments'] = $query->fetchAll(PDO::FETCH_ASSOC);
                    $data['isAdmin'] = isAdmin($db, getUID());
                    $data['status'] = 'success';
                }
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'addPost':
            if (getAccess($db)){
                $uid = getUID();
                $title = trim($request->title);
                $category = trim($request->category);
                $comment = trim($request->comment);
                if (!$title || !$category || !$comment){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Поля "Тема", "Категорія" та "Перший коментар" обов\'язкові для заповнення!';
                }
                else{
                    $date = date("Y-m-d H:i:s");
                    $query = $db->prepare("INSERT INTO `forum` (`uid`, `uid_upd`, `title`, `category`, `created`, `updated`) VALUES(?, ?, ?, ?, ?, ?)");
                    $query->execute(array($uid, $uid, $title, $category, $date, $date));
                    $id = $db->lastInsertId();
                    $query = $db->prepare("INSERT INTO `forum_comments` (`fid`, `uid`, `created`, `comment`) VALUES(?, ?, ?, ?)");
                    $query->execute(array($id, $uid, $date, $comment));
                    $query = $db->prepare("
                        SELECT
                            `f`.*,
                            DATE_FORMAT(`f`.`created`, '%d.%m.%Y') AS `created`,
                            DATE_FORMAT(`f`.`updated`, '%d.%m.%Y') AS `updated`,
                            `u`.`email`,
                            `u`.`admin`,
                            `uu`.`email` AS `email_upd`,
                            `uu`.`admin` AS `admin_upd`,
                            (SELECT COUNT(*) FROM `forum_comments` WHERE `fid` = `f`.`id`) AS `count`
                        FROM `forum` AS `f`
                            LEFT JOIN `users` AS `u` ON (`u`.`id` = `f`.`uid`)
                            LEFT JOIN `users` AS `uu` ON (`uu`.`id` = `f`.`uid_upd`)
                        WHERE `f`.`id` = ?
                    ");
                    $query->execute(array($id));
                    $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
                    $data['arr'] = $data['arr'][0];
                    $subject = 'TrackMoney.com.ua - Нове повідомлення на форумі';
                    $mail = 'Новий пост на форумі, для перегляду перейдіть за посиланням: http://trackmoney.com.ua/#/forum/'.$id;
                    mail('lysenkoa86@gmail.com', $subject, $mail);
                    $data['status'] = 'success';
                    $data['msg']    = "Готово! Пост успішно доданий.";
                }
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'addComment':
            if (getAccess($db)){
                $uid = getUID();
                $fid = trim($request->fid);
                $comment = trim($request->comment);
                if (!$comment){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Поле "Коментар" обов\'язкове для заповнення!';
                }
                else{
                    $date = date("Y-m-d H:i:s");
                    $query = $db->prepare("INSERT INTO `forum_comments` (`fid`, `uid`, `created`, `comment`) VALUES(?, ?, ?, ?)");
                    $query->execute(array($fid, $uid, $date, $comment));
                    $id = $db->lastInsertId();
                    $query = $db->prepare("UPDATE `forum` SET `uid_upd` = ?, `updated` = ? WHERE `id` = ?");
                    $query->execute(array($uid, $date, $fid));
                    $query = $db->prepare("
                        SELECT
                            `fc`.*,
                            DATE_FORMAT(`fc`.`created`, '%d.%m.%Y') AS `created`,
                            `u`.`email`,
                            (SELECT `f`.`uid` FROM `forum` AS `f` WHERE `f`.`id` = `fc`.`fid`) AS `uid_created`,
                            (SELECT `u`.`email` FROM `users` AS `u` WHERE `u`.`id` = `uid_created`) AS `email_created`
                        FROM `forum_comments` AS `fc`
                            LEFT JOIN `users` AS `u` ON (`u`.`id` = `fc`.`uid`)
                        WHERE `fc`.`id` = ?
                    ");
                    $query->execute(array($id));
                    $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
                    $data['arr'] = $data['arr'][0];
                    $subject = 'TrackMoney.com.ua - Нове повідомлення на форумі';
                    $mail = 'Нове повідомлення на форумі, для перегляду перейдіть за посиланням: http://trackmoney.com.ua/#/forum/'.$fid;
                    mail('lysenkoa86@gmail.com', $subject, $mail);
                    mail($data['arr']['email_created'], $subject, $mail);
                    $data['status'] = 'success';
                    $data['msg']    = "Готово! Коментар успішно доданий.";
                }
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'setPostStatus':
            if (getAccess($db) && isAdmin($db, getUID())){
                $id = trim($request->id);
                $status = trim($request->status);
                $query = $db->prepare("UPDATE `forum` SET `status` = ? WHERE `id` = ?");
                $query->execute(array($status, $id));
                $data['arr']['id'] = $id;
                $data['arr']['status'] = $status;
                $data['status'] = 'success';
                $data['msg']    = "Готово! Статус поста успішно змінено.";
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;



        case 'getActions':
            if (getAccess($db)){
                $uid = getUID();
                $from = trim($_GET['from']);
                $count = trim($_GET['count']);
                $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
                $query = $db->prepare("
                    SELECT
                        `a`.*,
                        DATE_FORMAT(`a`.`date`, '%d.%m.%Y') AS `date`,
                        IFNULL(`a1`.`title`, 'Рахунок видалений') AS `accountFrom_title`,
                        IFNULL(`a2`.`title`, 'Рахунок видалений') AS `accountTo_title`,
                        IFNULL(`c`.`title`, 'Категорія видалена') AS `category_title`
                    FROM `actions` AS `a`
                        LEFT JOIN `accounts` AS `a1` ON (`a1`.`id` = `a`.`accountFrom_id`)
                        LEFT JOIN `accounts` AS `a2` ON (`a2`.`id` = `a`.`accountTo_id`)
                        LEFT JOIN `categories` AS `c` ON (`c`.`id` = `a`.`category_id`)
                    WHERE `a`.`uid` = ?
                    ORDER BY `a`.`date` DESC, `a`.`id` DESC
                    LIMIT ?,?
                ");
                $query->execute(array($uid, $from, $count));
                $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
                $data['status'] = 'success';
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'getAction':
            if (getAccess($db)){
                $uid = getUID();
                $id = trim($_GET['id']);
                $query = $db->prepare("SELECT * FROM `actions` WHERE `id` = ? AND `uid` = ?");
                $query->execute(array($id, $uid));
                $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
                $data['arr'] = $data['arr'][0];
                $data['status'] = 'success';
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'addAction':
            if (getAccess($db)){
                $uid = getUID();
                $date = trim($request->date);
                $type = trim($request->type);
                $accountFrom_id = trim($request->accountFrom_id);
                $accountTo_id = trim($request->accountTo_id);
                $category_id = trim($request->category_id);
                $sum = trim($request->sum);
                $description = trim($request->description);
                if (!$type){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення поля "Тип" не може бути пустим!';
                }
                elseif ($type == 'move' && (!$date || !$accountFrom_id || !$accountTo_id || !$sum)){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення полів "Дата", "Звідки", "Куди" та "Сума" не може бути пустим!';
                }
                elseif ($type != 'move' && (!$date || !$accountFrom_id || !$category_id || !$sum)){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення полів "Дата", "Рахунок", "Категорія" та "Сума" не може бути пустим!';
                }
                elseif (!preg_match('/^\d{4}\-\d{2}\-\d{2}$/', $date)){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення поля "Дата" має бути наступного формату: 01.01.2017!';
                }
                elseif (!preg_match('/^[\d\.]+$/', $sum)){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення поля "Сума" має бути числовим!';
                }
                elseif (!in_array($type, array('plus', 'minus', 'move'))){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення поля "Тип" не корректне!';
                }
                else{
                    switch ($type){
                        case 'plus':
                            $query = $db->prepare("UPDATE `accounts` SET `balance` = `balance` + ? WHERE `id` = ?");
                            $query->execute(array($sum, $accountFrom_id));
                        break;
                        case 'minus':
                            $query = $db->prepare("UPDATE `accounts` SET `balance` = `balance` - ? WHERE `id` = ?");
                            $query->execute(array($sum, $accountFrom_id));
                        break;
                        case 'move':
                            $query = $db->prepare("UPDATE `accounts` SET `balance` = `balance` - ? WHERE `id` = ?");
                            $query->execute(array($sum, $accountFrom_id));
                            $query = $db->prepare("UPDATE `accounts` SET `balance` = `balance` + ? WHERE `id` = ?");
                            $query->execute(array($sum, $accountTo_id));
                        break;
                    }
                    $query = $db->prepare("INSERT INTO `actions` (`uid`, `date`, `type`, `accountFrom_id`, `accountTo_id`, `category_id`, `sum`, `description`) VALUES(?, ?, ?, ?, ?, ?, ?, ?)");
                    $query->execute(array($uid, $date, $type, $accountFrom_id, $accountTo_id, $category_id, $sum, $description));
                    $data['arr'] = array(
                        id    => $db->lastInsertId(),
                        uid => $uid,
                        date  => $date,
                        type   => $type,
                        accountFrom_id => $accountFrom_id,
                        accountTo_id => $accountTo_id,
                        category_id => $category_id,
                        sum => $sum,
                        description => $description
                    );
                    $data['status'] = 'success';
                    $data['msg']    = "Готово! Транзакція успішно додана.";
                }
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'editAction':
            if (getAccess($db)){
                $uid = getUID();
                $id = trim($request->id);
                $date = trim($request->date);
                $type = trim($request->type);
                $accountFrom_id = trim($request->accountFrom_id);
                $accountTo_id = trim($request->accountTo_id);
                $category_id = trim($request->category_id);
                $sum = trim($request->sum);
                $description = trim($request->description);
                if (!$type){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення поля "Тип" не може бути пустим!';
                }
                elseif ($type == 'move' && (!$date || !$accountFrom_id || !$accountTo_id || !$sum)){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення полів "Дата", "Звідки", "Куди" та "Сума" не може бути пустим!';
                }
                elseif ($type != 'move' && (!$date || !$accountFrom_id || !$category_id || !$sum)){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення полів "Дата", "Рахунок", "Категорія" та "Сума" не може бути пустим!';
                }
                elseif (!preg_match('/^\d{4}\-\d{2}\-\d{2}$/', $date)){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення поля "Дата" має бути наступного формату: 01.01.2017!';
                }
                elseif (!preg_match('/^[\d\.]+$/', $sum)){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення поля "Сума" має бути числовим!';
                }
                elseif (!in_array($type, array('plus', 'minus', 'move'))){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення поля "Тип" не корректне!';
                }
                else{
                    if ($id){
                        $query = $db->prepare("SELECT * FROM `actions` WHERE `id` = ?");
                        $query->execute(array($id));
                        $tmp = $query->fetchAll(PDO::FETCH_ASSOC);
                        $ttype = $tmp[0]['type'];
                        $ssum = $tmp[0]['sum'];
                        $aaccountFrom_id = $tmp[0]['accountFrom_id'];
                        $aaccountTo_id = $tmp[0]['accountTo_id'];
                        switch ($ttype){
                            case 'plus':
                                $query = $db->prepare("UPDATE `accounts` SET `balance` = `balance` - ? WHERE `id` = ?");
                                $query->execute(array($ssum, $aaccountFrom_id));
                            break;
                            case 'minus':
                                $query = $db->prepare("UPDATE `accounts` SET `balance` = `balance` + ? WHERE `id` = ?");
                                $query->execute(array($ssum, $aaccountFrom_id));
                            break;
                            case 'move':
                                $query = $db->prepare("UPDATE `accounts` SET `balance` = `balance` + ? WHERE `id` = ?");
                                $query->execute(array($ssum, $aaccountFrom_id));
                                $query = $db->prepare("UPDATE `accounts` SET `balance` = `balance` - ? WHERE `id` = ?");
                                $query->execute(array($ssum, $aaccountTo_id));
                            break;
                        }
                        switch ($type){
                            case 'plus':
                                $query = $db->prepare("UPDATE `accounts` SET `balance` = `balance` + ? WHERE `id` = ?");
                                $query->execute(array($sum, $accountFrom_id));
                            break;
                            case 'minus':
                                $query = $db->prepare("UPDATE `accounts` SET `balance` = `balance` - ? WHERE `id` = ?");
                                $query->execute(array($sum, $accountFrom_id));
                            break;
                            case 'move':
                                $query = $db->prepare("UPDATE `accounts` SET `balance` = `balance` - ? WHERE `id` = ?");
                                $query->execute(array($sum, $accountFrom_id));
                                $query = $db->prepare("UPDATE `accounts` SET `balance` = `balance` + ? WHERE `id` = ?");
                                $query->execute(array($sum, $accountTo_id));
                            break;
                        }
                        $query = $db->prepare("UPDATE `actions` SET `date` = ?, `type` = ?, `accountFrom_id` = ?, `accountTo_id` = ?, `category_id` = ?, `sum` = ?, `description` = ? WHERE `id` = ? AND `uid` = ?");
                        $query->execute(array($date, $type, $accountFrom_id, $accountTo_id, $category_id, $sum, $description, $id, $uid));
                        $data['arr'] = array(
                            id    => $id,
                            uid => $uid,
                            date  => $date,
                            type   => $type,
                            accountFrom_id => $accountFrom_id,
                            accountTo_id => $accountTo_id,
                            category_id => $category_id,
                            sum => $sum,
                            description => $description
                        );
                        $data['status'] = 'success';
                        $data['msg']    = "Готово! Транзакція успішно змінена.";
                    }
                    else{
                        switch ($type){
                            case 'plus':
                                $query = $db->prepare("UPDATE `accounts` SET `balance` = `balance` + ? WHERE `id` = ?");
                                $query->execute(array($sum, $accountFrom_id));
                            break;
                            case 'minus':
                                $query = $db->prepare("UPDATE `accounts` SET `balance` = `balance` - ? WHERE `id` = ?");
                                $query->execute(array($sum, $accountFrom_id));
                            break;
                            case 'move':
                                $query = $db->prepare("UPDATE `accounts` SET `balance` = `balance` - ? WHERE `id` = ?");
                                $query->execute(array($sum, $accountFrom_id));
                                $query = $db->prepare("UPDATE `accounts` SET `balance` = `balance` + ? WHERE `id` = ?");
                                $query->execute(array($sum, $accountTo_id));
                            break;
                        }
                        $query = $db->prepare("INSERT INTO `actions` (`uid`, `date`, `type`, `accountFrom_id`, `accountTo_id`, `category_id`, `sum`, `description`) VALUES(?, ?, ?, ?, ?, ?, ?, ?)");
                        $query->execute(array($uid, $date, $type, $accountFrom_id, $accountTo_id, $category_id, $sum, $description));
                        $data['arr'] = array(
                            id    => $db->lastInsertId(),
                            date  => $date,
                            uid  => $uid,
                            type   => $type,
                            accountFrom_id => $accountFrom_id,
                            accountTo_id => $accountTo_id,
                            category_id => $category_id,
                            sum => $sum,
                            description => $description
                        );
                        $data['status'] = 'success';
                        $data['msg']    = "Готово! Транзакція успішно змінена.";
                    }
                }
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'delAction':
            if (getAccess($db)){
                $uid = getUID();
                $id = trim($request->id);
                $query = $db->prepare("SELECT * FROM `actions` WHERE `id` = ?");
                $query->execute(array($id));
                $tmp = $query->fetchAll(PDO::FETCH_ASSOC);
                $type = $tmp[0]['type'];
                $sum = $tmp[0]['sum'];
                $accountFrom_id = $tmp[0]['accountFrom_id'];
                $accountTo_id = $tmp[0]['accountTo_id'];
                switch ($type){
                    case 'plus':
                        $query = $db->prepare("UPDATE `accounts` SET `balance` = `balance` - ? WHERE `id` = ?");
                        $query->execute(array($sum, $accountFrom_id));
                    break;
                    case 'minus':
                        $query = $db->prepare("UPDATE `accounts` SET `balance` = `balance` + ? WHERE `id` = ?");
                        $query->execute(array($sum, $accountFrom_id));
                    break;
                    case 'move':
                        $query = $db->prepare("UPDATE `accounts` SET `balance` = `balance` + ? WHERE `id` = ?");
                        $query->execute(array($sum, $accountFrom_id));
                        $query = $db->prepare("UPDATE `accounts` SET `balance` = `balance` - ? WHERE `id` = ?");
                        $query->execute(array($sum, $accountTo_id));
                    break;
                }
                $query = $db->prepare("DELETE FROM `actions` WHERE `id` = ? AND `uid` = ?");
                $query->execute(array($id, $uid));
                $data['status'] = 'success';
                $data['msg']    = "Готово! Транзакція успішно видалена.";
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;



        case 'getCategories':
            if (getAccess($db)){
                $uid = getUID();
                $query = $db->prepare("SELECT * FROM `categories` WHERE `uid` = ? ORDER BY `type` ASC, `title` ASC");
                $query->execute(array($uid));
                $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
                $data['status'] = 'success';
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'getCategory':
            if (getAccess($db)){
                $uid = getUID();
                $id = trim($_GET['id']);
                $query = $db->prepare("SELECT * FROM `categories` WHERE `id` = ? AND `uid` = ?");
                $query->execute(array($id, $uid));
                $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
                $data['arr'] = $data['arr'][0];
                $data['status'] = 'success';
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'addCategory':
            if (getAccess($db)){
                $uid = getUID();
                $title = trim($request->title);
                $type = trim($request->type);
                if (!$title || !$type){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення полів "Назва" та "Тип" не може бути пустим!';
                }
                else{
                    $query = $db->prepare("INSERT INTO `categories` (`uid`, `title`, `type`) VALUES(?, ?, ?)");
                    $query->execute(array($uid, $title, $type));
                    $data['arr'] = array(
                        id    => $db->lastInsertId(),
                        uid => $uid,
                        title => $title,
                        type  => $type
                    );
                    $data['status'] = 'success';
                    $data['msg']    = "Готово! Категорія успішно додана.";
                }
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'editCategory':
            if (getAccess($db)){
                $uid = getUID();
                $id = trim($request->id);
                $title = trim($request->title);
                $type = trim($request->type);
                if (!$title || !$type){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення полів "Назва" та "Тип" не може бути пустим!';
                }
                else{
                    $query = $db->prepare("UPDATE `categories` SET `title` = ?, `type` = ? WHERE `id` = ? AND `uid` = ?");
                    $query->execute(array($title, $type, $id, $uid));
                    $data['arr'] = array(
                        id    => $id,
                        uid => $uid,
                        title => $title,
                        type  => $type
                    );
                    $data['status'] = 'success';
                    $data['msg']    = "Готово! Категорія успішно змінена.";
                }
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'delCategory':
            if (getAccess($db)){
                $uid = getUID();
                $id = trim($request->id);
                $query = $db->prepare("SELECT COUNT(*) AS `count` FROM `actions` WHERE `category_id` = ?");
                $query->execute(array($id));
                $count = $query->fetchAll(PDO::FETCH_ASSOC);
                $count = $count[0]['count'];
                if ($count > 0){
                    $data['status'] = 'error';
                    $data['msg']    = "Помилка! Категорія використовується у $count транзакції(ях), спочатку треба видалити транзакції!";
                }
                else{
                    $query = $db->prepare("DELETE FROM `categories` WHERE `id` = ? AND `uid` = ?");
                    $query->execute(array($id, $uid));
                    $data['status'] = 'success';
                    $data['msg']    = "Готово! Категорія успішно видалена.";
                }
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;



        case 'getAccounts':
            if (getAccess($db)){
                $uid = getUID();
                $query = $db->prepare("SELECT * FROM `accounts` WHERE `uid` = ? ORDER BY `title` ASC");
                $query->execute(array($uid));
                $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
                $data['status'] = 'success';
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'getAccount':
            if (getAccess($db)){
                $uid = getUID();
                $id = trim($_GET['id']);
                $query = $db->prepare("SELECT * FROM `accounts` WHERE `id` = ? AND `uid` = ?");
                $query->execute(array($id, $uid));
                $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
                $data['arr'] = $data['arr'][0];
                $data['status'] = 'success';
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'addAccount':
            if (getAccess($db)){
                $uid = getUID();
                $title = trim($request->title);
                $balance = trim($request->balance);
                if (!$title || $balance == ''){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення полів "Назва" та "Баланс" не може бути пустим!';
                }
                elseif (!preg_match('/^[\-\+\d\.]+$/', $balance)){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення поля "Баланс" має бути числовим!';
                }
                else{
                    $query = $db->prepare("INSERT INTO `accounts` (`uid`, `title`, `balance`) VALUES(?, ?, ?)");
                    $query->execute(array($uid, $title, $balance));
                    $data['arr'] = array(
                        id    => $db->lastInsertId(),
                        uid => $uid,
                        title => $title,
                        balance  => $balance
                    );
                    $data['status'] = 'success';
                    $data['msg']    = "Готово! Рахунок успішно доданий.";
                }
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'editAccount':
            if (getAccess($db)){
                $uid = getUID();
                $id = trim($request->id);
                $title = trim($request->title);
                $balance = trim($request->balance);
                if (!$title || $balance == ''){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення полів "Назва" та "Баланс" не може бути пустим!';
                }
                elseif (!preg_match('/^[\-\+\d\.]+$/', $balance)){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення поля "Баланс" має бути числовим!';
                }
                else{
                    $query = $db->prepare("UPDATE `accounts` SET `title` = ?, `balance` = ? WHERE `id` = ? AND `uid` = ?");
                    $query->execute(array($title, $balance, $id, $uid));
                    $data['arr'] = array(
                        id    => $id,
                        uid => $uid,
                        title => $title,
                        balance  => $balance
                    );
                    $data['status'] = 'success';
                    $data['msg']    = "Готово! Рахунок успішно змінений.";
                }
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'delAccount':
            if (getAccess($db)){
                $uid = getUID();
                $id = trim($request->id);
                $query = $db->prepare("SELECT COUNT(*) AS `count` FROM `actions` WHERE `accountFrom_id` = ? OR `accountTo_id` = ?");
                $query->execute(array($id, $id));
                $count = $query->fetchAll(PDO::FETCH_ASSOC);
                $count = $count[0]['count'];
                if ($count > 0){
                    $data['status'] = 'error';
                    $data['msg']    = "Помилка! Рахунок використовується у $count транзакції(ях), спочатку треба видалити транзакції!";
                }
                else{
                    $query = $db->prepare("DELETE FROM `accounts` WHERE `id` = ? AND `uid` = ?");
                    $query->execute(array($id, $uid));
                    $data['status'] = 'success';
                    $data['msg']    = "Готово! Рахунок успішно видалений.";
                }
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;



        case 'getBudget':
            if (getAccess($db)){
                $uid = getUID();
                $month = trim($_GET['month']);
                $year = trim($_GET['year']);
                $query = $db->prepare("
                    SELECT
                        `b`.`id`,
                        `b`.`category_id`,
                        IFNULL(`c`.`title`, 'Категорія видалена') AS `category_title`,
                        `c`.`type`,
                        ROUND(`b`.`sum`) AS `plan`,
                        ROUND(IFNULL((SELECT SUM(`sum`) FROM `actions` WHERE `uid` = ? AND `category_id` = `b`.`category_id` AND MONTH(`date`) = ? AND YEAR(`date`) = ?), 0)) AS `fact`
                    FROM `budgets` AS `b`
                        LEFT JOIN `categories` AS `c` ON (`c`.`id` = `b`.`category_id`)
                    WHERE `b`.`uid` = ? AND `b`.`month` = ? AND `b`.`year` = ?
                    ORDER BY `category_title` ASC
                ");
                $query->execute(array($uid, $month, $year, $uid, $month, $year));
                $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
                $data['status'] = 'success';
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'getBudgetCategory':
            if (getAccess($db)){
                $uid = getUID();
                $id = trim($_GET['id']);
                $query = $db->prepare("SELECT * FROM `budgets` WHERE `id` = ? AND `uid` = ?");
                $query->execute(array($id, $uid));
                $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
                $data['arr'] = $data['arr'][0];
                $data['status'] = 'success';
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'addBudgetCategory':
            if (getAccess($db)){
                $uid = getUID();
                $month = trim($request->month);
                $year = trim($request->year);
                $category_id = trim($request->category_id);
                $sum = trim($request->sum);
                if (!$month || !$year || !$category_id || !$sum){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення полів "Місяць", "Рік", "Категорія" та "Сума" не може бути пустим!';
                }
                elseif (!preg_match('/^[\d\.]+$/', $year)){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення поля "Рік" має бути числовим!';
                }
                elseif (!preg_match('/^[\d\.]+$/', $sum)){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення поля "Сума" має бути числовим!';
                }
                else{
                    $query = $db->prepare("SELECT COUNT(*) AS `count` FROM `budgets` WHERE `uid` = ? AND `month` = ? AND `year` = ? AND `category_id` = ?");
                    $query->execute(array($uid, $month, $year, $category_id));
                    $count = $query->fetchAll(PDO::FETCH_ASSOC);
                    $count = $count[0]['count'];
                    if ($count > 0){
                        $data['status'] = 'error';
                        $data['msg']    = "Помилка! Дана категорія в бюджеті на вибраний місяць і рік вже присутня, спочатку треба видалити її!";
                    }
                    else{
                        $query = $db->prepare("INSERT INTO `budgets` (`uid`, `month`, `year`, `category_id`, `sum`) VALUES(?, ?, ?, ?, ?)");
                        $query->execute(array($uid, $month, $year, $category_id, $sum));
                        $data['arr'] = array(
                            id    => $db->lastInsertId(),
                            uid => $uid,
                            month => $month,
                            year  => $year,
                            category_id  => $category_id,
                            sum  => $sum
                        );
                        $data['status'] = 'success';
                        $data['msg']    = "Готово! Категорія успішно додана.";
                    }
                }
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'editBudgetCategory':
            if (getAccess($db)){
                $uid = getUID();
                $id = trim($request->id);
                $month = trim($request->month);
                $year = trim($request->year);
                $category_id = trim($request->category_id);
                $sum = trim($request->sum);
                if (!$month || !$year || !$category_id || !$sum){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення полів "Місяць", "Рік", "Категорія" та "Сума" не може бути пустим!';
                }
                elseif (!preg_match('/^[\d\.]+$/', $year)){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення поля "Рік" має бути числовим!';
                }
                elseif (!preg_match('/^[\d\.]+$/', $sum)){
                    $data['status'] = 'error';
                    $data['msg']    = 'Помилка! Значення поля "Сума" має бути числовим!';
                }
                else{
                    $query = $db->prepare("UPDATE `budgets` SET `month` = ?, `year` = ?, `category_id` = ?, `sum` = ? WHERE `id` = ? AND `uid` = ?");
                    $query->execute(array($month, $year, $category_id, $sum, $id, $uid));
                    $data['arr'] = array(
                        id    => $id,
                        uid   => $uid,
                        month => $month,
                        year  => $year,
                        category_id  => $category_id,
                        sum  => $sum
                    );
                    $data['status'] = 'success';
                    $data['msg']    = "Готово! Категорія успішно змінена.";
                }
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;
        case 'delBudgetCategory':
            if (getAccess($db)){
                $uid = getUID();
                $id = trim($request->id);
                $query = $db->prepare("DELETE FROM `budgets` WHERE `id` = ? AND `uid` = ?");
                $query->execute(array($id, $uid));
                $data['status'] = 'success';
                $data['msg']    = "Готово! Категорія успішно видалена.";
            }
            else{
                $data['msg'] = 'Помилка! Немає доступу!';
                $data['status'] = 'error';
            }
        break;



        case 'none':
            $data['arr']    = false;
            $data['status'] = 'error';
            $data['msg']    = "Error! Action is undefined.";
        break;
        default:
            $data['arr']    = false;
            $data['status'] = 'error';
            $data['msg']    = "Error! Action '$action' is undeclarated.";
        break;



    }

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST');
    header('Access-Control-Allow-Headers: Content-Type');
    echo json_encode($data);

    $db = null;
?>
