<?php
$id = $_GET['id'];

$params = array();

$params['host'] = 'localhost';
$params['dbname'] = 'php_js';
$params['user'] = 'root';
$params['password'] = 'root';


$dsn = "mysql:host={$params['host']};dbname={$params['dbname']};charset=UTF8"; // создаем dsn для подключения
$db = new PDO( $dsn, $params['user'], $params['password'] ); // создаем объект подключения к бд

$oneCar = array();

$result = $db->query("SELECT id, maker, model, made_year, top_speed, acceleration_to_100, power, weight, image "
    ."FROM cars "
    ."WHERE id=".$id);

$oneCar = $result->fetch();

//var_dump($oneCar);

echo json_encode($oneCar);