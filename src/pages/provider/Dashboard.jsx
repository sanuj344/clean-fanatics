import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { providerAPI } from '../../api/api';
import CreateService from './CreateService';
import './Provider.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateService, setShowCreateService] = useState(false);
  const [activeTab, setActiveTab] = useState('bookings'); // 'services' or 'bookings'

  useEffect(() => {
    fetchBookings();
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await providerAPI.getMyServices();
      setServices(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setServicesLoading(false);
    }
  };

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
        
        <div className="dashboard-tabs">
          <button
            className={activeTab === 'services' ? 'tab-active' : ''}
            onClick={() => setActiveTab('services')}
          >
            My Services
          </button>
          <button
            className={activeTab === 'bookings' ? 'tab-active' : ''}
            onClick={() => setActiveTab('bookings')}
          >
            Assigned Bookings
          </button>
        </div>

        {activeTab === 'services' && (
          <div className="services-section">
            <div className="section-header">
              <h2>My Services</h2>
              <button
                onClick={() => setShowCreateService(true)}
                className="btn-primary"
              >
                + Create Service
              </button>
            </div>
            {servicesLoading ? (
              <div className="loading">Loading services...</div>
            ) : services.length === 0 ? (
              <div className="empty-state">
                <p>No services created yet.</p>
                <button
                  onClick={() => setShowCreateService(true)}
                  className="btn-primary"
                >
                  Create Your First Service
                </button>
              </div>
            ) : (
              <div className="services-grid">
                {services.map((service) => (
                  <div key={service.id} className="service-card">
                    <div className="service-category">{service.category}</div>
                    <h3>{service.title}</h3>
                    <p>{service.description || 'No description'}</p>
                    <div className="service-footer">
                      <div className="service-rating">
                        ⭐ {service.ratingAvg?.toFixed(1) || '0.0'}
                      </div>
                      <div className="service-cost">
                        {service.creditCost} credits
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookings-section">
            <h2>Assigned Bookings</h2>
            {loading ? (
              <div className="loading">Loading bookings...</div>
            ) : bookings.length === 0 ? (
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
                          <>
                            <div className="detail-item">
                              <span className="detail-label">Customer:</span>
                              <span className="detail-value">{booking.customer.name}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Phone:</span>
                              <span className="detail-value">{booking.phone}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Address:</span>
                              <span className="detail-value">
                                {booking.houseNumber}
                                {booking.landmark && `, ${booking.landmark}`}
                                {booking.addressLabel && ` (${booking.addressLabel})`}
                              </span>
                            </div>
                          </>
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
          </div>
        )}
      </main>

      {showCreateService && (
        <CreateService
          onClose={() => setShowCreateService(false)}
          onSuccess={(service) => {
            setServices([service, ...services]);
            setShowCreateService(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
