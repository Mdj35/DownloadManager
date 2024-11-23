<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
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
$reservationId = isset($data['id']) ? $data['id'] : null;
$status = isset($data['status']) ? $data['status'] : null;

if (empty($reservationId) || empty($status)) {
    echo json_encode(["status" => "error", "message" => "Invalid input data."]);
    exit();
}

$sql = $conn->prepare("UPDATE reservations SET status = ? WHERE id = ?");
$sql->bind_param("si", $status, $reservationId);

if ($sql->execute()) {
    echo json_encode(["status" => "success", "message" => "Reservation status updated successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Error updating reservation status: " . $conn->error]);
}

$sql->close();
$conn->close();
?>
