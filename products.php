<?php

	$httpMethod = $_SERVER['REQUEST_METHOD'];

	if (!$httpMethod == 'GET') 
	{
		header('X-PHP-Response-Code: 405', true, 405); // method nod allowed
		exit;	
	}
	
	$skip = $_GET["skip"];
	$take = $_GET["take"];

	if (empty($skip))
	{
		$skip = 0;
	}

	if (empty($take))
	{
		$take = 20;
	}

	if (!(is_numeric($skip) && is_numeric($take)))
	{
		header('X-PHP-Response-Code: 400', true, 400); // bad request if skip and take are not numbers
		exit;
	}

	/*
		... loading product data from repository not implemented ...
	*/

	$products = array();
	for ($i=$skip; $i < ($skip + $take); $i++) { 
		$products[] = (object) array('name' => "Product $i", 'price' => "$i.99€");

	}
	$json = json_encode($products);
	header('Content-type: application/json');
	exit($json);
?>