import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { providerAPI } from '../../api/api';
import './Provider.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await providerAPI.getAssignedBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bookingId) => {
    try {
      await providerAPI.acceptBooking(bookingId);
      fetchBookings(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept booking');
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await providerAPI.rejectBooking(bookingId);
      fetchBookings(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject booking');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      ASSIGNED: '#2196f3',
      IN_PROGRESS: '#4caf50',
    };
    return colors[status] || '#666';
  };

  if (loading) {
    return (
      <div className="provider-container">
        <div className="loading">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="provider-container">
      <header className="provider-header">
        <div className="header-content">
          <h1>Provider Dashboard</h1>
          <div className="header-right">
            <div className="user-info">{user?.name}</div>
            <button onClick={logout} className="btn-logout">Logout</button>
          </div>
        </div>
      </header>

      <main className="provider-main">
        {error && <div className="error-banner">{error}</div>}
        <h2>Assigned Bookings</h2>
        {bookings.length === 0 ? (
          <div className="empty-state">No assigned bookings</div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-id">Booking #{booking.id.slice(0, 8)}</div>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(booking.status) }}
                  >
                    {booking.status}
                  </span>
                </div>
                {booking.service && (
                  <div className="booking-details">
                    <div className="detail-item">
                      <span className="detail-label">Service:</span>
                      <span className="detail-value">{booking.service.title}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Category:</span>
                      <span className="detail-value">{booking.service.category}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Cost:</span>
                      <span className="detail-value">{booking.service.creditCost} credits</span>
                    </div>
                    {booking.customer && (
                      <div className="detail-item">
                        <span className="detail-label">Customer:</span>
                        <span className="detail-value">{booking.customer.name}</span>
                      </div>
                    )}
                  </div>
                )}
                {booking.status === 'ASSIGNED' && (
                  <div className="booking-actions">
                    <button
                      onClick={() => handleAccept(booking.id)}
                      className="btn-accept"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(booking.id)}
                      className="btn-reject"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
