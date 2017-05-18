-- phpMyAdmin SQL Dump
-- version 3.4.10.1deb1
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Май 18 2017 г., 00:12
-- Версия сервера: 5.6.34
-- Версия PHP: 5.3.10-1ubuntu3.26

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `db_money`
--

-- --------------------------------------------------------

--
-- Структура таблицы `accounts`
--

CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `balance` float(8,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=14 ;

--
-- Дамп данных таблицы `accounts`
--

INSERT INTO `accounts` (`id`, `title`, `balance`) VALUES
(3, 'Готівка Саша', 444088.00),
(5, 'Готівка Оля', -5378.00),
(11, 'Карта Оліна', 0.00),
(10, 'Готівка Вдома', -300.00),
(12, 'Карта Р/Р', 700.00),
(13, 'Карта Уні', 0.00);

-- --------------------------------------------------------

--
-- Структура таблицы `actions`
--

CREATE TABLE IF NOT EXISTS `actions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `type` enum('plus','minus','move') NOT NULL,
  `accountFrom_id` int(11) NOT NULL,
  `accountTo_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `sum` float(8,2) NOT NULL,
  `description` varchar(400) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=31 ;

--
-- Дамп данных таблицы `actions`
--

INSERT INTO `actions` (`id`, `date`, `type`, `accountFrom_id`, `accountTo_id`, `category_id`, `sum`, `description`) VALUES
(2, '2017-05-11', 'plus', 0, 0, 5, 20000.00, 'Аванс'),
(22, '2017-05-16', 'move', 3, 12, 0, 700.00, ''),
(4, '2017-05-13', 'plus', 5, 3, 6, 555.00, 'паапапав'),
(18, '2017-05-16', 'move', 12, 13, 0, 400.00, ''),
(7, '2017-05-13', 'plus', 3, 0, 4, 43.00, ''),
(17, '2017-05-16', 'move', 12, 13, 0, 400.00, ''),
(9, '2017-05-13', 'move', 3, 5, 0, 789.00, ''),
(10, '2017-05-13', 'minus', 5, 0, 6, 789.00, ''),
(11, '2017-05-13', 'move', 3, 5, 0, 789.00, ''),
(12, '2017-01-01', 'plus', 5, 0, 4, 3432.00, 'sdfs'),
(20, '2017-05-16', 'move', 12, 13, 0, 400.00, ''),
(23, '2017-05-17', 'minus', 3, 0, 10, 500.00, ''),
(24, '2017-05-17', 'plus', 3, 0, 8, 11110.00, ''),
(25, '2017-05-17', 'minus', 3, 0, 10, 500.00, ''),
(26, '2017-05-17', 'plus', 5, 0, 8, 500.00, ''),
(27, '2017-05-17', 'minus', 3, 0, 10, 10.00, ''),
(28, '2017-05-17', 'plus', 5, 0, 8, 10.00, ''),
(29, '2017-05-17', 'plus', 3, 0, 7, 600.00, ''),
(30, '2017-05-17', 'minus', 5, 0, 14, 1200.00, '');

-- --------------------------------------------------------

--
-- Структура таблицы `budgets`
--

CREATE TABLE IF NOT EXISTS `budgets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `month` tinyint(4) NOT NULL,
  `year` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `sum` float(8,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `month_year_category` (`month`,`year`,`category_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=11 ;

--
-- Дамп данных таблицы `budgets`
--

INSERT INTO `budgets` (`id`, `month`, `year`, `category_id`, `sum`) VALUES
(8, 5, 2017, 8, 2300.00),
(9, 5, 2017, 7, 700.00),
(7, 5, 2017, 10, 200.00),
(10, 5, 2017, 14, 1700.00);

-- --------------------------------------------------------

--
-- Структура таблицы `categories`
--

CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(400) NOT NULL,
  `type` enum('plus','minus') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=18 ;

--
-- Дамп данных таблицы `categories`
--

INSERT INTO `categories` (`id`, `title`, `type`) VALUES
(7, 'Оля Львів', 'plus'),
(5, 'Дитячі гроші', 'plus'),
(4, 'Оля Фастів', 'plus'),
(6, 'Інше', 'plus'),
(8, 'Саша LvivCode', 'plus'),
(9, 'Їжа', 'minus'),
(10, 'Квартира', 'minus'),
(11, 'Податок', 'minus'),
(12, 'ПФ', 'minus'),
(13, 'Комісія', 'minus'),
(14, 'Обіди', 'minus'),
(15, 'Побутові витрати', 'minus'),
(16, 'Цільові витрати', 'minus'),
(17, 'Зв''язок', 'minus');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
