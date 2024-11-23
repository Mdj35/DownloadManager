import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css'; 
import Header from './Header';

const HomePage = () => {
  const [services, setServices] = useState([]); // Recommended services with sales data
  const [allServices, setAllServices] = useState({}); // Object to hold services by type
  const [offsets, setOffsets] = useState({}); // Object to hold offsets for each service type
  const [hovered, setHovered] = useState(false); // State to track hover

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch('https://vynceianoani.helioho.st/getsales.php');
        const data = await response.json();

        if (data.services && Array.isArray(data.services)) {
          // Sort services by count of sales (assuming service_count is returned)
          const sortedServices = data.services.sort((a, b) => b.service_count - a.service_count);
          
          // Create a new array with the top 5 services based on sales
          const recommendedServices = sortedServices.slice(0, 5);
          
          setServices(recommendedServices);
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    const fetchAllServices = async () => {
      try {
        const response = await fetch('https://vynceianoani.helioho.st/servicespic.php');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const formattedServices = data.map(service => ({
            name: service.name,
            image: service.image_url,
            type: service.type,
            price: service.price,
            description: service.description
          }));

          // Separate services by type
          const servicesByType = formattedServices.reduce((acc, service) => {
            if (!acc[service.type]) {
              acc[service.type] = [];
            }
            acc[service.type].push(service);
            return acc;
          }, {});

          setAllServices(servicesByType);
        }
      } catch (error) {
        console.error('Error fetching all services:', error);
      }
    };

    fetchSalesData();
    fetchAllServices();
  }, []);

  // Combine the recommended services with their respective details (image and price)
  const enrichedRecommendedServices = services.map(service => {
    const foundService = Object.values(allServices).flat().find(s => s.name === service.service_name);
    return foundService ? { ...service, image: foundService.image, price: foundService.price } : service;
  });

  // Function to handle sliding offset for recommended services
  const handleNext = () => {
    const currentOffset = offsets['recommended'] || 0;
    if (currentOffset + 5 < enrichedRecommendedServices.length) {
      setOffsets(prev => ({ ...prev, recommended: currentOffset + 1 }));
    }
  };

  const handlePrev = () => {
    const currentOffset = offsets['recommended'] || 0;
    if (currentOffset > 0) {
      setOffsets(prev => ({ ...prev, recommended: currentOffset - 1 }));
    }
  };

  // Function to handle sliding offset for dynamic services
  const handleNextType = (type) => {
    const currentOffset = offsets[type] || 0;
    if (currentOffset + 5 < (allServices[type] || []).length) {
      setOffsets(prev => ({ ...prev, [type]: currentOffset + 1 }));
    }
  };

  const handlePrevType = (type) => {
    const currentOffset = offsets[type] || 0;
    if (currentOffset > 0) {
      setOffsets(prev => ({ ...prev, [type]: currentOffset - 1 }));
    }
  };

  return (
    <div>
      <div className="sticky-header">
        <Header />
      </div>
      <div className="homepage-container">
        <h1>Welcome to Chic Station</h1>
        <p>Explore our range of services to treat yourself.</p>

        {/* Recommended Services Section */}
        <h2 className='h2-homepage'>Recommended Services</h2>
        <div className="services-container" 
             onMouseEnter={() => setHovered(true)} 
             onMouseLeave={() => setHovered(false)}>
          {enrichedRecommendedServices.slice(offsets['recommended'] || 0, (offsets['recommended'] || 0) + 5).map((service, index) => (
            <div key={index} className="service-card">
              <Link 
                to={`/userpage?serviceType=${service.name}&serviceName=${service.name}&price=${service.price}`} 
                className="image-link"
              >
                <img src={service.image} alt={service.service_name} className="service-image" />
              </Link>
              <h3>{service.service_name} - ₱{service.price}</h3>
            </div>
          ))}

          {/* Conditionally render sliding buttons for recommended services */}
          {enrichedRecommendedServices.length > 5 && hovered && (
            <>
              <button className="slider-button left" onClick={handlePrev}>&lt;</button>
              <button className="slider-button right" onClick={handleNext}>&gt;</button>
            </>
          )}
        </div>

        {/* Render dynamic services by type */}
        {Object.keys(allServices).map((type) => (
          <div key={type} className="services-section">
            <h2 className='h2-homepage'>{type} Services</h2>
            <div 
              className="services-container" 
              onMouseEnter={() => setHovered(true)} 
              onMouseLeave={() => setHovered(false)}
            >
              {allServices[type].slice(offsets[type] || 0, (offsets[type] || 0) + 5).map((service, index) => (
                <div key={index} className="service-card">
                  <Link 
                    to={`/userpage?serviceType=${service.type}&serviceName=${service.name}&price=${service.price}`} 
                    className="image-link"
                  >
                    <img src={service.image} alt={service.name} className="service-image" />
                  </Link>
                  <h3>{service.name} - ₱{service.price}</h3>
                </div>
              ))}
              
              {/* Conditionally render sliding buttons for dynamic services */}
              {allServices[type].length > 5 && hovered && (
                <>
                  <button className="slider-button left" onClick={() => handlePrevType(type)}>&lt;</button>
                  <button className="slider-button right" onClick={() => handleNextType(type)}>&gt;</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;