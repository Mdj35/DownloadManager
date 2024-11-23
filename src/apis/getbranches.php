<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$servername = "localhost";
$username = ""; // Replace with your database username
$password = ""; // Replace with your database password
$dbname = "sample"; // Replace with your database name

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

$sql = "SELECT id, name FROM branches";
$result = $conn->query($sql);

$branches = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $branches[] = ['id' => $row['id'], 'name' => $row['name']];
    }
}

echo json_encode(['branches' => $branches]);

$conn->close();
?>
