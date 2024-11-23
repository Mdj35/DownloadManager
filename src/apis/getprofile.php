<?php
header('Content-Type: application/json');

// Connect to the database
$conn = new mysqli('localhost', '', '', 'sample');

// Check for connection errors
if ($conn->connect_error) {
    die(json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]));
}

// Get the POST data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (isset($data['action'])) {
    switch ($data['action']) {
        case 'getUserInfo':
            getUserInfo($data, $conn);
            break;
        default:
            echo json_encode([
                'status' => 'error',
                'message' => 'Invalid action.'
            ]);
            break;
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'No action specified.'
    ]);
}

// Close the database connection
$conn->close();

// Function to get user info
function getUserInfo($data, $conn) {
    if (!isset($data['email'])) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Email not provided.'
        ]);
        return;
    }

    $email = $conn->real_escape_string($data['email']);

    $query = "SELECT fullName, email, contactNumber FROM users WHERE email = '$email'";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo json_encode([
            'status' => 'success',
            'user' => $user
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'User not found.'
        ]);
    }
}
?>
