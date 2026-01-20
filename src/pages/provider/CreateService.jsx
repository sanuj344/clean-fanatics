import { useState } from 'react';
import { providerAPI } from '../../api/api';
import './Provider.css';

const CreateService = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    creditCost: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await providerAPI.createService({
        ...formData,
        creditCost: parseInt(formData.creditCost),
      });
      
      if (onSuccess) onSuccess(response.data);
      if (onClose) onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create New Service</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Home Cleaning"
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              placeholder="Cleaning"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Full house cleaning service"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Credit Cost *</label>
            <input
              type="number"
              value={formData.creditCost}
              onChange={(e) => setFormData({ ...formData, creditCost: e.target.value })}
              required
              min="1"
              placeholder="50"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating...' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateService;
