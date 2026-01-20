import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { bookingAPI } from '../../api/api';
import './Customer.css';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const response = await bookingAPI.getBooking(id);
      setBooking(response.data.booking);
      setEvents(response.data.events || []);
    } catch (err) {
      setError('Failed to load booking');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#ffa500',
      ASSIGNED: '#2196f3',
      IN_PROGRESS: '#4caf50',
      COMPLETED: '#4caf50',
      CANCELLED: '#f44336',
    };
    return colors[status] || '#666';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="customer-container">
        <div className="loading">Loading booking details...</div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="customer-container">
        <div className="error-banner">{error || 'Booking not found'}</div>
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
            <button onClick={() => navigate('/customer/home')} className="btn-secondary">
              Back
            </button>
          </div>
        </div>
      </header>

      <main className="booking-detail-main">
        <div className="booking-detail-card">
          <h2>Booking Details</h2>
          <div className="booking-info-section">
            <div className="info-row">
              <span className="info-label">Status:</span>
              <span
                className="status-badge"
                style={{ backgroundColor: getStatusColor(booking.status) }}
              >
                {booking.status}
              </span>
            </div>
            {booking.service && (
              <>
                <div className="info-row">
                  <span className="info-label">Service:</span>
                  <span className="info-value">{booking.service.title}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Category:</span>
                  <span className="info-value">{booking.service.category}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Cost:</span>
                  <span className="info-value">{booking.service.creditCost} credits</span>
                </div>
              </>
            )}
            {booking.provider && (
              <div className="info-row">
                <span className="info-label">Provider:</span>
                <span className="info-value">{booking.provider.name}</span>
              </div>
            )}
          </div>

          <div className="events-section">
            <h3>Booking Timeline</h3>
            {events.length === 0 ? (
              <div className="empty-events">No events yet</div>
            ) : (
              <div className="events-timeline">
                {events.map((event, index) => (
                  <div key={index} className="event-item">
                    <div className="event-dot"></div>
                    <div className="event-content">
                      <div className="event-status">
                        {event.fromStatus ? (
                          <>
                            <span className="status-from">{event.fromStatus}</span>
                            <span className="status-arrow">→</span>
                            <span className="status-to">{event.toStatus}</span>
                          </>
                        ) : (
                          <span className="status-to">Created: {event.toStatus}</span>
                        )}
                      </div>
                      <div className="event-meta">
                        <span className="event-actor">By: {event.actor}</span>
                        <span className="event-date">{formatDate(event.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingDetail;
