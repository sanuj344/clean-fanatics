import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { bookingAPI, ratingAPI } from '../../api/api';
import './Customer.css';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completing, setCompleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Rating state
  const [existingRating, setExistingRating] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingError, setRatingError] = useState('');
  const [ratingSuccess, setRatingSuccess] = useState('');

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const response = await bookingAPI.getBooking(id);
      setBooking(response.data.booking);
      setEvents(response.data.events || []);
      // Set existing rating from booking response if it exists
      setExistingRating(response.data.booking.rating || null);
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

  const handleCompleteBooking = async () => {
    if (!booking) return;

    setCompleting(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await bookingAPI.completeBooking(id);
      // Update booking and events from response
      setBooking(response.data.booking);
      setEvents(response.data.events || []);
      // Update existing rating if it exists in the response
      setExistingRating(response.data.booking.rating || null);
      setSuccessMessage('Booking marked as completed successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to complete booking';
      setError(errorMsg);
      console.error('Complete booking error:', err);
    } finally {
      setCompleting(false);
    }
  };

  const isBookingRejected = () => {
    if (!booking || !events) return false;
    
    // Check for rejection event: ASSIGNED → PENDING by PROVIDER
    const rejectionEvent = events.find(
      (event) =>
        event.fromStatus === 'ASSIGNED' &&
        event.toStatus === 'PENDING' &&
        event.actor === 'PROVIDER'
    );

    // A booking is rejected if:
    // 1. Status is PENDING
    // 2. providerId is null (was unassigned)
    // 3. There's a rejection event
    return (
      rejectionEvent !== undefined ||
      (booking.status === 'PENDING' && !booking.providerId && events.some(e => e.toStatus === 'ASSIGNED'))
    );
  };

  const shouldShowCompleteButton = () => {
    if (!booking || !user) return false;
    // Only show for CUSTOMER role
    if (user.role !== 'CUSTOMER') return false;
    // Don't show if booking was rejected
    if (isBookingRejected()) return false;
    // Only show for ASSIGNED or IN_PROGRESS status
    return booking.status === 'ASSIGNED' || booking.status === 'IN_PROGRESS';
  };

  const shouldShowRatingForm = () => {
    if (!booking || !user) return false;
    // Only show for CUSTOMER role
    if (user.role !== 'CUSTOMER') return false;
    // Only show if booking is COMPLETED and has no rating yet
    return booking.status === 'COMPLETED' && !existingRating;
  };

  const handleRatingSubmit = async () => {
    if (!selectedRating || selectedRating < 1 || selectedRating > 5) {
      setRatingError('Please select a rating between 1 and 5 stars');
      return;
    }

    setSubmittingRating(true);
    setRatingError('');
    setRatingSuccess('');

    try {
      const response = await ratingAPI.addRating({
        bookingId: id,
        rating: selectedRating,
        review: reviewText.trim() || null,
      });
      
      setExistingRating(response.data);
      setRatingSuccess('Thank you for your rating!');
      setSelectedRating(0);
      setReviewText('');
      
      // Refresh booking to get updated data
      await fetchBooking();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to submit rating';
      setRatingError(errorMsg);
      console.error('Submit rating error:', err);
    } finally {
      setSubmittingRating(false);
    }
  };

  const renderStarRating = (rating, interactive = false, onStarClick = null) => {
    return (
      <div className="star-rating" style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={interactive && onStarClick ? () => onStarClick(star) : undefined}
            style={{
              fontSize: '28px',
              color: star <= rating ? '#ff9800' : '#ddd',
              cursor: interactive && onStarClick ? 'pointer' : 'default',
              transition: 'color 0.2s',
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
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
          
          {successMessage && (
            <div className="success-banner">
              <span>{successMessage}</span>
              <button 
                className="close-banner" 
                onClick={() => setSuccessMessage('')}
                aria-label="Close"
              >
                ×
              </button>
            </div>
          )}

          {error && (
            <div className="error-banner">{error}</div>
          )}

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

          {/* Rejection Message */}
          {isBookingRejected() && (
            <div style={{ 
              marginBottom: '32px', 
              paddingBottom: '24px', 
              borderBottom: '1px solid #eee' 
            }}>
              <div className="error-banner" style={{ 
                background: '#fee', 
                color: '#c33', 
                padding: '16px', 
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: 600
              }}>
                ⚠️ Booking was rejected by provider
              </div>
              <p style={{ 
                marginTop: '12px', 
                color: '#666', 
                textAlign: 'center',
                fontSize: '14px'
              }}>
                This booking cannot be completed as it was rejected by the service provider.
              </p>
            </div>
          )}

          {/* Complete Button */}
          {shouldShowCompleteButton() && (
            <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #eee' }}>
              <button
                onClick={handleCompleteBooking}
                disabled={completing}
                className="btn-primary"
                style={{ width: '100%' }}
              >
                {completing ? 'Marking as Completed...' : 'Mark as Completed'}
              </button>
            </div>
          )}

          {/* Rating Section */}
          {booking.status === 'COMPLETED' && user?.role === 'CUSTOMER' && (
            <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #eee' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Rate Your Experience</h3>
              
              {existingRating ? (
                // Show existing rating (read-only)
                <div className="rating-display" style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontWeight: 600, color: '#333', marginRight: '12px' }}>Your Rating:</span>
                    {renderStarRating(existingRating.rating, false)}
                  </div>
                  {existingRating.review && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eee' }}>
                      <div style={{ fontWeight: 600, color: '#333', marginBottom: '8px' }}>Your Review:</div>
                      <div style={{ color: '#666', lineHeight: '1.6' }}>{existingRating.review}</div>
                    </div>
                  )}
                  <div style={{ marginTop: '12px', fontSize: '14px', color: '#999' }}>
                    Rated on {formatDate(existingRating.createdAt)}
                  </div>
                </div>
              ) : shouldShowRatingForm() ? (
                // Show rating form
                <div className="rating-form" style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                  {ratingSuccess && (
                    <div className="success-banner" style={{ marginBottom: '16px' }}>
                      {ratingSuccess}
                    </div>
                  )}
                  
                  {ratingError && (
                    <div className="error-banner" style={{ marginBottom: '16px' }}>
                      {ratingError}
                    </div>
                  )}

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#333' }}>
                      Rate this service:
                    </label>
                    {renderStarRating(selectedRating, true, setSelectedRating)}
                    {selectedRating > 0 && (
                      <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                        {selectedRating} {selectedRating === 1 ? 'star' : 'stars'}
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#333' }}>
                      Review (optional):
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience..."
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '16px',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <button
                    onClick={handleRatingSubmit}
                    disabled={submittingRating || selectedRating < 1}
                    className="btn-primary"
                    style={{ width: '100%' }}
                  >
                    {submittingRating ? 'Submitting...' : 'Submit Rating'}
                  </button>
                </div>
              ) : null}
            </div>
          )}

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
