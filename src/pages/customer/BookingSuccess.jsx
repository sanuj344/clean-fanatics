import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import './Customer.css';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser } = useAuth();
  const bookingId = location.state?.bookingId;
  const service = location.state?.service;

  useEffect(() => {
    updateUser(); // Refresh credits
  }, []);

  if (!bookingId) {
    return (
      <div className="customer-container">
        <div className="error-banner">Invalid booking</div>
        <button onClick={() => navigate('/customer/home')} className="btn-primary">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="customer-container">
      <main className="success-main">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Booking Successful!</h2>
          <p>Your booking has been confirmed.</p>
          {service && (
            <div className="booking-info">
              <p><strong>Service:</strong> {service.title}</p>
              <p><strong>Cost:</strong> {service.creditCost} credits</p>
            </div>
          )}
          <div className="success-actions">
            <button
              onClick={() => navigate(`/customer/booking/${bookingId}`)}
              className="btn-primary"
            >
              View Booking Details
            </button>
            <button
              onClick={() => navigate('/customer/home')}
              className="btn-secondary"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingSuccess;
