import React, { useState, useEffect } from 'react';
import '../styles/SuperAdmin.css';
import Header from './SuperAdminHeader';

const SuperAdmin = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        contactNumber: '',
        services: [],
        branch: '',
    });
    const [servicesList, setServicesList] = useState([]);
    const [branchesList, setBranchesList] = useState([]);
    const [message, setMessage] = useState('');
    const [deleteMessage, setDeleteMessage] = useState('');
    const [employees, setEmployees] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]); // Initialized as an empty array
    const [vipUsers, setVipUsers] = useState([]); // Added for VIP users

    const fetchServices = () => {
        fetch('https://vynceianoani.helioho.st/getservices.php')
            .then((response) => response.json())
            .then((data) => setServicesList(data.services))
            .catch((error) => console.error('Error fetching services:', error));
    };

    const fetchBranches = () => {
        fetch('https://vynceianoani.helioho.st/getbranches.php')
            .then((response) => response.json())
            .then((data) => setBranchesList(data.branches))
            .catch((error) => console.error('Error fetching branches:', error));
    };

    const fetchEmployees = () => {
        fetch('https://vynceianoani.helioho.st/getadmins.php') // Ensure this endpoint returns the list of employees
            .then((response) => response.json())
            .then((data) => setEmployees(data.employees || [])) // Handle potential undefined
            .catch((error) => console.error('Error fetching employees:', error));
    };

    const fetchPendingUsers = () => {
        fetch('https://vynceianoani.helioho.st/getpendingusers.php') // Add this endpoint to get pending users
            .then((response) => response.json())
            .then((data) => setPendingUsers(data.pendingUsers || [])) // Ensure it's always an array
            .catch((error) => console.error('Error fetching pending users:', error));
    };

    const fetchVipUsers = () => {
        fetch('https://vynceianoani.helioho.st/getvipusers.php') // Add this endpoint to get VIP users
            .then((response) => response.json())
            .then((data) => setVipUsers(data.vipUsers || [])) // Ensure it's always an array
            .catch((error) => console.error('Error fetching VIP users:', error));
    };

    const deactivateEmployee = (employeeId) => {
        fetch('https://vynceianoani.helioho.st/deleteadmin.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: employeeId }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    setDeleteMessage('Employee deactivated successfully!');
                    fetchEmployees(); // Refresh the employee list
                } else {
                    setDeleteMessage(data.message || 'An error occurred.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setDeleteMessage('An error occurred while deactivating the employee.');
            });
    };

    const activateEmployee = (employeeId) => {
        fetch('https://vynceianoani.helioho.st/activateadmin.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: employeeId }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    setDeleteMessage('Employee activated successfully!');
                    fetchEmployees(); // Refresh the employee list
                } else {
                    setDeleteMessage(data.message || 'An error occurred.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setDeleteMessage('An error occurred while activating the employee.');
            });
    };

    const setUserToVIP = (userId) => {
        fetch('https://vynceianoani.helioho.st/setvip.php', { // Add this endpoint to set user to VIP
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: userId }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    setMessage('User status updated to VIP!');
                    fetchPendingUsers(); // Refresh the pending users list
                    fetchVipUsers(); // Refresh the VIP users list
                } else {
                    setMessage(data.message || 'An error occurred.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setMessage('An error occurred while updating the user status.');
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            services: checked
                ? [...prevFormData.services, value]
                : prevFormData.services.filter((service) => service !== value),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('https://vynceianoani.helioho.st/createadmin.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    setMessage('Admin account created successfully!');
                    setFormData({
                        fullName: '',
                        email: '',
                        password: '',
                        contactNumber: '',
                        services: [],
                        branch: '',
                    });
                    fetchEmployees(); // Refresh the employee list
                } else {
                    setMessage(data.message || 'An error occurred.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setMessage('An error occurred while creating the account.');
            });
    };

    useEffect(() => {
        fetchEmployees(); // Fetch employees when component mounts
        fetchServices();
        fetchBranches();
        fetchPendingUsers(); // Fetch pending users
        fetchVipUsers(); // Fetch VIP users
    }, []);

    // Filter employees into active and inactive
    const activeEmployees = employees.filter((employee) => employee.status === 'active');
    const inactiveEmployees = employees.filter((employee) => employee.status === 'inactive');

    return (
        <div className="Header">
            <Header />
        <div className="superadmin-container">
            
            <h2>Create Admin Account</h2>
            {message && <div className="message">{message}</div>}
            {deleteMessage && <div className="message">{deleteMessage}</div>}
            <form className="superadmin-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name:</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Contact Number:</label>
                    <input
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        required
                        maxLength={11}
                    />
                </div>
                <div className="form-group">
                    <label>Branch:</label>
                    <select
                        name="branch"
                        value={formData.branch}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select a Branch</option>
                        {branchesList.map((branch, index) => (
                            <option key={index} value={branch.id}>
                                {branch.name} - {branch.address}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Services Offered:</label>
                    <table className="services-table">
                        <tbody>
                            {servicesList.map((service, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            value={service.name}
                                            checked={formData.services.includes(service.name)}
                                            onChange={handleCheckboxChange}
                                        />
                                    </td>
                                    <td>
                                        <label>{service.name}</label>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button type="submit" className="form-submit-button">
                    Create Admin
                </button>
            </form>

            <h2>Active Employees</h2>
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {activeEmployees.length > 0 ? (
                        activeEmployees.map((employee) => (
                            <tr key={employee.id}>
                                <td>{employee.fullName}</td>
                                <td>{employee.email}</td>
                                <td>
                                    <button onClick={() => deactivateEmployee(employee.id)}>Deactivate</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No active employees.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <h2>Inactive Employees</h2>
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inactiveEmployees.length > 0 ? (
                        inactiveEmployees.map((employee) => (
                            <tr key={employee.id}>
                                <td>{employee.fullName}</td>
                                <td>{employee.email}</td>
                                <td>
                                    <button onClick={() => activateEmployee(employee.id)}>Activate</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No inactive employees.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <h2>Pending Users</h2>
            <table className="pending-users-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingUsers.length > 0 ? (
                        pendingUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button onClick={() => setUserToVIP(user.id)}>Set as VIP</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No pending users.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <h2>VIP Users</h2>
            <table className="vip-users-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {vipUsers.length > 0 ? (
                        vipUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>VIP</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No VIP users.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default SuperAdmin;
