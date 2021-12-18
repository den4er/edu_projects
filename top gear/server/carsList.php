<?php

$params = array();

$params['host'] = 'localhost';
$params['dbname'] = 'php_js';
$params['user'] = 'root';
$params['password'] = 'root';


$dsn = "mysql:host={$params['host']};dbname={$params['dbname']};charset=UTF8"; // создаем dsn для подключения
$db = new PDO( $dsn, $params['user'], $params['password'] ); // создаем объект подключения к бд

//echo 'connected';

$carsList = array(); // объявляем массив для результатов

// выполняем запрос на получение данных и кладем в переменную
$result = $db->query("SELECT id, maker, model, made_year, top_speed, acceleration_to_100, power, weight, image "
    ."FROM cars "
    ."ORDER BY maker");

// формируем из ресурса массив с данными из бд
$i = 0;
while($row = $result->fetch())
{
    $carsList[$i]['id'] = $row['id'];
    $carsList[$i]['maker'] = ['Производитель', $row['maker']];
    $carsList[$i]['model'] = $row['model'];
    $carsList[$i]['madeYear'] = $row['made_year'];
    $carsList[$i]['topSpeed'] = $row['top_speed'];
    $carsList[$i]['accelerationTo100'] = $row['acceleration_to_100'];
    $carsList[$i]['power'] = $row['power'];
    $carsList[$i]['weight'] = $row['weight'];
    $carsList[$i]['image'] = $row['image'];
    $i++;
}

//var_dump($carsList);

echo json_encode($carsList);