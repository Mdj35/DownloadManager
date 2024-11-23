<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$servername = "localhost";
$username = ""; // Replace with your database username
$password = ""; // Replace with your database password
$dbname = "sample"; // Replace with your database name

// Get the JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Check if service name is provided in the request
if (!isset($input['serviceName'])) {
    echo json_encode(['error' => 'Invalid input. Service name is required.']);
    exit();
}

$serviceName = $input['serviceName'];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to fetch service ID based on service name
$query = "SELECT id FROM services WHERE name = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param("s", $serviceName);

$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $service_id = $row['id'];
    echo json_encode(['service_id' => $service_id]);
} else {
    echo json_encode(['error' => 'Service not found.']);
}

$stmt->close();
$conn->close();
?>
