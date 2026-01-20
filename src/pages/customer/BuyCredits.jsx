import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { paymentAPI } from '../../api/api';
import './Customer.css';

const BuyCredits = ({ onClose, onSuccess }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCredits, setSelectedCredits] = useState(100);

  const creditPackages = [50, 100, 200];

  const handleBuy = async () => {
    if (!window.Razorpay) {
      setError('Razorpay SDK not loaded. Please refresh the page.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create order
      const orderResponse = await paymentAPI.createOrder({ credits: selectedCredits });
      const { orderId, amount, currency, key } = orderResponse.data;

      // Open Razorpay checkout
      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: 'Clean Fanatics',
        description: `Purchase ${selectedCredits} credits`,
        order_id: orderId,
        handler: async (response) => {
          try {
            // Verify payment
            await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              credits: selectedCredits,
            });

            // Refresh user credits
            await updateUser();
            
            // Show success and close
            if (onSuccess) onSuccess(selectedCredits);
            if (onClose) onClose();
          } catch (err) {
            setError(err.response?.data?.message || 'Payment verification failed');
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || 'Customer',
          email: user?.email || 'customer@example.com',
        },
        theme: {
          color: '#667eea',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content credit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Buy Credits</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        {error && <div className="error-banner">{error}</div>}
        
        <div className="credit-packages">
          <p className="credit-info">Select credit package:</p>
          <div className="package-grid">
            {creditPackages.map((credits) => {
              const amount = credits; // ₹1 = 1 credit
              return (
                <div
                  key={credits}
                  className={`package-card ${selectedCredits === credits ? 'selected' : ''}`}
                  onClick={() => setSelectedCredits(credits)}
                >
                  <div className="package-credits">{credits}</div>
                  <div className="package-label">Credits</div>
                  <div className="package-price">₹{amount}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="selected-package-info">
          <div className="info-row">
            <span>Selected:</span>
            <strong>{selectedCredits} credits</strong>
          </div>
          <div className="info-row">
            <span>Amount:</span>
            <strong>₹{selectedCredits}</strong>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-cancel">
            Cancel
          </button>
          <button
            onClick={handleBuy}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Processing...' : 'Buy Credits'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyCredits;
