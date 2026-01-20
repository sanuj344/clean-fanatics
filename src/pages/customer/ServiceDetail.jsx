import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { serviceAPI, bookingAPI } from '../../api/api';
import './Customer.css';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const response = await serviceAPI.getServices();
      const foundService = response.data.find(s => s.id === id);
      if (foundService) {
        setService(foundService);
      } else {
        setError('Service not found');
      }
    } catch (err) {
      setError('Failed to load service');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!service) return;

    if (user.credits < service.creditCost) {
      setError('Insufficient credits');
      return;
    }

    setBookingLoading(true);
    setError('');

    try {
      const response = await bookingAPI.createBooking({ serviceId: service.id });
      // Update user credits
      await updateUser();
      // Navigate to success page
      navigate(`/customer/booking-success`, { 
        state: { bookingId: response.data.id, service: service } 
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="customer-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="customer-container">
        <div className="error-banner">Service not found</div>
        <button onClick={() => navigate('/customer/home')} className="btn-primary">
          Back to Home
        </button>
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
            <button onClick={() => navigate('/customer/home')} className="btn-secondary">
              Back
            </button>
          </div>
        </div>
      </header>

      <main className="service-detail-main">
        {error && <div className="error-banner">{error}</div>}
        <div className="service-detail-card">
          <div className="service-category">{service.category}</div>
          <h2>{service.title}</h2>
          <p className="service-description">
            {service.description || 'Professional service'}
          </p>
          <div className="service-info">
            <div className="info-item">
              <span className="info-label">Rating:</span>
              <span className="info-value">⭐ {service.ratingAvg?.toFixed(1) || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Cost:</span>
              <span className="info-value credits-highlight">{service.creditCost} credits</span>
            </div>
            <div className="info-item">
              <span className="info-label">Your Credits:</span>
              <span className={`info-value ${user.credits < service.creditCost ? 'insufficient' : ''}`}>
                {user?.credits || 0}
              </span>
            </div>
          </div>
          <button
            onClick={handleBook}
            disabled={bookingLoading || user.credits < service.creditCost}
            className="btn-book"
          >
            {bookingLoading
              ? 'Booking...'
              : user.credits < service.creditCost
              ? 'Insufficient Credits'
              : 'Book Now'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default ServiceDetail;
