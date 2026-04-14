import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { User, Phone, Calendar, ArrowRight } from 'lucide-react';
import { EXAM_OPTIONS } from '../config/questionData';

export default function GeneralDetailsForm() {
  const navigate = useNavigate();

  const [details, setDetails] = useLocalStorage('generalDetails', {
    fullName: '',
    uniqueId: '',
    mobile: '',
    exam: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only numbers in mobile field
    if (name === 'mobile' && value !== '' && !/^\d+$/.test(value)) {
      return;
    }

    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    if (window.confirm('Are you sure you want to clear your general details?')) {
      setDetails({
        fullName: '',
        uniqueId: '',
        mobile: '',
        exam: '',
      });
    }
  };

  return (
    <div className="glass-card mb-6 p-5 rounded-2xl shadow-md">
      <div
        className="flex justify-between items-center mb-5 pb-3 border-b"
        style={{ borderBottom: '1px solid var(--card-border)' }}
      >
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <User size={22} color="var(--accent-primary)" />
          General Details
        </h2>

        <button
          type="button"
          className="btn btn-outline"
          style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
          onClick={resetForm}
        >
          Reset Form
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
        }}
      >
        <div className="form-group">
          <label className="form-label flex items-center gap-1 mb-2">
            <User size={14} />
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={details.fullName}
            onChange={handleChange}
            className="form-input w-full"
            placeholder="e.g. Sneh"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label flex items-center gap-1 mb-2">
            <Phone size={14} />
            Mobile Number *
          </label>
          <input
            type="tel"
            name="mobile"
            value={details.mobile}
            onChange={handleChange}
            className="form-input w-full"
            placeholder="e.g. 93213860123"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label flex items-center gap-1 mb-2">
            <Calendar size={14} />
            Which exam are you appearing for? *
          </label>
          <select
            name="exam"
            value={details.exam}
            onChange={handleChange}
            className="form-select w-full"
            required
          >
            <option value="" disabled>
              -- Select Exam --
            </option>
            {EXAM_OPTIONS.map((exam) => (
              <option key={exam} value={exam}>
                {exam}
              </option>
            ))}
          </select>
          
        </div>
        
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="btn btn-outline flex items-center gap-2"
          style={{ alignSelf: 'flex-start' }}
        >
          <ArrowRight size={18} />
          Next
        </button>
      </div>
    </div>
  );
}