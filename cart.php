<?php

	$httpMethod = $_SERVER['REQUEST_METHOD'];

	if (!$httpMethod == 'POST') 
	{
		http_response_code(405); // method nod allowed
		exit;	
	}

	$cartToken = $_GET["token"];
	$productId = $_GET["id"];

	if (empty($cartToken) || !isset($productId) || !is_numeric($productId))
	{
		http_response_code(400); // bad request
		exit;
	}

	/* ... store product id in cart with given cart token not implemented ... */

	$result = (object) array('result' => 'success');
	$json = json_encode($result);
	header('Content-type: application/json');
	exit($json);
?>