import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { serviceAPI } from '../../api/api';
import BuyCredits from './BuyCredits';
import './Customer.css';

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBuyCredits, setShowBuyCredits] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
    updateUser(); // Refresh credits
  }, []);

  const fetchServices = async () => {
    try {
      const response = await serviceAPI.getServices();
      setServices(response.data);
    } catch (err) {
      setError('Failed to load services');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/customer/service/${serviceId}`);
  };

  if (loading) {
    return (
      <div className="customer-container">
        <div className="loading">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="customer-container">
      <header className="customer-header">
        <div className="header-content">
          <h1>Clean Fanatics</h1>
          <div className="header-right">
            <div className="credits-display">
              Credits: <span className="credits-value">{user?.credits || 0}</span>
            </div>
            <button
              onClick={() => setShowBuyCredits(true)}
              className="btn-buy-credits"
            >
              Buy Credits
            </button>
            <div className="user-info">
              {user?.name}
            </div>
            <button onClick={logout} className="btn-logout">Logout</button>
          </div>
        </div>
      </header>

      <main className="customer-main">
        {error && <div className="error-banner">{error}</div>}
        {successMessage && (
          <div className="success-banner">
            {successMessage}
            <button onClick={() => setSuccessMessage('')} className="close-banner">×</button>
          </div>
        )}
        <h2>Available Services</h2>
        <div className="services-grid">
          {services.length === 0 ? (
            <div className="empty-state">No services available</div>
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                className="service-card"
                onClick={() => handleServiceClick(service.id)}
              >
                <div className="service-category">{service.category}</div>
                <h3>{service.title}</h3>
                <p>{service.description || 'Professional service'}</p>
                <div className="service-footer">
                  <div className="service-rating">
                    ⭐ {service.ratingAvg?.toFixed(1) || 'N/A'}
                  </div>
                  <div className="service-cost">
                    {service.creditCost} credits
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {showBuyCredits && (
        <BuyCredits
          onClose={() => setShowBuyCredits(false)}
          onSuccess={(credits) => {
            setSuccessMessage(`Successfully purchased ${credits} credits!`);
            setShowBuyCredits(false);
            setTimeout(() => setSuccessMessage(''), 5000);
          }}
        />
      )}
    </div>
  );
};

export default Home;
