<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Database connection
$servername = "localhost";
$username = "";
$password = "";
$dbname = "sample"; // Replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Get the input data
$data = json_decode(file_get_contents('php://input'), true);
$employeeId = $data['id'] ?? '';

// Validate input
if (empty($employeeId)) {
    echo json_encode(['status' => 'error', 'message' => 'Employee ID is required']);
    exit;
}

// Prepare and execute the SQL query
$sql = "UPDATE employees SET status = 'active' WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $employeeId);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update employee status']);
}

$stmt->close();
$conn->close();
?>