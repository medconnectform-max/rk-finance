import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { User, Phone, Fingerprint, Calendar } from 'lucide-react';
import { EXAM_OPTIONS } from '../config/questionData';

export default function GeneralDetailsForm() {
  const [details, setDetails] = useLocalStorage('generalDetails', {
    fullName: '',
    uniqueId: '',
    mobile: '',
    exam: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Basic mobile validation allowing only numbers
    if (name === 'mobile' && value !== '' && !/^\d+$/.test(value)) {
      return;
    }
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    if (window.confirm("Are you sure you want to clear your general details?")) {
      setDetails({
        fullName: '', uniqueId: '', mobile: '', exam: ''
      });
    }
  };

  return (
    <div className="glass-card mb-6">
      <div className="flex justify-between items-center mb-4 border-b pb-2" style={{ borderBottom: '1px solid var(--card-border)' }}>
        <h2 className="flex items-center gap-2">
          <User size={22} color="var(--accent-primary)" />
          General Details
        </h2>
        <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={resetForm}>
          Reset Form
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label flex items-center gap-1">
            <User size={14}/> Full Name : *
          </label>
          <input type="text" name="fullName" value={details.fullName} onChange={handleChange} className="form-input" placeholder="e.g. Sneh" required />
        </div>

  

        <div className="form-group">
          <label className="form-label flex items-center gap-1">
            <Phone size={14}/> Mobile Number *
          </label>
          <input type="tel" name="mobile" value={details.mobile} onChange={handleChange} className="form-input" placeholder="e.g. 93213860123" required />
        </div>

        <div className="form-group">
          <label className="form-label flex items-center gap-1">
            <Calendar size={14}/> Which exam are you appearing for ? *
          </label>
          <select name="exam" value={details.exam} onChange={handleChange} className="form-select" required>
            <option value="" disabled>-- Select Exam --</option>
            {EXAM_OPTIONS.map((exam) => (
              <option key={exam} value={exam}>
                {exam}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
