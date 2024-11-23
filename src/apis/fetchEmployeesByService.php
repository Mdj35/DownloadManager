// fetchEmployeesByService.php
<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$servername = "localhost";
$username = ""; // Replace with your database username
$password = ""; // Replace with your database password
$dbname = "sample"; // Replace with your database name

$conn = new mysqli($servername, $username, $password, $dbname);
$service = $_POST['service'];
$branch = $_POST['branch'];

$query = "SELECT employees.id, employees.name, employee_images.profile_image_url 
          FROM employees 
          JOIN employee_services ON employees.id = employee_services.employee_id 
          JOIN services ON services.id = employee_services.service_id
          LEFT JOIN user_profile_images ON employees.id = user_profile_images.user_id
          WHERE services.name = ? AND employees.branch_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("si", $service, $branch);
$stmt->execute();
$result = $stmt->get_result();
$employees = [];
while ($row = $result->fetch_assoc()) {
    $employees[] = $row;
}
echo json_encode(['employees' => $employees]);
?>
