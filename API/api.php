<?php
    require_once('db.php');
    require_once('router.php');

    require_once('controllers/admins.php');
    require_once('controllers/users.php');
    require_once('controllers/forum.php');
    require_once('controllers/actions.php');
    require_once('controllers/categories.php');
    require_once('controllers/accounts.php');
    require_once('controllers/budgets.php');
    require_once('controllers/properties.php');



    $officialEmail = 'INFO@TrackMoney.com.ua';
    $data   = ['status' => '', 'msg' => '', 'arr' => []];
    $db     = new Db;
    $router = new Router;

    $dbError = $db->connect();

    if ($dbError == 'requestMySQLError'){
        $data['arr']    = false;
        $data['status'] = 'error';
        $data['msg']    = 'Помилка! Не можу підключитись до бази даних.';
	}
    elseif (!$router->checkAction()){
        $data['arr']    = false;
        $data['status'] = 'error';
        $data['msg']    = 'Помилка! Методу "'.$router->getAction().'" в API не існує.';
	}
	elseif (!$router->checkAccess($db)){
        $data['arr']    = false;
        $data['status'] = 'error';
        $data['msg']    = 'Помилка! Доступ заборонено!';
	}
    else{
        $ctrl   = $router->getController();
        $method = $router->getMethod();
        $params = $router->getParams();
        $ctrl   = new $ctrl($params, $data, $db);
        $ctrl->$method();
    }

    $db->disconnect();



    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST');
    header('Access-Control-Allow-Headers: Content-Type');
    echo json_encode($data);
    exit;
?>
