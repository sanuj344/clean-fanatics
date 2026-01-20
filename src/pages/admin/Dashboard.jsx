import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { adminAPI } from '../../api/api';
import './Admin.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overrideModal, setOverrideModal] = useState(null);
  const [overrideStatus, setOverrideStatus] = useState('');
  const [overrideReason, setOverrideReason] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await adminAPI.getAllBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOverride = async () => {
    if (!overrideModal || !overrideStatus) {
      setError('Please select a status');
      return;
    }

    try {
      await adminAPI.overrideBooking(overrideModal.id, {
        status: overrideStatus,
        reason: overrideReason,
      });
      setOverrideModal(null);
      setOverrideStatus('');
      setOverrideReason('');
      fetchBookings(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to override booking');
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

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <div className="header-right">
            <div className="user-info">{user?.name}</div>
            <button onClick={logout} className="btn-logout">Logout</button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        {error && <div className="error-banner">{error}</div>}
        <h2>All Bookings</h2>
        {bookings.length === 0 ? (
          <div className="empty-state">No bookings found</div>
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
                <div className="booking-details">
                  {booking.service && (
                    <>
                      <div className="detail-item">
                        <span className="detail-label">Service:</span>
                        <span className="detail-value">{booking.service.title}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Category:</span>
                        <span className="detail-value">{booking.service.category}</span>
                      </div>
                    </>
                  )}
                  {booking.customer && (
                    <div className="detail-item">
                      <span className="detail-label">Customer:</span>
                      <span className="detail-value">{booking.customer.name}</span>
                    </div>
                  )}
                  {booking.provider && (
                    <div className="detail-item">
                      <span className="detail-label">Provider:</span>
                      <span className="detail-value">{booking.provider.name}</span>
                    </div>
                  )}
                  {booking.phone && (
                    <div className="detail-item">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{booking.phone}</span>
                    </div>
                  )}
                  {booking.houseNumber && (
                    <div className="detail-item">
                      <span className="detail-label">Address:</span>
                      <span className="detail-value">
                        {booking.houseNumber}
                        {booking.landmark && `, ${booking.landmark}`}
                        {booking.addressLabel && ` (${booking.addressLabel})`}
                      </span>
                    </div>
                  )}
                </div>
                <div className="booking-actions">
                  <button
                    onClick={() => setOverrideModal(booking)}
                    className="btn-override"
                  >
                    Override Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {overrideModal && (
        <div className="modal-overlay" onClick={() => setOverrideModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Override Booking Status</h3>
            <div className="form-group">
              <label>Status</label>
              <select
                value={overrideStatus}
                onChange={(e) => setOverrideStatus(e.target.value)}
                className="form-select"
              >
                <option value="">Select status</option>
                <option value="PENDING">PENDING</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
            <div className="form-group">
              <label>Reason (optional)</label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                className="form-textarea"
                placeholder="Manual override reason"
                rows="3"
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setOverrideModal(null)} className="btn-cancel">
                Cancel
              </button>
              <button onClick={handleOverride} className="btn-confirm">
                Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
