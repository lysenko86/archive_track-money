<?php
class Budgets{
    private $params = [];
    private $data   = [];
    private $db     = NULL;
    function __construct($params, &$data, &$db){
        $this->params = $params;
        $this->data   = &$data;
        $this->db     = &$db;
    }
    function getBudget(){
        $this->data['arr'] = $this->db->query("
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
        ", [$this->params['uid'], $this->params['month'], $this->params['year'], $this->params['uid'], $this->params['month'], $this->params['year']]);
        $this->data['status'] = 'success';
    }
    function getCategory(){
        $this->data['arr'] = $this->db->query("SELECT * FROM `budgets` WHERE `id` = ? AND `uid` = ?", [$this->params['id'], $this->params['uid']]);
        $this->data['arr'] = $this->data['arr'][0];
        $this->data['status'] = 'success';
    }
    function editCategory(){
        if (!$this->params['category_id'] || !$this->params['sum']){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Значення полів "Категорія" та "Сума" не може бути пустим!';
        }
        elseif (!preg_match('/^[\d\.]+$/', $this->params['sum'])){
            $this->data['status'] = 'error';
            $this->data['msg']    = 'Помилка! Значення поля "Сума" має бути числовим!';
        }
        else{
            $count = $this->db->query(
                "SELECT COUNT(*) AS `count` FROM `budgets` WHERE `uid` = ? AND `month` = ? AND `year` = ? AND `category_id` = ?",
                [$this->params['uid'], $this->params['month'], $this->params['year'], $this->params['category_id']]
            );
            $count = $count[0]['count'];
            if ($count > 0){
                $this->data['status'] = 'error';
                $this->data['msg']    = "Помилка! Дана категорія в бюджеті на вибраний місяць і рік вже присутня, спочатку треба видалити її!";
            }
            else{
                if ($this->params['id']){     // edit budgetCategory
                    $this->db->query("
                        UPDATE `budgets` SET `month` = ?, `year` = ?, `category_id` = ?, `sum` = ?
                        WHERE `id` = ? AND `uid` = ?
                    ", [$this->params['month'], $this->params['year'], $this->params['category_id'], $this->params['sum'], $this->params['id'], $this->params['uid']]);
                    $this->data['msg'] = "Готово! Категорія успішно змінена.";
                }
                else{     // add budgetCategory
                    $id = $this->db->query(
                        "INSERT INTO `budgets` (`uid`, `month`, `year`, `category_id`, `sum`) VALUES(?, ?, ?, ?, ?)",
                        [$this->params['uid'], $this->params['month'], $this->params['year'], $this->params['category_id'], $this->params['sum']], NULL, true
                    );
                    $this->data['msg'] = "Готово! Категорія успішно додана.";
                }
            }
            $id             = $this->params['id'] ? $this->params['id'] : $id;
            $tmp            = $this->db->query("SELECT `title`, `type` FROM `categories` WHERE `id` = ?", [$this->params['category_id']]);
            $category_title = $tmp[0]['title'];
            $type           = $tmp[0]['type'];
            $tmp            = $this->db->query("SELECT ROUND(`sum`) AS `plan` FROM `budgets` WHERE `id` = ?", [$id]);
            $plan           = $tmp[0]['plan'];
            $tmp            = $this->db->query(
                "SELECT ROUND(IFNULL(SUM(`sum`), 0)) AS `fact` FROM `actions` WHERE `uid` = ? AND `category_id` = ? AND MONTH(`date`) = ? AND YEAR(`date`) = ?",
                [$this->params['uid'], $this->params['category_id'], $this->params['month'], $this->params['year']]
            );
            $fact = $tmp[0]['fact'];
            $this->data['arr'] = [
                id             => $id,
                uid            => $this->params['uid'],
                month          => $this->params['month'],
                year           => $this->params['year'],
                category_id    => $this->params['category_id'],
                category_title => $category_title,
                sum            => $this->params['sum'],
                type           => $type,
                plan           => $plan,
                fact           => $fact
            ];
            $this->data['status'] = $this->data['status'] == 'error' ? $this->data['status'] : 'success';
        }
    }
    function delCategory(){
        $this->db->query("DELETE FROM `budgets` WHERE `id` = ? AND `uid` = ?", [$this->params['id'], $this->params['uid']]);
        $this->data['status'] = 'success';
        $this->data['msg']    = "Готово! Категорія успішно видалена.";
    }
}
?>
