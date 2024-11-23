<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";  // Replace with your database server name
$username = " "; // Replace with your database username
$password = " "; // Replace with your database password
$dbname = "sample"; // Replace with your database name

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"), true);

$fullName = $data['fullName'];
$email = $data['email'];
$password = $data['password'];
$contactNumber = $data['contactNumber'];

if (empty($fullName) || empty($email) || empty($password) || empty($contactNumber)) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "Invalid email format."]);
    exit();
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO users (fullName, email, password, contactNumber) VALUES ('$fullName', '$email', '$passwordHash', '$contactNumber')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "message" => "Account created successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
}

$conn->close();
?>
