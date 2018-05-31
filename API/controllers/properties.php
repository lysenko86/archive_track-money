<?php
class Properties{
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
    function getProperties(){
        $this->data['arr']    = $this->db->query("SELECT * FROM `properties` WHERE `uid` = ? ORDER BY `title` ASC", [$this->params['uid']]);
        $this->data['status'] = 'success';
    }
    function getProperty(){
        $this->data['arr']    = $this->db->query("SELECT * FROM `properties` WHERE `id` = ? AND `uid` = ?", [$this->params['id'], $this->params['uid']]);
        $this->data['arr']    = $this->data['arr'][0];
        $this->data['status'] = 'success';
    }
    function editProperty(){
        if (!$this->params['title']){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Значення поля "Назва" не може бути пустим!';
        }
        elseif (!preg_match('/^[\d\.\+\-]+$/', $this->params['price']) || $this->params['price'] == '0'){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Значення поля "Ціна" має бути числовим і не нуль!';
        }
        else{
            if ($this->params['id']){     // edit property
                $this->db->query(
                    "UPDATE `properties` SET `title` = ?, `price` = ? WHERE `id` = ? AND `uid` = ?",
                    [$this->params['title'], $this->params['price'], $this->params['id'], $this->params['uid']]
                );
                $this->data['msg'] = "Готово! Майно успішно змінене.";
            }
            else{     // add property
                $id = $this->db->query(
                    "INSERT INTO `properties` (`uid`, `title`, `price`) VALUES(?, ?, ?)",
                    [$this->params['uid'], $this->params['title'], $this->params['price']], NULL, true
                );
                $this->data['msg'] = "Готово! Майно успішно додане.";
            }
            $this->updatePropertiesLog($this->params['date']);
            $id                = $this->params['id'] ? $this->params['id'] : $id;
            $this->data['arr'] = [
                id    => $id,
                uid   => $this->params['uid'],
                title => $this->params['title'],
                price => $this->params['price']
            ];
            $this->data['status'] = 'success';
        }
    }
    function delProperty(){
        $this->db->query("DELETE FROM `properties` WHERE `id` = ? AND `uid` = ?", [$this->params['id'], $this->params['uid']]);
        $this->updatePropertiesLog($this->params['date']);
        $this->data['status'] = 'success';
        $this->data['msg']    = "Готово! Майно успішно видалене.";
    }
    function getActiveByMonth(){
        $this->data['arr'] = $this->db->query("
            SELECT `id`, `active_sum`, `active_comment`, MONTH(`date`) AS `month` FROM `properties_log` WHERE `uid` = ? AND `date` >= ? AND `date` <= ?
        ", [$this->params['uid'], $this->params['dateFrom'], $this->params['dateTo']], false);
        $this->data['status'] = 'success';
    }
    function getPassiveByMonth(){
        $this->data['arr'] = $this->db->query("
            SELECT `id`, ABS(`passive_sum`) AS `passive_sum`, `passive_comment`, MONTH(`date`) AS `month` FROM `properties_log` WHERE `uid` = ? AND `date` >= ? AND `date` <= ?
        ", [$this->params['uid'], $this->params['dateFrom'], $this->params['dateTo']], false);
        $this->data['status'] = 'success';
    }
    function getCapitalByMonth(){
        $this->data['arr'] = $this->db->query("
            SELECT `id`, (`passive_sum` + `active_sum`) AS `sum`, MONTH(`date`) AS `month` FROM `properties_log` WHERE `uid` = ? AND `date` >= ? AND `date` <= ?
        ", [$this->params['uid'], $this->params['dateFrom'], $this->params['dateTo']], false);
        $this->data['status'] = 'success';
    }
}
?>
