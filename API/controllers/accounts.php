<?php
class Accounts{
    private $params = [];
    private $data   = [];
    private $db     = NULL;
    function __construct($params, &$data, &$db){
        $this->params = $params;
        $this->data   = &$data;
        $this->db     = &$db;
    }
    function updatePropertiesLog($date){
        $active_sum = $passive_sum = 0;
        $active_comment = $passive_comment = '';
        $accounts = $this->db->query("SELECT * FROM `accounts` WHERE `uid` = ? ORDER BY `title` ASC", [$this->params['uid']]);
        foreach ($accounts as $key=>$value){
            if ($value['balance'] >= 0){
                $active_sum += $value['balance'];
                $active_comment .= $value['title'].' +'.$value['balance'].'; ';
            }
            elseif ($value['balance'] < 0){
                $passive_sum += $value['balance'];
                $passive_comment .= $value['title'].' '.$value['balance'].'; ';
            }
        }
        $properties = $this->db->query("SELECT * FROM `properties` WHERE `uid` = ? ORDER BY `title` ASC", [$this->params['uid']]);
        foreach ($properties as $key=>$value){
            if ($value['price'] >= 0){
                $active_sum += $value['price'];
                $active_comment .= $value['title'].' +'.$value['price'].'; ';
            }
            elseif ($value['price'] < 0){
                $passive_sum += $value['price'];
                $passive_comment .= $value['title'].' '.$value['price'].'; ';
            }
        }
        $active_comment = substr(trim($active_comment), 0, -1);
        $passive_comment = substr(trim($passive_comment), 0, -1);
        $date = substr($date, 0, -2).'01';
        $isData = $this->db->query("SELECT `id` FROM `properties_log` WHERE `uid` = ? AND `date` = ?", [$this->params['uid'], $date]);
        if ($isData){
            $this->db->query(
                "UPDATE `properties_log` SET `active_sum` = ?, `passive_sum` = ?, `active_comment` = ?, `passive_comment` = ? WHERE `id` = ?",
                [$active_sum, $passive_sum, $active_comment, $passive_comment, $isData[0]['id']]
            );
        }
        else{
            $this->db->query(
                "INSERT INTO `properties_log` (`uid`, `date`, `active_sum`, `passive_sum`, `active_comment`, `passive_comment`) VALUES(?, ?, ?, ?, ?, ?)",
                [$this->params['uid'], $date, $active_sum, $passive_sum, $active_comment, $passive_comment]
            );
        }
    }
    function getAccounts(){
        $this->data['arr']    = $this->db->query("SELECT * FROM `accounts` WHERE `uid` = ? ORDER BY `title` ASC", [$this->params['uid']]);
        $this->data['status'] = 'success';
    }
    function getBalances(){
        $this->data['arr']    = $this->db->query("SELECT * FROM `accounts` WHERE `uid` = ? AND `panel` = ? ORDER BY `title` ASC", [$this->params['uid'], 1]);
        $this->data['status'] = 'success';
    }
    function getAccount(){
        $this->data['arr']    = $this->db->query("SELECT * FROM `accounts` WHERE `id` = ? AND `uid` = ?", [$this->params['id'], $this->params['uid']]);
        $this->data['arr']    = $this->data['arr'][0];
        $this->data['status'] = 'success';
    }
    function editAccount(){
        if (!$this->params['title'] || $this->params['balance'] == ''){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Значення полів "Назва" та "Баланс" не може бути пустим!';
        }
        elseif (!preg_match('/^[\-\+\d\.]+$/', $this->params['balance'])){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Значення поля "Баланс" має бути числовим!';
        }
        else{
            if ($this->params['id']){     // edit account
                $this->db->query("
                    UPDATE `accounts` SET `title` = ?, `balance` = ?, `panel` = ?
                    WHERE `id` = ? AND `uid` = ?
                ", [$this->params['title'], $this->params['balance'], $this->params['panel'], $this->params['id'], $this->params['uid']]);
                $this->data['msg'] = "Готово! Рахунок успішно змінений.";
            }
            else{     // add account
                $id = $this->db->query(
                    "INSERT INTO `accounts` (`uid`, `title`, `balance`, `panel`) VALUES(?, ?, ?, ?)",
                    [$this->params['uid'], $this->params['title'], $this->params['balance'], $this->params['panel']], NULL, true
                );
                $this->data['msg'] = "Готово! Рахунок успішно доданий.";
            }
            $this->updatePropertiesLog($this->params['date']);
            $id                = $this->params['id'] ? $this->params['id'] : $id;
            $this->data['arr'] = [
                id      => $id,
                uid     => $this->params['uid'],
                title   => $this->params['title'],
                balance => $this->params['balance'],
                panel   => $this->params['panel']
            ];
            $this->data['status'] = 'success';
        }
    }
    function delAccount(){
        $count = $this->db->query("SELECT COUNT(*) AS `count` FROM `actions` WHERE `accountFrom_id` = ? OR `accountTo_id` = ?", [$this->params['id'], $this->params['id']]);
        $count = $count[0]['count'];
        if ($count > 0){
            $this->data['status'] = 'error';
            $this->data['msg']    = "Помилка! Рахунок використовується у $count транзакції(ях), спочатку треба видалити транзакції!";
        }
        else{
            $this->db->query("DELETE FROM `accounts` WHERE `id` = ? AND `uid` = ?", [$this->params['id'], $this->params['uid']]);
            $this->updatePropertiesLog($this->params['date']);
            $this->data['status'] = 'success';
            $this->data['msg']    = "Готово! Рахунок успішно видалений.";
        }
    }
}
?>
