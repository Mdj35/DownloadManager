import React, { useEffect, useState } from 'react';
import '../styles/ProfilePage.css'; // Import your CSS
import Header from './AdminHeader'; // Import the Header component
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase functions
import { storage } from '../firebaseConfig'; // Import the initialized Firebase storage
import img from '../images/default-profile.jpg';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        const response = await fetch('https://vynceianoani.helioho.st/getprofileadmin.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (data.status === 'success') {
          setUserData(data.data);
          setImageUrl(data.data.profileImageUrl || ''); // Fetch existing profile image if available
          
          if (email.includes('@chicstation')) {
            // Fetch services for the employee if applicable
            const servicesResponse = await fetch('https://vynceianoani.helioho.st/getemployee_services.php', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ employeeId: data.data.id }),
            });

            const servicesData = await servicesResponse.json();
            if (servicesData.status === 'success') {
              setServices(servicesData.services);
            } else {
              setError(servicesData.message || 'Failed to fetch services.');
            }
          }
        } else {
          setError(data.message || 'Failed to fetch user data.');
        }
      } catch (error) {
        setError('An error occurred while fetching user data.');
      }
    };

    fetchUserData();
  }, []);

  const uploadImage = async () => {
    if (imageUpload == null) return;

    try {
      const imageRef = ref(storage, `profile_pictures/${userData.email}`);
      await uploadBytes(imageRef, imageUpload);
      const url = await getDownloadURL(imageRef);

      // Optionally, update the user's profile picture URL in your backend
      const response = await fetch('https://vynceianoani.helioho.st/updateEmployeeImage.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          profileImage: url,
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setImageUrl(url); // Update the profile image URL in the UI
      } else {
        setError('Failed to update profile image.');
      }
    } catch (error) {
      setError('An error occurred while uploading the image.');
    }
  };

  const handleFileChange = (event) => {
    setImageUpload(event.target.files[0]);
  };

  const handleUploadClick = () => {
    uploadImage();
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
        <h1>User Profile</h1>
        <div className="profile-picture">
          <img
            src={imageUrl || img}
            alt="Profile"
            className="profile-img"
          />
        </div>
        <div className="profile-upload-container">
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            style={{ display: 'none' }} // Inline style as an object
            onChange={handleFileChange}
          />
          <button className="profile-upload-button" onClick={() => document.getElementById('fileInput').click()}>
            {imageUrl ? 'Change Profile Picture' : 'Upload Image'}
          </button>
          <button className="profile-upload-button" onClick={handleUploadClick}>Upload</button>
        </div>
        <div className="profile-info">
          <h2>{userData.fullName}</h2>
          <p1>Assigned {userData.branchName}: {userData.address}</p1>
          <div className="profile-row">
            <label>Full Name:</label>
            <span>{userData.fullName}</span>
          </div>
          <div className="profile-row">
            <label>Email:</label>
            <span>{userData.email}</span>
          </div>
          <div className="profile-row">
            <label>Contact Number:</label>
            <span>{userData.contactNumber}</span>
          </div>
          {services.length > 0 && (
            <div className="profile-row">
              <label>Services:</label>
              <ul>
                {services.map((service, index) => (
                  <li key={index}>{service.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProfilePage;