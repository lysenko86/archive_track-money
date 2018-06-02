<?php
class Actions{
    private $params = [];
    private $data   = [];
    private $db     = NULL;
    function __construct($params, &$data, &$db){
        $this->params = $params;
        $this->data   = &$data;
        $this->db     = &$db;
    }
    function getActions(){
        if (!$this->params['timeInterval'] || !$this->params['start'] || !preg_match('/^\d{4}\-\d{2}\-\d{2}$/', $this->params['start'])){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Не коректний відрізок часу!';
        }
        else{
            $year  = substr($this->params['start'], 0, 4);
            $month = substr($this->params['start'], 5, 2);
            $day   = substr($this->params['start'], 8, 2);
            switch ($this->params['timeInterval']){
                case 'day': $timeInterval = " AND `a`.`date` > '".date("Y-m-d", mktime(0, 0, 0, $month, $day - 1, $year))."'"; break;
                case 'week': $timeInterval = " AND `a`.`date` > '".date("Y-m-d", mktime(0, 0, 0, $month, $day - 7, $year))."'"; break;
                case 'month': $timeInterval = " AND `a`.`date` > '".date("Y-m-d", mktime(0, 0, 0, $month - 1, $day, $year))."'"; break;
                case 'year': $timeInterval = " AND `a`.`date` > '".date("Y-m-d", mktime(0, 0, 0, $month, $day, $year - 1))."'"; break;
                case 'all': $timeInterval = ''; break;
            }
            $timeInterval = " AND `a`.`date` <= '{$this->params['start']}'$timeInterval";
            $searchBy = '';
            if ($this->params['searchBy']){
                $searchBy = explode('-', $this->params['searchBy']);
                if ($searchBy[0] == 'category'){
                    $searchBy = " AND `a`.`category_id` = '{$searchBy[1]}'";
                }
                elseif ($searchBy[0] == 'account'){
                    $searchBy = " AND (`a`.`accountFrom_id` = '{$searchBy[1]}' OR `a`.`accountTo_id` = '{$searchBy[1]}')";
                }
            }
            $searchText = $this->params['searchText'] ? " AND `a`.`description` LIKE '%{$this->params['searchText']}%'" : '';
            $this->data['arr'] = $this->db->query("
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
                WHERE `a`.`uid` = ?$timeInterval$searchBy$searchText
                ORDER BY `a`.`date` DESC, `a`.`id` DESC
            ", [$this->params['uid']], false);
            $this->data['status'] = 'success';
        }
    }
    function getAction(){
        $this->data['arr'] = $this->db->query(
            "SELECT * FROM `actions` WHERE `id` = ? AND `uid` = ?",
            [$this->params['id'], $this->params['uid']]
        );
        $this->data['arr']    = $this->data['arr'][0];
        $this->data['status'] = 'success';
    }
    function editAction(){
        if (!$this->params['type']){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Значення поля "Тип" не може бути пустим!';
        }
        elseif ($this->params['type'] == 'move' && (!$this->params['date'] || !$this->params['accountFrom_id'] || !$this->params['accountTo_id'])){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Значення полів "Дата", "Звідки" та "Куди" не може бути пустим!';
        }
        elseif ($this->params['type'] != 'move' && (!$this->params['date'] || !$this->params['accountFrom_id'] || !$this->params['category_id'])){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Значення полів "Дата", "Рахунок" та "Категорія" не може бути пустим!';
        }
        elseif (!preg_match('/^\d{4}\-\d{2}\-\d{2}$/', $this->params['date'])){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Значення поля "Дата" має бути наступного формату: дд.мм.рррр!';
        }
        elseif (!preg_match('/^[\d\.\+\-]+$/', $this->params['sum']) || $this->params['sum'] == '0'){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Значення поля "Сума" має бути числовим і не нуль!';
        }
        elseif (!in_array($this->params['type'], ['plus', 'minus', 'move'])){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Значення поля "Тип" не корректне!';
        }
        else{
            if ($this->params['id']){     // edit transaction
                $tmp             = $this->db->query("SELECT * FROM `actions` WHERE `id` = ?", [$this->params['id']]);
                $ttype           = $tmp[0]['type'];
                $ssum            = $tmp[0]['sum'];
                $aaccountFrom_id = $tmp[0]['accountFrom_id'];
                $aaccountTo_id   = $tmp[0]['accountTo_id'];
                switch ($ttype){
                    case 'plus': $this->db->query("UPDATE `accounts` SET `balance` = `balance` - ? WHERE `id` = ?", [$ssum, $aaccountFrom_id]); break;
                    case 'minus': $this->db->query("UPDATE `accounts` SET `balance` = `balance` + ? WHERE `id` = ?", [$ssum, $aaccountFrom_id]); break;
                    case 'move':
                        $this->db->query("UPDATE `accounts` SET `balance` = `balance` + ? WHERE `id` = ?", [$ssum, $aaccountFrom_id]);
                        $this->db->query("UPDATE `accounts` SET `balance` = `balance` - ? WHERE `id` = ?", [$ssum, $aaccountTo_id]);
                    break;
                }
                switch ($this->params['type']){
                    case 'plus': $this->db->query("UPDATE `accounts` SET `balance` = `balance` + ? WHERE `id` = ?", [$this->params['sum'], $this->params['accountFrom_id']]); break;
                    case 'minus': $this->db->query("UPDATE `accounts` SET `balance` = `balance` - ? WHERE `id` = ?", [$this->params['sum'], $this->params['accountFrom_id']]); break;
                    case 'move':
                        $this->db->query("UPDATE `accounts` SET `balance` = `balance` - ? WHERE `id` = ?", [$this->params['sum'], $this->params['accountFrom_id']]);
                        $this->db->query("UPDATE `accounts` SET `balance` = `balance` + ? WHERE `id` = ?", [$this->params['sum'], $this->params['accountTo_id']]);
                    break;
                }
                $this->db->query("
                    UPDATE `actions` SET `date` = ?, `type` = ?, `accountFrom_id` = ?, `accountTo_id` = ?, `category_id` = ?, `sum` = ?, `description` = ?
                    WHERE `id` = ? AND `uid` = ?
                ", [$this->params['date'], $this->params['type'], $this->params['accountFrom_id'], $this->params['accountTo_id'], $this->params['category_id'], $this->params['sum'], $this->params['description'], $this->params['id'], $this->params['uid']]);
                $this->data['msg'] = "Готово! Транзакція успішно змінена.";
            }
            else{     // add transaction
                switch ($this->params['type']){
                    case 'plus': $this->db->query("UPDATE `accounts` SET `balance` = `balance` + ? WHERE `id` = ?", [$this->params['sum'], $this->params['accountFrom_id']]); break;
                    case 'minus': $this->db->query("UPDATE `accounts` SET `balance` = `balance` - ? WHERE `id` = ?", [$this->params['sum'], $this->params['accountFrom_id']]); break;
                    case 'move':
                        $this->db->query("UPDATE `accounts` SET `balance` = `balance` - ? WHERE `id` = ?", [$this->params['sum'], $this->params['accountFrom_id']]);
                        $this->db->query("UPDATE `accounts` SET `balance` = `balance` + ? WHERE `id` = ?", [$this->params['sum'], $this->params['accountTo_id']]);
                    break;
                }
                $id = $this->db->query("
                    INSERT INTO `actions` (`uid`, `date`, `type`, `accountFrom_id`, `accountTo_id`, `category_id`, `sum`, `description`)
                    VALUES(?, ?, ?, ?, ?, ?, ?, ?)
                ", [$this->params['uid'], $this->params['date'], $this->params['type'], $this->params['accountFrom_id'], $this->params['accountTo_id'], $this->params['category_id'], $this->params['sum'], $this->params['description']], NULL, true);
                $this->data['msg'] = "Готово! Транзакція успішно додана.";
            }
            $id                = $this->params['id'] ? $this->params['id'] : $id;
            $tmp               = $this->db->query("SELECT `title` FROM `accounts` WHERE `id` = ?", [$this->params['accountFrom_id']]);
            $accountFrom_title = $tmp[0]['title'];
            $tmp               = $this->db->query("SELECT `title` FROM `accounts` WHERE `id` = ?", [$this->params['accountTo_id']]);
            $accountTo_title   = $tmp[0]['title'];
            $tmp               = $this->db->query("SELECT `title` FROM `categories` WHERE `id` = ?", [$this->params['category_id']]);
            $category_title    = $tmp[0]['title'];
            $this->data['arr'] = [
                id                => $id,
                uid               => $this->params['uid'],
                date              => $this->params['date'],
                type              => $this->params['type'],
                accountFrom_id    => $this->params['accountFrom_id'],
                accountFrom_title => $accountFrom_title,
                accountTo_id      => $this->params['accountTo_id'],
                accountTo_title   => $accountTo_title,
                category_id       => $this->params['category_id'],
                category_title    => $category_title,
                sum               => $this->params['sum'],
                description       => $this->params['description']
            ];
            $this->data['status'] = 'success';
        }
    }
    function delAction(){
        $tmp            = $this->db->query("SELECT * FROM `actions` WHERE `id` = ?", [$this->params['id']]);
        $type           = $tmp[0]['type'];
        $sum            = $tmp[0]['sum'];
        $accountFrom_id = $tmp[0]['accountFrom_id'];
        $accountTo_id   = $tmp[0]['accountTo_id'];
        switch ($type){
            case 'plus': $this->db->query("UPDATE `accounts` SET `balance` = `balance` - ? WHERE `id` = ?", [$sum, $accountFrom_id]); break;
            case 'minus': $this->db->query("UPDATE `accounts` SET `balance` = `balance` + ? WHERE `id` = ?", [$sum, $accountFrom_id]); break;
            case 'move':
                $this->db->query("UPDATE `accounts` SET `balance` = `balance` + ? WHERE `id` = ?", [$sum, $accountFrom_id]);
                $this->db->query("UPDATE `accounts` SET `balance` = `balance` - ? WHERE `id` = ?", [$sum, $accountTo_id]);
            break;
        }
        $this->db->query("DELETE FROM `actions` WHERE `id` = ? AND `uid` = ?", [$this->params['id'], $this->params['uid']]);
        $this->data['status'] = 'success';
        $this->data['msg']    = "Готово! Транзакція успішно видалена.";
    }
    function getIncomeByMonth(){
        $this->data['arr'] = $this->db->query("
            SELECT SUM(`sum`) AS `value`, MONTH(`date`) AS `month`
            FROM `actions`
            WHERE `uid` = ? AND `type` = 'plus' AND `date` >= ? AND `date` <= ?
            GROUP BY MONTH(`date`)
            ORDER BY NULL
        ", [$this->params['uid'], $this->params['dateFrom'], $this->params['dateTo']], false);
        $this->data['status'] = 'success';
    }
    function getCostByMonth(){
        $this->data['arr'] = $this->db->query("
            SELECT SUM(`sum`) AS `value`, MONTH(`date`) AS `month`
            FROM `actions`
            WHERE `uid` = ? AND `type` = 'minus' AND `date` >= ? AND `date` <= ?
            GROUP BY MONTH(`date`)
            ORDER BY NULL
        ", [$this->params['uid'], $this->params['dateFrom'], $this->params['dateTo']], false);
        $this->data['status'] = 'success';
    }
}
?>
