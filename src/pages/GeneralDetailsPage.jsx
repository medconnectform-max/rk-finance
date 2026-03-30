import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import GeneralDetailsForm from '../components/GeneralDetailsForm';
import { ArrowLeft } from 'lucide-react';

export default function GeneralDetailsPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className="app-container" style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', maxWidth: '800px', margin: '0 auto' }}>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="btn btn-outline"
          style={{ alignSelf: 'flex-start', marginBottom: '1.5rem' }}
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
        <GeneralDetailsForm />
      </main>
    </div>
  );
}
