<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

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

$data = json_decode(file_get_contents("php://input"), true);

$service = isset($data['service']) ? $data['service'] : null;
$date = isset($data['date']) ? $data['date'] : null;
$time = isset($data['time']) ? $data['time'] : null;
$email = isset($data['email']) ? $data['email'] : null;
$status = "pending"; // Set the status to "pending"

if (empty($service) || empty($date) || empty($time) || empty($email)) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit();
}

// Get user ID from email
$sql = "SELECT id FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "User not found."]);
    exit();
}

$user = $result->fetch_assoc();
$user_id = $user['id'];

// Insert reservation into the database with pending status
$sql = "INSERT INTO reservations (user_id, service, date, time, status) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param('issss', $user_id, $service, $date, $time, $status);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Reservation successful and set to pending!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
