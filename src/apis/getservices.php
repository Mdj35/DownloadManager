<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
// Database configuration
$host = 'localhost'; // Change this to your database host
$dbname = 'sample'; // Change this to your database name
$username = ''; // Change this to your database username
$password = ''; // Change this to your database password

// Create a new PDO instance
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Query to fetch services
    $stmt = $pdo->query("SELECT name FROM services");

    // Fetch all services as an associative array
    $services = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Send JSON response
    header('Content-Type: application/json');
    echo json_encode(['services' => $services]);

} catch (PDOException $e) {
    // Handle connection errors
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
