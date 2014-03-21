<?php

	$httpMethod = $_SERVER['REQUEST_METHOD'];

	if (!$httpMethod == 'GET') 
	{
		http_response_code(405); // method nod allowed
		exit;	
	}

	$id = $_GET["id"];

	if (!(isset($id) && is_numeric($id)))
	{
		header('X-PHP-Response-Code: 400', true, 400); // bad request
		exit;
	}

	$imgNo = $id % 2; // map id to existing image number

	$fileName = "./img/$imgNo.jpg";
	$img = fopen($fileName, 'rb');

	header('Content-Type: image/jpeg');
	header('Content-Length: ' . filesize($fileName));

	fpassthru($img);
	exit;
	
?>