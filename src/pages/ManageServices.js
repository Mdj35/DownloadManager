import React, { useState, useEffect } from 'react';
import '../styles/ManageServices.css';
import Header from './SuperAdminHeader';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';

const ManageServices = () => {
    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState({
        name: '',
        price: '',
        type: 'Nails',
        description: '',
        imageUrl: ''
    });
    const [editServiceId, setEditServiceId] = useState(null);
    const [selectedServiceType, setSelectedServiceType] = useState('All');
    const [imageFile, setImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await fetch('https://vynceianoani.helioho.st/getServices2.php');
            const data = await response.json();
            if (Array.isArray(data)) {
                setServices(data);
            } else {
                console.error('Unexpected data format: ', data);
                setServices([]);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            setServices([]);
        }
    };

    const uploadImage = async () => {
        if (imageFile) {
            const imageRef = ref(storage, `services/${imageFile.name}`);
            await uploadBytes(imageRef, imageFile);
            const url = await getDownloadURL(imageRef);
            return url;
        }
        return null;
    };

    const handleAddOrUpdateService = async () => {
        if (!newService.name || !newService.price || !newService.type || !newService.description) {
            alert('All fields must be filled out.');
            return;
        }

        setIsSubmitting(true);

        try {
            const imageUrl = imageFile ? await uploadImage() : newService.imageUrl;

            if (editServiceId) {
                // Update existing service
                const serviceData = { id: editServiceId, ...newService, imageUrl };
                const response = await fetch('https://vynceianoani.helioho.st/editService.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(serviceData)
                });

                const data = await response.json();
                if (data.success) {
                    fetchServices();
                    resetForm();
                } else {
                    alert('Failed to edit service.');
                }
            } else {
                // Add new service
                const serviceData = { ...newService, imageUrl };
                const response = await fetch('https://vynceianoani.helioho.st/addService.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(serviceData)
                });

                const data = await response.json();
                if (data.success) {
                    fetchServices();
                    resetForm();
                } else {
                    alert('Failed to add service.');
                }
            }
        } catch (error) {
            console.error('Error handling service:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setNewService({
            name: '',
            price: '',
            type: 'Nails',
            description: '',
            imageUrl: ''
        });
        setEditServiceId(null);
        setImageFile(null);
    };

    const handleEditClick = (service) => {
        setEditServiceId(service.id);
        setNewService({
            name: service.name,
            price: service.price,
            type: service.type,
            description: service.description,
            imageUrl: service.imageUrl
        });
    };

    const toggleServiceStatus = async (serviceId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'available' ? 'not available' : 'available';
            const response = await fetch('https://vynceianoani.helioho.st/toggleServiceStatus.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: serviceId, status: newStatus })
            });

            const data = await response.json();

            if (data.success) {
                fetchServices();
            } else {
                alert('Failed to toggle status.');
            }
        } catch (error) {
            console.error('Error toggling service status:', error);
        }
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const filteredServices = services.filter(service =>
        selectedServiceType === 'All' || service.type === selectedServiceType
    );

    return (
        <div className="background">
            <Header />
            <div className="manage-services-container">
                <h2 className="h2-manage">Manage Services</h2>

                <div className="form-container">
                    <input
                        type="text"
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        placeholder="Service Name"
                        className="input-field"
                    />
                    <input
                        type="number"
                        value={newService.price}
                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                        placeholder="Service Price"
                        className="input-field"
                    />
                    <textarea
                        value={newService.description}
                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        placeholder="Service Description"
                        className="input-field"
                        rows="3"
                    />
                    <select
                        value={newService.type}
                        onChange={(e) => setNewService({ ...newService, type: e.target.value })}
                        className="input-field"
                    >
                        <option value="Nails">Nails Services</option>
                        <option value="Lash and Brow">Lash and Brow Services</option>
                        <option value="Waxing">Waxing Services</option>
                        <option value="Hair and Make-up">Hair and Make-up</option>
                    </select>
                    <input type="file" onChange={handleImageChange} className="input-field" />
                    <button
                        className="add-button"
                        onClick={handleAddOrUpdateService}
                        disabled={isSubmitting}
                    >
                        {editServiceId ? 'Edit Service' : 'Add Service'}
                    </button>
                    {editServiceId && (
                        <button className="cancel-button" onClick={resetForm}>
                            Cancel Edit
                        </button>
                    )}
                </div>

                <div className="filter-container">
                    <label htmlFor="serviceTypeFilter">Filter by Service Type: </label>
                    <select
                        id="serviceTypeFilter"
                        value={selectedServiceType}
                        onChange={(e) => setSelectedServiceType(e.target.value)}
                        className="input-field"
                    >
                        <option value="All">All Services</option>
                        <option value="Nails">Nails Services</option>
                        <option value="Lash and Brow">Lash and Brow Services</option>
                        <option value="Waxing">Waxing Services</option>
                        <option value="Hair and Make-up">Hair and Make-up</option>
                    </select>
                </div>

                <ul className="services-list">
                    {filteredServices.length > 0 ? (
                        filteredServices.map((service) => (
                            <li key={service.id} className="service-item">
                                <span className="service-details">
                                    {service.name} - ₱{service.price} ({service.type})
                                </span>
                                <p className="service-description">{service.description}</p>
                                {service.imageUrl && (
                                    <img src={service.imageUrl} alt={service.name} className="service-image" />
                                )}
                                <span className={`status ${service.status}`}>Status: {service.status}</span>
                                <button
                                    className="toggle-status-btn"
                                    onClick={() => toggleServiceStatus(service.id, service.status)}
                                >
                                    Toggle Status
                                </button>
                                <button
                                    className="edit-btn"
                                    onClick={() => handleEditClick(service)}
                                >
                                    Edit
                                </button>
                            </li>
                        ))
                    ) : (
                        <li>No services available.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ManageServices;
