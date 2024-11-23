<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Database connection settings
$servername = "localhost:3306";  // Replace with your database server name
$username = "vynceianoani_sample"; // Replace with your database username
$password = "midnightdj35";        // Replace with your database password
$dbname = "vynceianoani_sample";   // Replace with your database name

// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// SQL query to fetch services
$sql = "SELECT id, name, price, type FROM services";
$result = $conn->query($sql);

$services = [];

// Check if the query returned any results
if ($result->num_rows > 0) {
    // Fetch the results as an associative array
    while($row = $result->fetch_assoc()) {
        $services[] = $row;
    }
}

// Return the data as JSON
echo json_encode($services);

// Close the database connection
$conn->close();
?>
