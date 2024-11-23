<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection details
$servername = "localhost"; // Replace with your database server name
$username = ""; // Replace with your database username
$password = ""; // Replace with your database password
$dbname = "sample"; // Replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the POST data
$inputData = json_decode(file_get_contents('php://input'), true);
$employeeId = isset($inputData['employeeId']) ? $inputData['employeeId'] : null;

if (empty($employeeId)) {
    echo json_encode(["status" => "error", "message" => "Employee ID is required."]);
    exit();
}

// Fetch services associated with the employee
$sql = "
    SELECT s.name 
    FROM employee_services es
    JOIN services s ON es.service_id = s.id
    WHERE es.employee_id = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $employeeId);
$stmt->execute();
$result = $stmt->get_result();

$services = [];
while ($row = $result->fetch_assoc()) {
    $services[] = $row;
}

// Return services data
$response = [
    "status" => "success",
    "services" => $services
];

echo json_encode($response);

$stmt->close();
$conn->close();
?>
