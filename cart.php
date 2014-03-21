<?php

	$httpMethod = $_SERVER['REQUEST_METHOD'];

	if (!$httpMethod == 'POST') 
	{
		header('X-PHP-Response-Code: 405', true, 405); // method nod allowed
		exit;	
	}

	$cartToken = $_GET["token"];
	$productId = $_GET["id"];

	if (empty($cartToken) || !isset($productId) || !is_numeric($productId))
	{
		header('X-PHP-Response-Code: 400', true, 400); // bad request 
		exit;
	}

	/* ... store product id in cart with given cart token not implemented ... */

	$result = (object) array('result' => 'success');
	$json = json_encode($result);
	header('Content-type: application/json');
	exit($json);
?>