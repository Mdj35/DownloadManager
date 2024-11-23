<?php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'];
$profileImage = $input['profileImage'];

// Connect to the database
include 'db.php'; // Include your DB connection script

// Get user_id from the users table
$sql = "SELECT id FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $user_id = $row['id'];

    // Check if the user already has a profile image
    $checkSql = "SELECT id FROM user_profile_images WHERE user_id = ?";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param('i', $user_id);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows > 0) {
        // Update existing profile image URL
        $updateSql = "UPDATE user_profile_images SET profile_image_url = ? WHERE user_id = ?";
        $updateStmt = $conn->prepare($updateSql);
        $updateStmt->bind_param('si', $profileImage, $user_id);
        
        if ($updateStmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Profile image updated successfully.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to update profile image.']);
        }
        $updateStmt->close();
    } else {
        // Insert new profile image URL
        $insertSql = "INSERT INTO user_profile_images (user_id, profile_image_url) VALUES (?, ?)";
        $insertStmt = $conn->prepare($insertSql);
        $insertStmt->bind_param('is', $user_id, $profileImage);
        
        if ($insertStmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Profile image saved successfully.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to save profile image.']);
        }
        $insertStmt->close();
    }

    $checkStmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'User not found.']);
}

$stmt->close();
$conn->close();
?>
