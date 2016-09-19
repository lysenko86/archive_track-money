<?php
    require_once('db.php');
    $db = new PDO("mysql:host=localhost;dbname=$dbName", $dbUser, $dbPass);
    $db->exec("set names utf8");

    $request = json_decode(file_get_contents('php://input'));
    $action = $_GET['action'] ? $_GET['action'] : ($request->action ? $request->action : 'none');
    $data = array(
        'status' => '',   // success, error
        'msg'    => '',   // status message
        'arr'    => array()   // JSON
    );
    switch ($action){



		case 'reg':
            $email = trim($request->email);
            $pass = trim($request->pass);
			$name = trim($request->name);
			$city = trim($request->city);
            $query = $db->prepare("SELECT `id` FROM `users` WHERE `email` = ?");
            $query->execute(array($email));
            $data['arr'] = $query->fetch(PDO::FETCH_ASSOC);
            if ($data['arr']){
                $data['status'] = 'error';
                $data['msg']    = "Помилка! Такий E-mail же зареєстровано.";
            }
            else{
				$query = $db->prepare("INSERT INTO `users` (`email`, `password`, `name`, `city`) VALUES(?, ?, ?, ?)");
				$query->execute(array($email, $pass, $name, $city));
                $data['status'] = 'success';
                $data['msg']    = "Готово! Ви успішно зареєструвались. Тепер ви можете увійти в систему за допомогою свого E-mail та пароля.";
            }
			$data['arr'] = false;
        break;



        case 'login':
            $email = trim($request->email);
            $pass = trim($request->pass);
            $query = $db->prepare("SELECT `id`, `email`, `password` FROM `users` WHERE `email` = ? AND password = ?");
            $query->execute(array($email, $pass));
            $data['arr'] = $query->fetch(PDO::FETCH_ASSOC);
            if (!$data['arr']){
                $data['status'] = 'error';
                $data['msg']    = "Помилка! Такого користувача не зареєстровано.";
            }
            else{
                $data['status'] = 'success';
                $data['msg']    = "Готово! Ви успішно авторизувались.";
            }
        break;



		case 'getCategories':
            $uid = trim($_GET['uid']);
            $query = $db->prepare("SELECT * FROM `categories` WHERE `uid` = ? ORDER BY `title` ASC");
            $query->execute(array($uid));
            $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
			$data['status'] = 'success';
        break;



		case 'addCategory':
            $uid = trim($request->uid);
            $type = trim($request->type);
            $title = trim($request->title);
            $query = $db->prepare("INSERT INTO `categories` (`type`, `uid`, `title`) VALUES(?, ?, ?)");
            $query->execute(array($type, $uid, $title));
            $data['arr'] = array(
				id    => $db->lastInsertId(),
				type  => $type,
				uid   => $uid,
				title => $title
			);
			$data['status'] = 'success';
			$data['msg']    = "Готово! Категорія успішно додана.";
        break;



		case 'delCategory':
            $cid = trim($_GET['cid']);
            $query = $db->prepare("DELETE FROM `categories` WHERE `id` = ?");
            $query->execute(array($cid));
			$data['status'] = 'success';
			$data['msg']    = "Готово! Категорія успішно видалена.";
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
    
    echo json_encode($data);
    
    $db = null;
?>