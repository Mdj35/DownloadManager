import React, { useEffect, useState } from 'react';
import '../styles/ProfilePage.css'; // Import your CSS
import Header from '../pages/Header'; // Import the Header component
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase functions
import { storage } from '../firebaseConfig'; // Import the initialized Firebase storage
import img from '../images/default-profile.jpg';
import { auth } from "../firebaseConfig"; // If using Firebase authentication


const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState(""); // New state for email
  const [isEditing, setIsEditing] = useState(false); // Track editing mode
  const [totalReservations, setTotalReservations] = useState(0); // State for total reservations
  const [totalSpent, setTotalSpent] = useState(0); // State for total amount spent
  const [isVipEligible, setIsVipEligible] = useState(false); // State for VIP eligibility
  const [userId, setUserId] = useState(""); // State to store user_id
  const [vipStatus, setVipStatus] = useState(""); // State for VIP application status

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if userEmail exists in localStorage
        const storedEmail = localStorage.getItem("userEmail");
  
        if (storedEmail) {
          // If stored email exists, fetch user data from the backend
          const response = await fetch("https://vynceianoani.helioho.st/getprofile.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: storedEmail }),
          });
  
          const data = await response.json();
          if (data.status === "success") {
            setUserData(data.data);
            setFullName(data.data.fullName);
            setContactNumber(data.data.contactNumber);
            setEmail(data.data.email); // Set email from fetched data
            setImageUrl(data.data.profileImageUrl || "");
            setUserId(data.data.id);
            setVipStatus(data.data.status);
  
            // Fetch total reservations and total spent using the new API
            if (data.data.id) {
              fetchReservationStats(data.data.id); // Pass user_id to fetchReservationStats
            }
          } else {
            setError(data.message || "Failed to fetch user data.");
          }
        } else {
          // If userEmail is not in localStorage, check auth.currentUser
          const user = auth.currentUser;
  
          if (user) {
            const userDetails = {
              name: user.displayName,
              email: user.email,
              profilePicture: user.photoURL,
            };
  
            // Store user details in localStorage
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userDetails', JSON.stringify(userDetails));
  
            // Set user data
            setUserData(userDetails);
            setFullName(user.displayName);
            setEmail(user.email);
            setImageUrl(user.photoURL);
          } else {
            setError("No user authenticated and no email found in localStorage.");
          }
        }
      } catch (error) {
        setError("An error occurred while fetching user data.");
      }
    };
  
    
    
    // Function to fetch total reservations and total spent based on user_id
    const fetchReservationStats = async (id) => {
      try {
        const response = await fetch(
          "https://vynceianoani.helioho.st/getUserReservationStat.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: id }),
          }
        );

        const data = await response.json();
        if (data.status === "success") {
          setTotalReservations(data.totalReservations || 0);
          setTotalSpent(data.totalSpent || 0);

          // Check if user is eligible for VIP
          if (data.totalReservations >= 5 && data.totalSpent >= 5000) {
            setIsVipEligible(true);
          }
        } else {
          setError(data.message || "Failed to fetch reservation stats.");
        }
      } catch (error) {
        setError("An error occurred while fetching reservation stats.");
      }
    };

    fetchUserData();
  }, []);

  const uploadImage = async () => {
    if (imageUpload == null) return;

    try {
      const imageRef = ref(storage, `profile_pictures/${email}`);
      await uploadBytes(imageRef, imageUpload);
      const url = await getDownloadURL(imageRef);

      // Optionally, update the user's profile picture URL in your backend
      const response = await fetch("https://vynceianoani.helioho.st/updateProfileImage.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          profileImage: url,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setImageUrl(url); // Update the profile image URL in the UI
      } else {
        setError("Failed to update profile image.");
      }
    } catch (error) {
      setError("An error occurred while uploading the image.");
    }
  };

  const handleFileChange = (event) => {
    setImageUpload(event.target.files[0]);
  };

  const handleUploadClick = () => {
    uploadImage();
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await fetch("https://vynceianoani.helioho.st/updateProfile.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldEmail: userData.email, // Send the old email as well to identify the user
          fullName,
          contactNumber,
          email,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setUserData((prev) => ({
          ...prev,
          fullName,
          contactNumber,
          email,
        }));
        localStorage.setItem("userEmail", email); // Update localStorage with the new email
        setIsEditing(false); // Exit editing mode after successful update
      } else {
        setError("Failed to update profile.");
      }
    } catch (error) {
      setError("An error occurred while updating the profile.");
    }
  };

  const handleVipApplication = async () => {
    try {
      const response = await fetch("https://vynceianoani.helioho.st/updateVipStatus.php", {
        // New PHP endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          status: "pending",
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setVipStatus("pending"); // Update VIP status
      } else {
        setError("Failed to apply for VIP status.");
      }
    } catch (error) {
      setError("An error occurred while applying for VIP status.");
    }
  };

  if (error) {
    return <div className="profile-page error">{error}</div>;
  }

  if (!userData) {
    return <div className="profile-page">Loading...</div>;
  }

  return (
    <div>
      <Header />
      <div className="profile-page-container">
        <div className="profile-page">
          <h1>Profile Information</h1>
          <div className="profile-content">
            <div className="profile-upload-section">
              <div className="profile-picture">
                <img src={imageUrl || img} alt="Profile" className="profile-img" />
              </div>
              <div className="profile-upload-container">
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <button
                  className="profile-upload-button"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  {imageUrl ? "Change Profile Picture" : "Upload Image"}
                </button>
                <button
                  className="profile-upload-button"
                  onClick={handleUploadClick}
                >
                  Upload
                </button>
              </div>
            </div>
            <div className="profile-info">
              {isEditing ? (
                <>
                  <div className="profile-row">
                    <label>Full Name:</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="profile-row">
                    <label>Contact Number:</label>
                    <input
                      type="text"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                    />
                  </div>
                  <div className="profile-row">
                    <label>Email:</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <button
                    className="profile-save-button"
                    onClick={handleProfileUpdate}
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <div className="profile-row">
                    <label>Full Name:</label>
                    <span>{userData.fullName}</span>
                  </div>
                  <div className="profile-row">
                    <label>Contact Number:</label>
                    <span>{userData.contactNumber}</span>
                  </div>
                  <div className="profile-row">
                    <label>Email:</label>
                    <span>{userData.email}</span>
                  </div>
                  <div className="profile-row">
                    <label>Status:</label>
                    {userData.status !== "VIP" ? (
                      <span>{userData.status}</span>
                    ) : (
                      <div className="vip-badge">
                        <span>🏆 VIP</span>
                        <p>You are a VIP!</p>
                      </div>
                    )}
                  </div>
                  <div className="profile-row">
                    <label>Total Reservations:</label>
                    <span>{totalReservations}</span>
                  </div>
                  <div className="profile-row">
                    <label>Total Spent:</label>
                    <span>{totalSpent}</span>
                  </div>

                  {/* VIP Button */}
                  {isVipEligible && vipStatus === "Non-VIP" ? (
                    <button className="vip-button" onClick={handleVipApplication}>
                      Apply for VIP
                    </button>
                  ) : vipStatus === "Pending" ? (
                    <div className="vip-status">
                      <p>Your VIP application is pending.</p>
                    </div>
                  ) : vipStatus === "VIP" ? (
                    <div className="vip-note">
                      <p>Congratulations! You are now a VIP</p>
                    </div>
                  ) : (
                    <div className="vip-note">
                      <p>
                        To unlock VIP status, make at least 5 reservations and
                        spend at least 5,000.
                      </p>
                    </div>
                  )}

                  <button
                    className="profile-edit-button"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default ProfilePage;