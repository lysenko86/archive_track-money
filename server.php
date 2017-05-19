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



		case 'getActions':
            $query = $db->prepare("
				SELECT
					`a`.*,
					DATE_FORMAT(`a`.`date`, '%d.%m.%Y') as `date`,
					IFNULL(`a1`.`title`, 'Рахунок видалений') as `accountFrom_title`,
					IFNULL(`a2`.`title`, 'Рахунок видалений') as `accountTo_title`,
					IFNULL(`c`.`title`, 'Категорія видалена') as `category_title`
				FROM `actions` AS `a`
					LEFT JOIN `accounts` AS `a1` ON (`a1`.`id` = `a`.`accountFrom_id`)
					LEFT JOIN `accounts` AS `a2` ON (`a2`.`id` = `a`.`accountTo_id`)
					LEFT JOIN `categories` AS `c` ON (`c`.`id` = `a`.`category_id`)
				ORDER BY `a`.`date` DESC
			");
            $query->execute();
            $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
			$data['status'] = 'success';
        break;
		case 'getAction':
			$id = trim($_GET['id']);
            $query = $db->prepare("SELECT * FROM `actions` WHERE `id` = ?");
            $query->execute(array($id));
            $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
			$data['arr'] = $data['arr'][0];
			$data['status'] = 'success';
        break;
		case 'addAction':
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
				$query = $db->prepare("INSERT INTO `actions` (`date`, `type`, `accountFrom_id`, `accountTo_id`, `category_id`, `sum`, `description`) VALUES(?, ?, ?, ?, ?, ?, ?)");
				$query->execute(array($date, $type, $accountFrom_id, $accountTo_id, $category_id, $sum, $description));
				$data['arr'] = array(
					id    => $db->lastInsertId(),
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
        break;
		case 'editAction':
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
				$query = $db->prepare("UPDATE `actions` SET `date` = ?, `type` = ?, `accountFrom_id` = ?, `accountTo_id` = ?, `category_id` = ?, `sum` = ?, `description` = ? WHERE `id` = ?");
				$query->execute(array($date, $type, $accountFrom_id, $accountTo_id, $category_id, $sum, $description, $id));
				$data['arr'] = array(
					id    => $id,
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
        break;
		case 'delAction':
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
			$query = $db->prepare("DELETE FROM `actions` WHERE `id` = ?");
            $query->execute(array($id));
			$data['status'] = 'success';
			$data['msg']    = "Готово! Транзакція успішно видалена.";
        break;



		case 'getCategories':
            $query = $db->prepare("SELECT * FROM `categories` ORDER BY `type` ASC, `title` ASC");
            $query->execute();
            $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
			$data['status'] = 'success';
        break;
		case 'getCategory':
			$id = trim($_GET['id']);
            $query = $db->prepare("SELECT * FROM `categories` WHERE `id` = ?");
            $query->execute(array($id));
            $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
			$data['arr'] = $data['arr'][0];
			$data['status'] = 'success';
        break;
		case 'addCategory':
            $title = trim($request->title);
            $type = trim($request->type);
			if (!$title || !$type){
                $data['status'] = 'error';
                $data['msg']    = 'Помилка! Значення полів "Назва" та "Тип" не може бути пустим!';
            }
            else{
				$query = $db->prepare("INSERT INTO `categories` (`title`, `type`) VALUES(?, ?)");
				$query->execute(array($title, $type));
				$data['arr'] = array(
					id    => $db->lastInsertId(),
					title => $title,
					type  => $type
				);
				$data['status'] = 'success';
				$data['msg']    = "Готово! Категорія успішно додана.";
            }
        break;
		case 'editCategory':
            $id = trim($request->id);
			$title = trim($request->title);
            $type = trim($request->type);
			if (!$title || !$type){
                $data['status'] = 'error';
                $data['msg']    = 'Помилка! Значення полів "Назва" та "Тип" не може бути пустим!';
            }
            else{
				$query = $db->prepare("UPDATE `categories` SET `title` = ?, `type` = ? WHERE `id` = ?");
				$query->execute(array($title, $type, $id));
				$data['arr'] = array(
					id    => $id,
					title => $title,
					type  => $type
				);
				$data['status'] = 'success';
				$data['msg']    = "Готово! Категорія успішно змінена.";
            }
        break;
		case 'delCategory':
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
				$query = $db->prepare("DELETE FROM `categories` WHERE `id` = ?");
				$query->execute(array($id));
				$data['status'] = 'success';
				$data['msg']    = "Готово! Категорія успішно видалена.";
			}
        break;



		case 'getAccounts':
            $query = $db->prepare("SELECT * FROM `accounts` ORDER BY `title` ASC");
            $query->execute();
            $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
			$data['status'] = 'success';
        break;
		case 'getAccount':
			$id = trim($_GET['id']);
            $query = $db->prepare("SELECT * FROM `accounts` WHERE `id` = ?");
            $query->execute(array($id));
            $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
			$data['arr'] = $data['arr'][0];
			$data['status'] = 'success';
        break;
		case 'addAccount':
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
				$query = $db->prepare("INSERT INTO `accounts` (`title`, `balance`) VALUES(?, ?)");
				$query->execute(array($title, $balance));
				$data['arr'] = array(
					id    => $db->lastInsertId(),
					title => $title,
					balance  => $balance
				);
				$data['status'] = 'success';
				$data['msg']    = "Готово! Рахунок успішно доданий.";
            }
        break;
		case 'editAccount':
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
				$query = $db->prepare("UPDATE `accounts` SET `title` = ?, `balance` = ? WHERE `id` = ?");
				$query->execute(array($title, $balance, $id));
				$data['arr'] = array(
					id    => $id,
					title => $title,
					balance  => $balance
				);
				$data['status'] = 'success';
				$data['msg']    = "Готово! Рахунок успішно змінений.";
            }
        break;
		case 'delAccount':
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
				$query = $db->prepare("DELETE FROM `accounts` WHERE `id` = ?");
				$query->execute(array($id));
				$data['status'] = 'success';
				$data['msg']    = "Готово! Рахунок успішно видалений.";
			}
        break;



		case 'getBudget':
			$month = trim($_GET['month']);
			$year = trim($_GET['year']);
            $query = $db->prepare("
				SELECT
					`b`.`id`,
					`b`.`category_id`,
					IFNULL(`c`.`title`, 'Категорія видалена') as `category_title`,
					`c`.`type`,
					`b`.`sum` AS `plan`,
					IFNULL((SELECT SUM(`sum`) FROM `actions` WHERE `category_id` = `b`.`category_id`), 0) AS `fact`
				FROM `budgets` AS `b`
					LEFT JOIN `categories` AS `c` ON (`c`.`id` = `b`.`category_id`)
				WHERE `b`.`month` = ? AND `b`.`year` = ?
				ORDER BY `b`.`id` DESC
			");
            $query->execute(array($month, $year));
            $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
			$data['status'] = 'success';
        break;
		case 'getBudgetCategory':
			$id = trim($_GET['id']);
            $query = $db->prepare("SELECT * FROM `budgets` WHERE `id` = ?");
            $query->execute(array($id));
            $data['arr'] = $query->fetchAll(PDO::FETCH_ASSOC);
			$data['arr'] = $data['arr'][0];
			$data['status'] = 'success';
        break;
		case 'addBudgetCategory':
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
				$query = $db->prepare("INSERT INTO `budgets` (`month`, `year`, `category_id`, `sum`) VALUES(?, ?, ?, ?)");
				$query->execute(array($month, $year, $category_id, $sum));
				$data['arr'] = array(
					id    => $db->lastInsertId(),
					month => $month,
					year  => $year,
					category_id  => $category_id,
					sum  => $sum
				);
				$data['status'] = 'success';
				$data['msg']    = "Готово! Категорія успішно додана.";
            }
        break;
		case 'editBudgetCategory':
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
				$query = $db->prepare("UPDATE `budgets` SET `month` = ?, `year` = ?, `category_id` = ?, `sum` = ? WHERE `id` = ?");
				$query->execute(array($month, $year, $category_id, $sum, $id));
				$data['arr'] = array(
					id    => $id,
					month => $month,
					year  => $year,
					category_id  => $category_id,
					sum  => $sum
				);
				$data['status'] = 'success';
				$data['msg']    = "Готово! Категорія успішно змінена.";
            }
        break;
		case 'delBudgetCategory':
			$id = trim($request->id);
            $query = $db->prepare("DELETE FROM `budgets` WHERE `id` = ?");
            $query->execute(array($id));
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