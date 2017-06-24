-- phpMyAdmin SQL Dump
-- version 3.4.10.1deb1
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Июн 24 2017 г., 22:14
-- Версия сервера: 5.6.34
-- Версия PHP: 5.3.10-1ubuntu3.26

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `db_trackmoney`
--

-- --------------------------------------------------------

--
-- Структура таблицы `accounts`
--

CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT 'User ID',
  `title` varchar(200) NOT NULL,
  `balance` float(8,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=21 ;

--
-- Дамп данных таблицы `accounts`
--

INSERT INTO `accounts` (`id`, `uid`, `title`, `balance`) VALUES
(3, 16, 'Готівка Саша', 149.00),
(5, 16, 'Готівка Оля', 384.00),
(11, 16, 'Карта Оліна', 0.00),
(10, 16, 'Готівка Вдома', 6000.00),
(12, 16, 'Карта Р/Р', 13451.00),
(13, 16, 'Карта Уні', 17.00),
(16, 19, 'Нал', -200.00),
(17, 30, 'Test Acct', 3000.00),
(18, 23, 'вет', 9000.00),
(19, 23, 'фото', 6000.00),
(20, 32, 'Готівка', 750.00);

-- --------------------------------------------------------

--
-- Структура таблицы `actions`
--

CREATE TABLE IF NOT EXISTS `actions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT 'User ID',
  `date` date NOT NULL,
  `type` enum('plus','minus','move') NOT NULL,
  `accountFrom_id` int(11) NOT NULL,
  `accountTo_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `sum` float(8,2) NOT NULL,
  `description` varchar(400) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=419 ;

--
-- Дамп данных таблицы `actions`
--

INSERT INTO `actions` (`id`, `uid`, `date`, `type`, `accountFrom_id`, `accountTo_id`, `category_id`, `sum`, `description`) VALUES
(45, 16, '2017-05-01', 'minus', 11, 0, 28, 100.00, ''),
(42, 16, '2017-05-01', 'minus', 11, 0, 13, 63.00, ''),
(43, 16, '2017-05-01', 'minus', 11, 0, 12, 705.00, ''),
(39, 16, '2017-05-01', 'plus', 11, 0, 5, 1000.00, ''),
(40, 16, '2017-05-01', 'plus', 11, 0, 8, 21000.00, ''),
(41, 16, '2017-05-01', 'minus', 11, 0, 11, 1870.00, ''),
(36, 16, '2017-05-19', 'minus', 3, 0, 14, 8.00, ''),
(44, 16, '2017-05-01', 'minus', 11, 0, 31, 600.00, ''),
(46, 16, '2017-05-01', 'minus', 11, 0, 30, 2000.00, ''),
(38, 16, '2017-05-01', 'plus', 11, 0, 7, 7220.00, ''),
(31, 16, '2017-05-19', 'move', 5, 3, 0, 5.00, ''),
(32, 16, '2017-05-19', 'minus', 3, 0, 9, 6.00, ''),
(33, 16, '2017-05-19', 'move', 12, 3, 0, 3600.00, ''),
(34, 16, '2017-05-19', 'move', 3, 10, 0, 3000.00, ''),
(35, 16, '2017-05-19', 'move', 3, 5, 0, 600.00, ''),
(47, 16, '2017-05-01', 'minus', 11, 0, 17, 323.00, ''),
(48, 16, '2017-05-01', 'minus', 11, 0, 9, 4171.00, ''),
(49, 16, '2017-05-01', 'minus', 11, 0, 10, 3900.00, ''),
(50, 16, '2017-05-01', 'minus', 11, 0, 21, 273.00, ''),
(51, 16, '2017-05-01', 'minus', 11, 0, 25, 1350.00, ''),
(52, 16, '2017-05-01', 'minus', 11, 0, 14, 1724.00, ''),
(53, 16, '2017-05-01', 'minus', 11, 0, 20, 106.00, ''),
(54, 16, '2017-05-01', 'minus', 11, 0, 23, 715.00, ''),
(55, 16, '2017-05-01', 'minus', 11, 0, 15, 432.00, ''),
(56, 16, '2017-05-01', 'minus', 11, 0, 24, 1027.00, ''),
(57, 16, '2017-05-01', 'minus', 11, 0, 26, 1550.00, ''),
(58, 16, '2017-05-01', 'minus', 11, 0, 22, 489.00, ''),
(59, 16, '2017-05-01', 'minus', 11, 0, 16, 1549.00, ''),
(60, 16, '2017-05-19', 'minus', 12, 0, 14, 110.00, ''),
(61, 16, '2017-05-19', 'minus', 3, 0, 15, 20.00, 'Ремонт фари'),
(62, 16, '2017-05-19', 'minus', 12, 0, 14, 25.00, ''),
(63, 16, '2017-05-19', 'plus', 12, 0, 6, 1125.00, 'Лисак'),
(64, 16, '2017-05-19', 'minus', 3, 0, 14, 65.00, ''),
(65, 16, '2017-05-19', 'minus', 12, 0, 13, 24.00, ''),
(66, 16, '2017-05-19', 'minus', 5, 0, 23, 450.00, 'Косметолог'),
(67, 16, '2017-05-19', 'minus', 5, 0, 9, 447.00, ''),
(68, 16, '2017-05-20', 'move', 10, 5, 0, 300.00, ''),
(69, 16, '2017-05-20', 'move', 13, 10, 0, 185.00, ''),
(70, 16, '2017-05-20', 'minus', 3, 0, 26, 100.00, 'Тустань - катання на коні'),
(71, 16, '2017-05-20', 'minus', 3, 0, 26, 420.00, 'Тустань - шашлики'),
(72, 16, '2017-05-20', 'minus', 3, 0, 26, 90.00, 'Тустань - вино'),
(73, 16, '2017-05-20', 'minus', 3, 0, 26, 64.00, 'Тустань - квитки'),
(74, 16, '2017-05-20', 'minus', 3, 0, 9, 120.00, ''),
(75, 16, '2017-05-21', 'minus', 5, 0, 15, 5.00, 'Благо'),
(76, 16, '2017-05-21', 'move', 5, 3, 0, 4.00, ''),
(77, 16, '2017-05-21', 'minus', 3, 0, 26, 70.00, 'церква кава'),
(78, 16, '2017-05-20', 'minus', 12, 0, 24, 1047.00, 'Бензин'),
(79, 16, '2017-05-21', 'minus', 3, 0, 21, 28.00, 'Гіоксизон'),
(80, 16, '2017-05-21', 'minus', 3, 0, 9, 113.00, ''),
(81, 16, '2017-05-21', 'move', 12, 3, 0, 206.00, ''),
(82, 16, '2017-05-21', 'minus', 3, 0, 26, 226.00, 'Кафе 1'),
(83, 16, '2017-05-22', 'move', 10, 3, 0, 750.00, ''),
(84, 16, '2017-05-21', 'minus', 3, 0, 21, 115.00, 'Аптека'),
(85, 16, '2017-05-22', 'move', 10, 3, 0, 115.00, ''),
(86, 16, '2017-05-22', 'move', 10, 5, 0, 500.00, ''),
(87, 16, '2017-05-22', 'minus', 5, 0, 9, 24.00, ''),
(88, 16, '2017-05-22', 'move', 10, 3, 0, 235.00, ''),
(89, 16, '2017-05-22', 'move', 3, 10, 0, 15.00, ''),
(90, 16, '2017-05-22', 'minus', 3, 0, 24, 20.00, ''),
(91, 16, '2017-05-22', 'minus', 3, 0, 14, 5.00, ''),
(92, 16, '2017-05-22', 'minus', 12, 0, 15, 168.00, 'Батарейки ААА 20шт'),
(93, 16, '2017-05-22', 'minus', 12, 0, 16, 16593.00, 'Ноут + 2 мишки'),
(94, 16, '2017-05-22', 'minus', 12, 0, 15, 40.00, 'VIP аккаунт на 1 рік i.ua'),
(95, 16, '2017-05-22', 'minus', 12, 0, 14, 99.00, ''),
(96, 16, '2017-05-22', 'minus', 3, 0, 15, 4.00, 'Туалет'),
(97, 16, '2017-05-22', 'minus', 12, 0, 9, 53.00, ''),
(98, 16, '2017-05-22', 'minus', 5, 0, 21, 600.00, 'Аналізи'),
(99, 16, '2017-05-22', 'minus', 5, 0, 9, 173.00, ''),
(100, 16, '2017-05-23', 'move', 10, 3, 0, 1100.00, ''),
(101, 16, '2017-05-23', 'move', 10, 5, 0, 400.00, ''),
(102, 16, '2017-05-23', 'minus', 3, 0, 14, 10.00, ''),
(103, 16, '2017-05-23', 'minus', 12, 0, 14, 56.00, ''),
(104, 16, '2017-05-22', 'plus', 12, 0, 8, 24095.00, 'Квітень 2017'),
(105, 16, '2017-05-23', 'minus', 12, 0, 19, 500.00, 'Мама травень 2017'),
(106, 16, '2017-05-23', 'minus', 12, 0, 19, 600.00, 'Бабуля травень 2017'),
(107, 16, '2017-05-23', 'minus', 12, 0, 19, 500.00, 'Теща травень 2017'),
(108, 16, '2017-05-23', 'minus', 12, 0, 27, 5800.00, 'Квітень 2017'),
(109, 16, '2017-05-23', 'minus', 12, 0, 13, 10.00, ''),
(110, 16, '2017-05-23', 'minus', 5, 0, 24, 80.00, 'Таксі'),
(111, 16, '2017-05-23', 'minus', 5, 0, 25, 250.00, 'Няня'),
(112, 16, '2017-05-23', 'plus', 5, 0, 7, 105.00, 'Чайові'),
(113, 16, '2017-05-23', 'minus', 5, 0, 15, 150.00, 'Благо'),
(114, 16, '2017-05-23', 'move', 3, 5, 0, 500.00, ''),
(115, 16, '2017-05-24', 'minus', 12, 0, 15, 89.00, 'Адаптер USB'),
(116, 16, '2017-05-24', 'minus', 12, 0, 14, 82.00, ''),
(117, 16, '2017-05-24', 'minus', 12, 0, 21, 253.00, 'Ліки'),
(118, 16, '2017-05-24', 'minus', 3, 0, 9, 49.00, ''),
(119, 16, '2017-05-24', 'minus', 3, 0, 9, 5.00, ''),
(120, 16, '2017-05-24', 'minus', 3, 0, 14, 7.00, ''),
(121, 16, '2017-05-24', 'minus', 5, 0, 9, 90.00, ''),
(122, 16, '2017-05-24', 'plus', 5, 0, 7, 50.00, 'Чайові'),
(123, 16, '2017-05-25', 'minus', 3, 0, 24, 4.00, ''),
(124, 16, '2017-05-25', 'minus', 3, 0, 14, 7.00, ''),
(125, 16, '2017-05-25', 'move', 13, 11, 0, 675.00, ''),
(126, 16, '2017-05-25', 'plus', 13, 0, 6, 23.00, 'Вирівняв'),
(127, 16, '2017-05-25', 'minus', 12, 0, 14, 56.00, ''),
(128, 16, '2017-05-25', 'minus', 3, 0, 24, 8.00, ''),
(129, 16, '2017-05-25', 'move', 10, 3, 0, 500.00, ''),
(130, 16, '2017-05-25', 'minus', 3, 0, 9, 6.00, ''),
(131, 16, '2017-05-25', 'minus', 12, 0, 16, 882.00, 'Машина - Ремонт дефлектора'),
(132, 16, '2017-05-25', 'plus', 5, 0, 7, 20.00, 'Чайові'),
(133, 16, '2017-05-25', 'minus', 5, 0, 9, 18.00, ''),
(134, 16, '2017-05-26', 'minus', 3, 0, 24, 4.00, ''),
(135, 16, '2017-05-26', 'minus', 3, 0, 24, 4.00, ''),
(136, 16, '2017-05-26', 'minus', 3, 0, 14, 19.00, ''),
(137, 16, '2017-05-26', 'minus', 12, 0, 14, 85.00, ''),
(138, 16, '2017-05-26', 'minus', 3, 0, 9, 87.00, ''),
(139, 16, '2017-05-26', 'minus', 3, 0, 24, 70.00, 'Таксі'),
(140, 16, '2017-05-26', 'minus', 3, 0, 15, 32.00, 'Шоколадка Христині садок'),
(141, 16, '2017-05-26', 'minus', 3, 0, 15, 150.00, 'Машина - Техогляд (Південний)'),
(142, 16, '2017-05-26', 'minus', 5, 0, 9, 158.00, ''),
(143, 16, '2017-05-26', 'minus', 5, 0, 15, 216.00, 'Гостинці на Фастів'),
(145, 16, '2017-05-26', 'move', 3, 5, 0, 160.00, ''),
(146, 16, '2017-05-26', 'minus', 5, 0, 9, 91.00, 'Загубилось'),
(147, 16, '2017-05-26', 'move', 3, 5, 0, 91.00, ''),
(148, 16, '2017-05-27', 'minus', 3, 0, 14, 82.00, 'Фастів - заправка хотдоги'),
(149, 16, '2017-05-27', 'minus', 12, 0, 14, 25.00, 'Фастів - заправка кава'),
(150, 16, '2017-05-27', 'minus', 12, 0, 24, 778.00, 'Фастів - бензин'),
(151, 16, '2017-05-27', 'minus', 12, 0, 24, 714.00, 'Фастів - бензин'),
(152, 16, '2017-05-27', 'minus', 3, 0, 9, 25.00, ''),
(153, 16, '2017-05-27', 'move', 12, 3, 0, 235.00, ''),
(154, 16, '2017-05-27', 'minus', 3, 0, 16, 275.00, 'Фастів - суші'),
(155, 16, '2017-05-27', 'minus', 12, 0, 16, 154.00, 'Фастів - пиво до Дєні'),
(156, 16, '2017-05-28', 'move', 12, 3, 0, 409.00, ''),
(157, 16, '2017-05-28', 'move', 5, 3, 0, 50.00, ''),
(158, 16, '2017-05-28', 'minus', 3, 0, 16, 459.00, 'Фастів - суші'),
(159, 16, '2017-05-27', 'minus', 11, 0, 24, 300.00, 'Квиток Фастів-Львів'),
(160, 16, '2017-05-28', 'minus', 12, 0, 16, 51.00, 'Фастів - пиво в суші'),
(161, 16, '2017-05-28', 'minus', 3, 0, 16, 141.00, 'Фастів - торти до мами'),
(162, 16, '2017-05-28', 'minus', 5, 0, 9, 10.00, ''),
(163, 16, '2017-05-29', 'minus', 3, 0, 14, 11.00, 'Кава вокзал'),
(164, 16, '2017-05-29', 'minus', 3, 0, 14, 24.00, 'Йогурт та снікерс'),
(165, 16, '2017-05-29', 'move', 3, 5, 0, 10.00, ''),
(166, 16, '2017-05-29', 'move', 10, 5, 0, 50.00, ''),
(167, 16, '2017-05-29', 'minus', 12, 0, 14, 56.00, ''),
(168, 16, '2017-05-29', 'minus', 12, 0, 14, 18.00, ''),
(169, 16, '2017-05-29', 'minus', 3, 0, 14, 31.00, ''),
(170, 16, '2017-05-30', 'minus', 3, 0, 22, 50.00, ''),
(171, 16, '2017-05-30', 'minus', 13, 0, 13, 9.00, ''),
(172, 16, '2017-05-30', 'move', 13, 3, 0, 900.00, ''),
(173, 16, '2017-05-30', 'move', 10, 13, 0, 950.00, ''),
(174, 16, '2017-05-30', 'minus', 3, 0, 15, 40.00, 'Доставка'),
(175, 16, '2017-05-30', 'minus', 3, 0, 14, 6.00, ''),
(176, 16, '2017-05-30', 'minus', 3, 0, 14, 160.00, ''),
(177, 16, '2017-05-30', 'minus', 12, 0, 14, 23.00, ''),
(178, 16, '2017-05-30', 'minus', 3, 0, 14, 16.00, ''),
(179, 16, '2017-05-30', 'minus', 3, 0, 24, 8.00, ''),
(180, 16, '2017-05-30', 'minus', 3, 0, 14, 15.00, ''),
(181, 16, '2017-05-31', 'minus', 12, 0, 14, 90.00, ''),
(182, 16, '2017-05-31', 'minus', 3, 0, 9, 14.00, ''),
(183, 16, '2017-05-31', 'minus', 12, 0, 14, 18.00, ''),
(184, 16, '2017-06-01', 'minus', 3, 0, 14, 7.00, ''),
(185, 16, '2017-06-01', 'minus', 12, 0, 14, 56.00, ''),
(186, 16, '2017-06-01', 'minus', 3, 0, 24, 8.00, ''),
(187, 16, '2017-06-02', 'minus', 12, 0, 14, 53.00, ''),
(188, 16, '2017-06-02', 'minus', 3, 0, 14, 6.00, ''),
(189, 16, '2017-06-02', 'minus', 12, 0, 16, 200.00, 'Домен для TrackMoney'),
(190, 16, '2017-06-02', 'minus', 12, 0, 14, 56.00, ''),
(191, 16, '2017-06-02', 'minus', 12, 0, 14, 18.00, ''),
(192, 16, '2017-06-02', 'minus', 3, 0, 24, 8.00, ''),
(193, 16, '2017-06-03', 'minus', 3, 0, 9, 52.00, ''),
(194, 16, '2017-06-03', 'minus', 12, 0, 14, 88.00, ''),
(195, 16, '2017-06-03', 'minus', 3, 0, 9, 19.00, ''),
(196, 16, '2017-06-03', 'minus', 12, 0, 9, 25.00, ''),
(197, 16, '2017-06-03', 'minus', 3, 0, 9, 37.00, ''),
(198, 16, '2017-06-03', 'minus', 12, 0, 9, 50.00, ''),
(201, 16, '2017-06-05', 'minus', 12, 0, 14, 104.00, ''),
(202, 16, '2017-06-05', 'plus', 3, 0, 6, 2900.00, 'Продаж - Коляска (0677179331 Віктор)'),
(203, 16, '2017-06-05', 'move', 3, 10, 0, 3300.00, ''),
(204, 16, '2017-06-05', 'minus', 3, 0, 9, 40.00, ''),
(208, 16, '2017-06-05', 'minus', 3, 0, 14, 30.00, ''),
(207, 16, '2017-06-05', 'minus', 12, 0, 14, 50.00, ''),
(226, 16, '2017-06-07', 'plus', 12, 0, 8, 20500.00, 'Травень 2017 (аванс)'),
(222, 16, '2017-06-07', 'move', 10, 5, 0, 200.00, ''),
(211, 16, '2017-06-05', 'minus', 3, 0, 14, 41.00, ''),
(212, 16, '2017-06-06', 'minus', 3, 0, 14, 19.00, ''),
(213, 16, '2017-06-06', 'minus', 3, 0, 14, 43.00, ''),
(214, 16, '2017-06-06', 'minus', 3, 0, 24, 60.00, ''),
(223, 16, '2017-06-07', 'move', 10, 3, 0, 200.00, ''),
(224, 16, '2017-06-07', 'minus', 3, 0, 9, 6.00, ''),
(225, 16, '2017-06-07', 'minus', 3, 0, 14, 14.00, ''),
(227, 16, '2017-06-07', 'minus', 12, 0, 13, 109.00, 'Кредит'),
(228, 16, '2017-06-07', 'minus', 12, 0, 14, 67.00, ''),
(229, 16, '2017-06-07', 'minus', 3, 0, 25, 40.00, ''),
(230, 16, '2017-06-07', 'minus', 3, 0, 24, 60.00, 'Таксі'),
(231, 16, '2017-06-07', 'minus', 3, 0, 9, 2.00, ''),
(232, 16, '2017-06-08', 'move', 10, 11, 0, 500.00, ''),
(233, 16, '2017-06-08', 'minus', 11, 0, 13, 5.00, ''),
(234, 16, '2017-06-07', 'minus', 5, 0, 15, 150.00, 'Оля Бочкарьова д.р.'),
(235, 16, '2017-06-07', 'plus', 5, 0, 7, 40.00, 'Чайові'),
(236, 16, '2017-06-07', 'minus', 5, 0, 9, 20.00, ''),
(237, 16, '2017-06-08', 'plus', 5, 0, 6, 8.00, 'Оля Фастів'),
(238, 16, '2017-06-08', 'move', 10, 3, 0, 400.00, ''),
(239, 16, '2017-06-08', 'move', 13, 11, 0, 69.00, ''),
(240, 16, '2017-06-08', 'minus', 3, 0, 14, 6.00, ''),
(241, 16, '2017-06-08', 'minus', 3, 0, 25, 463.00, 'Англійська'),
(242, 16, '2017-06-08', 'minus', 3, 0, 13, 1.00, ''),
(243, 16, '2017-06-08', 'move', 11, 3, 0, 800.00, ''),
(244, 16, '2017-06-08', 'move', 3, 11, 0, 36.00, ''),
(245, 16, '2017-06-08', 'move', 11, 3, 0, 150.00, ''),
(246, 16, '2017-06-08', 'minus', 12, 0, 28, 99.00, 'Червень 2017'),
(247, 16, '2017-06-08', 'plus', 12, 0, 6, 625.00, 'Лисак'),
(248, 16, '2017-06-08', 'move', 11, 13, 0, 25.00, ''),
(249, 16, '2017-06-08', 'move', 3, 10, 0, 800.00, ''),
(250, 16, '2017-06-08', 'minus', 12, 0, 10, 2500.00, 'Червень 2017'),
(251, 16, '2017-06-08', 'minus', 12, 0, 10, 985.00, 'Квітень 2017 (водаГ-161; водаХ-61; опалення-464; ОСББ-160; газ-89; електрика-50)'),
(252, 16, '2017-06-08', 'minus', 12, 0, 13, 1.00, ''),
(253, 16, '2017-06-08', 'minus', 12, 0, 14, 56.00, ''),
(254, 16, '2017-06-08', 'minus', 12, 0, 13, 2.00, ''),
(255, 16, '2017-06-08', 'minus', 3, 0, 13, 2.00, ''),
(256, 16, '2017-06-08', 'move', 10, 3, 0, 200.00, ''),
(257, 16, '2017-06-08', 'minus', 3, 0, 16, 350.00, 'Сандалі'),
(258, 16, '2017-06-08', 'minus', 3, 0, 24, 4.00, ''),
(259, 16, '2017-06-08', 'minus', 12, 0, 22, 30.00, 'ТуалПапір, вушПалички, кульок'),
(260, 16, '2017-06-08', 'minus', 12, 0, 9, 56.00, ''),
(261, 16, '2017-06-08', 'plus', 5, 0, 7, 50.00, 'Чайові'),
(262, 16, '2017-06-08', 'move', 10, 3, 0, 200.00, ''),
(263, 16, '2017-06-08', 'plus', 10, 0, 7, 7000.00, 'Травень 2017'),
(264, 16, '2017-06-08', 'move', 10, 5, 0, 1000.00, ''),
(265, 16, '2017-06-09', 'minus', 3, 0, 14, 6.00, ''),
(266, 16, '2017-06-09', 'minus', 12, 0, 14, 77.00, ''),
(267, 16, '2017-06-09', 'minus', 12, 0, 14, 18.00, ''),
(268, 16, '2017-06-09', 'minus', 12, 0, 14, 103.00, ''),
(269, 16, '2017-06-09', 'minus', 3, 0, 24, 8.00, ''),
(270, 16, '2017-06-10', 'minus', 3, 0, 9, 6.00, ''),
(271, 16, '2017-06-09', 'minus', 5, 0, 22, 86.00, 'Шампунь'),
(272, 16, '2017-06-09', 'minus', 5, 0, 15, 60.00, 'Росчоска'),
(273, 16, '2017-06-09', 'minus', 5, 0, 22, 80.00, 'Засіб від плям'),
(274, 16, '2017-06-09', 'minus', 5, 0, 22, 95.00, 'Фарба для волосся'),
(275, 16, '2017-06-09', 'minus', 5, 0, 9, 96.00, ''),
(276, 16, '2017-06-09', 'minus', 5, 0, 16, 198.00, 'Панамки дітям'),
(277, 16, '2017-06-10', 'minus', 5, 0, 15, 45.00, 'Доставка'),
(278, 16, '2017-06-09', 'move', 10, 5, 0, 500.00, ''),
(279, 16, '2017-06-09', 'move', 5, 10, 0, 1200.00, ''),
(280, 16, '2017-06-09', 'move', 10, 5, 0, 200.00, ''),
(281, 16, '2017-06-09', 'move', 3, 5, 0, 31.00, ''),
(282, 16, '2017-06-10', 'plus', 5, 0, 6, 76.00, 'Вирівняв'),
(283, 16, '2017-06-10', 'move', 5, 3, 0, 76.00, ''),
(284, 16, '2017-06-10', 'plus', 3, 0, 5, 1000.00, ''),
(285, 16, '2017-06-10', 'minus', 12, 0, 9, 62.00, ''),
(286, 16, '2017-06-10', 'minus', 3, 0, 9, 17.00, ''),
(287, 16, '2017-06-10', 'move', 3, 10, 0, 1000.00, ''),
(288, 16, '2017-06-10', 'move', 3, 5, 0, 201.00, ''),
(289, 16, '2017-06-10', 'minus', 5, 0, 9, 180.00, ''),
(290, 16, '2017-06-10', 'move', 10, 5, 0, 200.00, ''),
(291, 16, '2017-06-10', 'move', 10, 3, 0, 200.00, ''),
(292, 16, '2017-06-11', 'move', 10, 3, 0, 400.00, ''),
(293, 16, '2017-06-11', 'minus', 3, 0, 9, 8.00, ''),
(294, 16, '2017-06-11', 'minus', 10, 0, 16, 500.00, 'Благо'),
(295, 16, '2017-06-11', 'minus', 3, 0, 26, 40.00, 'Діти атракціони'),
(296, 16, '2017-06-11', 'minus', 3, 0, 26, 120.00, 'Кава церква'),
(297, 16, '2017-06-11', 'minus', 5, 0, 9, 95.00, ''),
(298, 16, '2017-06-12', 'minus', 3, 0, 14, 6.00, ''),
(299, 16, '2017-06-12', 'minus', 12, 0, 14, 89.00, ''),
(300, 16, '2017-06-11', 'minus', 12, 0, 9, 701.00, ''),
(301, 16, '2017-06-11', 'minus', 12, 0, 22, 198.00, 'Ашан - сільПосудомийка2шт; туалПапір8шт; паперовіРушники4р; смітКульки2шт'),
(302, 16, '2017-06-11', 'minus', 12, 0, 26, 305.00, 'Шашлики (мангал, підноси3шт, вугілля, шампури, віяло)'),
(303, 16, '2017-06-11', 'move', 10, 3, 0, 600.00, ''),
(304, 16, '2017-06-12', 'move', 10, 5, 0, 200.00, ''),
(305, 16, '2017-06-12', 'minus', 3, 0, 9, 162.00, ''),
(306, 16, '2017-06-12', 'minus', 12, 0, 16, 3448.00, 'Купив собі смартфон'),
(307, 16, '2017-06-12', 'minus', 5, 0, 15, 200.00, 'Машина - Мийка'),
(308, 16, '2017-06-12', 'minus', 5, 0, 9, 15.00, ''),
(309, 16, '2017-06-12', 'minus', 5, 0, 15, 10.00, 'Проїзд на Шувар'),
(310, 16, '2017-06-12', 'minus', 5, 0, 9, 18.00, ''),
(311, 16, '2017-06-13', 'move', 10, 5, 0, 200.00, ''),
(312, 16, '2017-06-13', 'move', 5, 3, 0, 2.00, ''),
(313, 16, '2017-06-13', 'minus', 3, 0, 9, 4.00, ''),
(314, 16, '2017-06-13', 'minus', 3, 0, 22, 43.00, 'резинові ганчірки'),
(315, 16, '2017-06-13', 'minus', 3, 0, 9, 10.00, ''),
(316, 16, '2017-06-13', 'minus', 3, 0, 14, 5.00, ''),
(317, 16, '2017-06-13', 'plus', 12, 0, 8, 24115.00, 'Травень 2017'),
(318, 16, '2017-06-13', 'minus', 3, 0, 14, 76.00, ''),
(319, 16, '2017-06-13', 'minus', 3, 0, 14, 18.00, ''),
(320, 16, '2017-06-13', 'plus', 5, 0, 7, 20.00, 'Чайові'),
(321, 16, '2017-06-13', 'plus', 10, 0, 6, 800.00, 'Продаж - Монітор (0976321545)'),
(322, 16, '2017-06-14', 'minus', 3, 0, 14, 8.00, ''),
(323, 16, '2017-06-14', 'minus', 3, 0, 14, 83.00, ''),
(324, 16, '2017-06-14', 'minus', 3, 0, 14, 18.00, ''),
(325, 16, '2017-06-14', 'minus', 3, 0, 9, 24.00, ''),
(326, 16, '2017-06-14', 'minus', 5, 0, 25, 120.00, ''),
(327, 16, '2017-06-14', 'minus', 5, 0, 22, 87.00, 'Замочування форми'),
(328, 16, '2017-06-14', 'minus', 5, 0, 9, 3.00, ''),
(329, 16, '2017-06-15', 'move', 10, 5, 0, 100.00, ''),
(330, 16, '2017-06-15', 'move', 10, 3, 0, 500.00, ''),
(331, 16, '2017-06-15', 'minus', 3, 0, 9, 15.00, ''),
(332, 16, '2017-06-15', 'minus', 3, 0, 15, 50.00, 'Стрижка Саша'),
(333, 16, '2017-06-15', 'minus', 3, 0, 13, 4.00, ''),
(334, 16, '2017-06-15', 'minus', 3, 0, 25, 682.00, ''),
(335, 16, '2017-06-15', 'move', 3, 13, 0, 14.00, ''),
(336, 16, '2017-06-15', 'minus', 13, 0, 13, 4.00, ''),
(337, 16, '2017-06-15', 'minus', 3, 0, 24, 4.00, ''),
(338, 16, '2017-06-15', 'move', 12, 3, 0, 9000.00, ''),
(339, 16, '2017-06-15', 'minus', 3, 0, 24, 4.00, ''),
(340, 16, '2017-06-15', 'minus', 3, 0, 16, 9000.00, 'Машина - Ремонт (балкаЗаміна-7500; передніАмор-2800; СБричагів-2000; гальмКолодки-2000; пильнік-2300; радіаторКондюка-3500)'),
(341, 16, '2017-06-15', 'minus', 3, 0, 14, 56.00, ''),
(342, 16, '2017-06-15', 'minus', 13, 0, 14, 18.00, ''),
(343, 16, '2017-06-14', 'minus', 3, 0, 9, 5.00, ''),
(344, 16, '2017-06-14', 'minus', 5, 0, 14, 75.00, ''),
(345, 16, '2017-06-15', 'move', 10, 5, 0, 700.00, ''),
(346, 16, '2017-06-15', 'minus', 3, 0, 14, 12.00, ''),
(347, 16, '2017-06-16', 'minus', 3, 0, 14, 79.00, ''),
(348, 16, '2017-06-16', 'plus', 12, 0, 6, 710.00, 'Лисак'),
(349, 16, '2017-06-16', 'minus', 3, 0, 14, 69.00, ''),
(350, 16, '2017-06-16', 'minus', 3, 0, 14, 42.00, ''),
(351, 16, '2017-06-16', 'minus', 3, 0, 24, 8.00, ''),
(352, 16, '2017-06-16', 'minus', 3, 0, 14, 18.00, ''),
(353, 16, '2017-06-16', 'minus', 5, 0, 9, 484.00, ''),
(354, 16, '2017-06-17', 'move', 10, 3, 0, 600.00, ''),
(355, 16, '2017-06-17', 'minus', 3, 0, 15, 45.00, 'Машина - Склоомивач'),
(356, 16, '2017-06-17', 'minus', 3, 0, 26, 260.00, 'СкайПарк'),
(357, 16, '2017-06-17', 'minus', 3, 0, 26, 26.00, 'СкайПарк'),
(358, 16, '2017-06-17', 'minus', 12, 0, 26, 110.00, 'СкайПарк'),
(359, 16, '2017-06-17', 'minus', 3, 0, 26, 220.00, 'СкайПарк'),
(360, 16, '2017-06-17', 'minus', 3, 0, 9, 36.00, ''),
(361, 16, '2017-06-18', 'move', 10, 3, 0, 600.00, ''),
(362, 16, '2017-06-18', 'minus', 3, 0, 9, 6.00, ''),
(363, 16, '2017-06-18', 'move', 12, 3, 0, 136.00, ''),
(364, 16, '2017-06-18', 'minus', 3, 0, 26, 156.00, 'Швецьке кафе'),
(365, 16, '2017-06-18', 'minus', 3, 0, 15, 40.00, 'Дітям іграшки'),
(366, 16, '2017-06-18', 'minus', 3, 0, 26, 160.00, 'Бухта вікінгів'),
(367, 16, '2017-06-18', 'minus', 3, 0, 9, 131.00, ''),
(368, 16, '2017-06-18', 'minus', 3, 0, 15, 20.00, 'ВологіСерветки'),
(369, 16, '2017-06-18', 'minus', 12, 0, 24, 879.00, 'Бензин'),
(370, 16, '2017-06-18', 'minus', 5, 0, 9, 23.00, ''),
(371, 16, '2017-06-18', 'minus', 5, 0, 21, 15.00, ''),
(372, 16, '2017-06-19', 'minus', 3, 0, 14, 7.00, ''),
(373, 16, '2017-06-18', 'move', 10, 3, 0, 500.00, ''),
(374, 16, '2017-06-18', 'minus', 3, 0, 9, 10.00, ''),
(375, 16, '2017-06-19', 'minus', 3, 0, 14, 69.00, ''),
(376, 16, '2017-06-19', 'minus', 3, 0, 14, 45.00, ''),
(380, 19, '2017-06-20', 'minus', 16, 0, 35, 300.00, ''),
(381, 16, '2017-06-20', 'minus', 3, 0, 14, 73.00, ''),
(382, 16, '2017-06-20', 'minus', 3, 0, 14, 18.00, ''),
(383, 16, '2017-06-20', 'plus', 5, 0, 7, 20.00, 'Чайові'),
(384, 16, '2017-06-20', 'minus', 3, 0, 14, 8.00, ''),
(385, 16, '2017-06-19', 'minus', 5, 0, 9, 166.00, ''),
(386, 16, '2017-06-20', 'minus', 3, 0, 9, 97.00, ''),
(387, 16, '2017-06-20', 'minus', 3, 0, 9, 14.00, ''),
(388, 16, '2017-06-21', 'minus', 3, 0, 14, 5.00, ''),
(389, 30, '2017-06-21', 'plus', 17, 0, 39, 3000.00, 'test'),
(390, 16, '2017-06-21', 'minus', 3, 0, 14, 56.00, ''),
(391, 23, '2017-06-21', 'move', 18, 19, 0, 1000.00, 'надо так'),
(392, 32, '2017-06-21', 'minus', 20, 0, 44, 50.00, 'тест'),
(393, 16, '2017-06-21', 'minus', 3, 0, 9, 86.00, ''),
(394, 16, '2017-06-21', 'minus', 3, 0, 25, 40.00, 'Вистава'),
(395, 16, '2017-06-22', 'minus', 3, 0, 14, 20.00, ''),
(396, 16, '2017-06-22', 'minus', 3, 0, 14, 56.00, ''),
(397, 16, '2017-06-22', 'minus', 3, 0, 14, 18.00, ''),
(398, 16, '2017-06-22', 'minus', 3, 0, 9, 9.00, ''),
(399, 16, '2017-06-22', 'minus', 3, 0, 9, 20.00, ''),
(400, 16, '2017-06-22', 'plus', 5, 0, 7, 90.00, ''),
(401, 16, '2017-06-21', 'minus', 5, 0, 9, 144.00, ''),
(402, 16, '2017-06-22', 'move', 10, 3, 0, 200.00, ''),
(403, 16, '2017-06-22', 'move', 10, 5, 0, 500.00, ''),
(404, 16, '2017-06-23', 'minus', 3, 0, 14, 20.00, ''),
(405, 16, '2017-06-23', 'minus', 3, 0, 14, 56.00, ''),
(406, 16, '2017-06-23', 'minus', 5, 0, 20, 376.00, ''),
(407, 16, '2017-06-23', 'minus', 5, 0, 23, 350.00, ''),
(408, 16, '2017-06-23', 'move', 10, 5, 0, 200.00, ''),
(409, 16, '2017-06-23', 'minus', 3, 0, 9, 132.00, ''),
(410, 16, '2017-06-24', 'move', 12, 3, 0, 500.00, ''),
(411, 16, '2017-06-24', 'minus', 3, 0, 9, 27.00, ''),
(412, 16, '2017-06-24', 'minus', 12, 0, 9, 261.00, ''),
(413, 16, '2017-06-24', 'minus', 3, 0, 26, 25.00, 'діти атракціони'),
(414, 16, '2017-06-24', 'minus', 3, 0, 26, 399.00, 'Суші'),
(415, 16, '2017-06-23', 'minus', 5, 0, 15, 70.00, ''),
(416, 16, '2017-06-24', 'move', 10, 5, 0, 400.00, ''),
(417, 16, '2017-06-24', 'minus', 5, 0, 9, 313.00, ''),
(418, 16, '2017-06-24', 'move', 10, 5, 0, 300.00, '');

-- --------------------------------------------------------

--
-- Структура таблицы `budgets`
--

CREATE TABLE IF NOT EXISTS `budgets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT 'User ID',
  `month` tinyint(4) NOT NULL,
  `year` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `sum` float(8,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid_month_year_category` (`uid`,`month`,`year`,`category_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=67 ;

--
-- Дамп данных таблицы `budgets`
--

INSERT INTO `budgets` (`id`, `uid`, `month`, `year`, `category_id`, `sum`) VALUES
(12, 16, 5, 2017, 6, 1.00),
(11, 16, 5, 2017, 5, 1000.00),
(14, 16, 5, 2017, 4, 5000.00),
(13, 16, 5, 2017, 7, 6000.00),
(15, 16, 5, 2017, 8, 46000.00),
(16, 16, 5, 2017, 19, 1600.00),
(17, 16, 5, 2017, 27, 5800.00),
(18, 16, 5, 2017, 11, 1870.00),
(19, 16, 5, 2017, 13, 30.00),
(20, 16, 5, 2017, 12, 705.00),
(21, 16, 5, 2017, 31, 600.00),
(22, 16, 5, 2017, 28, 100.00),
(23, 16, 5, 2017, 29, 13500.00),
(24, 16, 5, 2017, 32, 5000.00),
(25, 16, 5, 2017, 30, 2000.00),
(26, 16, 5, 2017, 17, 310.00),
(27, 16, 5, 2017, 9, 6000.00),
(28, 16, 5, 2017, 10, 4500.00),
(29, 16, 5, 2017, 21, 500.00),
(30, 16, 5, 2017, 25, 1500.00),
(31, 16, 5, 2017, 14, 1800.00),
(32, 16, 5, 2017, 20, 200.00),
(33, 16, 5, 2017, 23, 1000.00),
(34, 16, 5, 2017, 15, 500.00),
(35, 16, 5, 2017, 18, 1.00),
(36, 16, 5, 2017, 24, 1500.00),
(37, 16, 5, 2017, 26, 1500.00),
(38, 16, 5, 2017, 22, 500.00),
(39, 16, 5, 2017, 16, 1985.00),
(40, 16, 6, 2017, 5, 1000.00),
(41, 16, 6, 2017, 6, 1.00),
(42, 16, 6, 2017, 7, 6000.00),
(43, 16, 6, 2017, 8, 45000.00),
(44, 16, 6, 2017, 19, 1600.00),
(45, 16, 6, 2017, 27, 5100.00),
(46, 16, 6, 2017, 11, 2820.00),
(47, 16, 6, 2017, 13, 100.00),
(48, 16, 6, 2017, 12, 705.00),
(49, 16, 6, 2017, 28, 100.00),
(50, 16, 6, 2017, 29, 1.00),
(51, 16, 6, 2017, 32, 1.00),
(52, 16, 6, 2017, 17, 310.00),
(53, 16, 6, 2017, 9, 6000.00),
(54, 16, 6, 2017, 10, 3500.00),
(55, 16, 6, 2017, 21, 700.00),
(56, 16, 6, 2017, 25, 1500.00),
(57, 16, 6, 2017, 14, 2000.00),
(58, 16, 6, 2017, 23, 1000.00),
(59, 16, 6, 2017, 15, 1000.00),
(60, 16, 6, 2017, 24, 1500.00),
(61, 16, 6, 2017, 26, 2000.00),
(62, 16, 6, 2017, 22, 500.00),
(63, 16, 6, 2017, 16, 12564.00),
(65, 30, 6, 2017, 39, 1000.00),
(66, 23, 4, 2017, 43, 1500.00);

-- --------------------------------------------------------

--
-- Структура таблицы `categories`
--

CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT 'User ID',
  `title` varchar(400) NOT NULL,
  `type` enum('plus','minus') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=45 ;

--
-- Дамп данных таблицы `categories`
--

INSERT INTO `categories` (`id`, `uid`, `title`, `type`) VALUES
(7, 16, 'Оля Львів', 'plus'),
(5, 16, 'Дитячі гроші', 'plus'),
(4, 16, 'Оля Фастів', 'plus'),
(6, 16, 'Інше', 'plus'),
(8, 16, 'Саша LvivCode', 'plus'),
(9, 16, 'Їжа', 'minus'),
(10, 16, 'Квартира', 'minus'),
(11, 16, 'Податок', 'minus'),
(12, 16, 'ПФ', 'minus'),
(13, 16, 'Комісія', 'minus'),
(14, 16, 'Обіди', 'minus'),
(15, 16, 'Побутові витрати', 'minus'),
(16, 16, 'Цільові витрати', 'minus'),
(17, 16, 'Зв''язок', 'minus'),
(18, 16, 'Подарунки', 'minus'),
(19, 16, 'Батькам', 'minus'),
(20, 16, 'Одяг', 'minus'),
(21, 16, 'Лікування', 'minus'),
(22, 16, 'Хімія', 'minus'),
(23, 16, 'Оля тіло', 'minus'),
(24, 16, 'Проїзд', 'minus'),
(25, 16, 'Няня/Садок', 'minus'),
(26, 16, 'Розваги', 'minus'),
(27, 16, 'Десятина', 'minus'),
(28, 16, 'Р/Р', 'minus'),
(29, 16, 'На квартиру', 'minus'),
(30, 16, 'На відпочинок', 'minus'),
(31, 16, 'Кредит', 'minus'),
(32, 16, 'Заощадження', 'minus'),
(35, 19, 'Питание', 'minus'),
(36, 19, 'Зарплата', 'plus'),
(37, 22, 'ЗП', 'plus'),
(42, 23, 'авто', 'minus'),
(39, 30, 'test cat', 'plus'),
(40, 30, 'test cat', 'minus'),
(43, 23, 'вет', 'plus'),
(44, 32, 'їжа', 'minus');

-- --------------------------------------------------------

--
-- Структура таблицы `forum`
--

CREATE TABLE IF NOT EXISTS `forum` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT 'User ID',
  `uid_upd` int(11) NOT NULL COMMENT 'User ID updated',
  `title` varchar(700) NOT NULL,
  `category` enum('public','bug','feature','thank','question','forAdmin') NOT NULL,
  `status` enum('created','viewed','fixed','closed') NOT NULL DEFAULT 'created',
  `created` timestamp NULL DEFAULT NULL,
  `updated` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Дамп данных таблицы `forum`
--

INSERT INTO `forum` (`id`, `uid`, `uid_upd`, `title`, `category`, `status`, `created`, `updated`) VALUES
(1, 16, 18, 'Дякую!', 'thank', 'created', '2017-06-23 11:55:05', '2017-06-23 11:56:41');

-- --------------------------------------------------------

--
-- Структура таблицы `forum_comments`
--

CREATE TABLE IF NOT EXISTS `forum_comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fid` int(11) NOT NULL COMMENT 'Forum ID',
  `uid` int(11) NOT NULL COMMENT 'User ID',
  `created` timestamp NULL DEFAULT NULL,
  `comment` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `forum_comments`
--

INSERT INTO `forum_comments` (`id`, `fid`, `uid`, `created`, `comment`) VALUES
(1, 1, 16, '2017-06-23 11:55:05', 'Дякую, що створили такий сервіс!'),
(2, 1, 18, '2017-06-23 11:56:41', 'Я також дякую!');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(200) NOT NULL,
  `password` varchar(32) NOT NULL,
  `confirm` tinyint(4) NOT NULL DEFAULT '0',
  `token` varchar(32) NOT NULL DEFAULT '',
  `created` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=38 ;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `confirm`, `token`, `created`) VALUES
(4, 't@t', '64fe13fa4813991ae75a60a59ea70358', 0, 'ba8e1eb4aef621536905f77583ae34da', '2017-06-24 18:53:29'),
(5, 's@s', '15565ce78d9d827f3d559234d8065860', 0, '', '2017-06-24 18:53:29'),
(6, 'w@w', '6acf7b15b7e14250520852331ea8cd0b', 0, '', '2017-06-24 18:53:29'),
(7, 'y@y', '64fe13fa4813991ae75a60a59ea70358', 0, '', '2017-06-24 18:53:29'),
(30, 'mkoval.ua@gmail.com', '1a81c7f64c2410b054ab46b26fbf5999', 1, 'b345197b37484154352ee18af6a49501', '2017-06-24 18:53:29'),
(16, 'lysenkoa86@gmail.com', '4e339a85b8aad4c40c5f2f07673e9c52', 1, '49e02db6f26a983b838461e7aac78e9a', '2017-06-24 18:53:29'),
(18, 'lysenko86@i.ua', '64fe13fa4813991ae75a60a59ea70358', 1, 'a93a943e1649e0e27934a2c0c3bd369e', '2017-06-24 18:53:29'),
(19, 'atmamont@gmail.com', 'edd54b7e7a61d116b1c6f0ab065eced1', 1, '37fa450793c5d7f3b3de850bba7bf401', '2017-06-24 18:53:29'),
(20, 'leo-tv@yandex.ru', '998465011b8d3c44b01ccd0efb6dbb42', 1, '6194e25dd6671f3d5a7045c907f61d59', '2017-06-24 18:53:29'),
(21, 'alex.filippovich@gmail.com', 'e9e8d7ed64bcd522c1b3561d5b164889', 0, '', '2017-06-24 18:53:29'),
(22, 'indigo86@i.ua', 'd3df8a5d5246ca8fb1c4e07638827fb0', 1, '07ff037ba98ebb14e471dce3c0901987', '2017-06-24 18:53:29'),
(23, 'willy00ray@gmail.com', 'c5b9227a9b1b9f696f695b5fa00713f0', 1, 'a16a3532bfebfa6c9b3d77f873c3a088', '2017-06-24 18:53:29'),
(24, 'test@test.com', '66223a33fb9a7679a9e110211d51ca9b', 0, '', '2017-06-24 18:53:29'),
(25, 'minsk2000@gmail.com', 'ee25e77fa1d221a560b4b673d03b781f', 1, 'ef6a884008a4beaa20250238412caa27', '2017-06-24 18:53:29'),
(26, 'viktor.chmel@gmail.com', 'c0dd0683eed65297a2a384e1cf42bf58', 1, 'b325ad1a4f80df101412b2f55c87de3d', '2017-06-24 18:53:29'),
(27, 'marysia79@ukr.net', '067b28deaca89350791243752ae23561', 0, '', '2017-06-24 18:53:29'),
(28, 'LenaLesch@i.ua', 'bcc8ed72db9ff4086668101e92dce153', 0, '', '2017-06-24 18:53:29'),
(29, 'malenka9237@mail.ru', '376e3b6dab225c326bede6130711d85f', 0, '', '2017-06-24 18:53:29'),
(31, 'Karpenter@i.ua', '2ed8747e0b19612e691c3716d9b1179c', 1, '', '2017-06-24 18:53:29'),
(32, 'arthurtesl@gmail.com', 'b86544714ac0366d5eebfb3ff1c5b30e', 1, 'b85a59dcdee08f8198d9a31acc3d0681', '2017-06-24 18:53:29'),
(33, 'flexy777@gmail.com', '5dc63a1e89025302c654dea1f3a13f23', 1, '9333b71092f80aca9e9f38db1d8ef4a9', '2017-06-24 18:53:29'),
(34, 'natagnot@fmail.com', 'a874b5e3732706c005014e5be6b56293', 0, '', '2017-06-24 18:53:29'),
(35, 'natagnot@gmail.com', 'a874b5e3732706c005014e5be6b56293', 0, '', '2017-06-24 18:53:29'),
(36, 'svyat.kuznyetsov@gmail.com', 'ca373221207df9dbb1180f18f07f6038', 1, '3225b6eaa0e1329be065148fd726656e', '2017-06-24 18:53:29'),
(37, 'etroff@etroff.net', '1a3fdc804d73ada3f99277f9fac01cfe', 1, '5824aa46c07a9f7a0d485b64f5d8be6e', '2017-06-24 18:53:29');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
