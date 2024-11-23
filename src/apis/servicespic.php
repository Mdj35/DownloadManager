<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Database connection details
$servername = "localhost";
$dbname = "sample";
$username = "root";
$password = ""; // Add your password

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Select service details including image URL
$sql = "SELECT id, name, price, status, type, image_url FROM services where status = 'available'";
$result = $conn->query($sql);

$services = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $services[] = $row; // Add each service record to the array
    }
}

// Return the services as JSON
echo json_encode($services);

// Close the
