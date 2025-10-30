import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import styles from './Events.module.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', contact: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/events');
        setEvents(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    const fetchSentApps = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;
        const res = await axios.get('http://localhost:3001/api/event-applications/sent', { headers: { Authorization: `Bearer ${accessToken}` }});
        const ids = new Set(res.data.map(a => a.eventId?._id || a.eventId));
        setAppliedIds(ids);
      } catch (e) { /* ignore */ }
    };
    fetchEvents();
    fetchSentApps();
  }, []);

  const openApply = (ev) => {
    setSelected(ev);
    setShowApply(true);
    setForm({ name: '', email: '', contact: '', notes: '' });
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.post('http://localhost:3001/api/event-applications', {
        eventId: selected._id,
        ...form
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setShowApply(false);
      setAppliedIds(prev => new Set([...Array.from(prev), selected._id]));
      setSuccessMsg('Application submitted! Track status in your Inbox.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.eventsPage}>
      <Navbar />
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>Volunteer Events</h1>
          <p>"The best way to find yourself is to lose yourself in the service of others."</p>
        </div>
      </div>
      <div className={styles.container}>
        {loading ? (
          <div className={styles.loading}>Loading events...</div>
        ) : (
          <div className={styles.grid}>
            {events.map(ev => (
              <div key={ev._id} className={`${styles.card} ${styles.wideCard}`}>
                <div className={styles.cardBody}>
                  <div>
                    <div className={styles.cardHeader}>
                      <h3>{ev.name}</h3>
                      <span className={styles.date}>{ev.date} • {ev.time}</span>
                    </div>
                    <p className={styles.desc}>{ev.description}</p>
                    <div className={styles.metaRow}>
                      <p className={styles.meta}><strong>Location:</strong> {ev.location}</p>
                      <p className={styles.meta}><strong>Max Participants:</strong> {ev.maxParticipants}</p>
                    </div>
                  </div>
                  <div className={styles.actions}>
                    {appliedIds.has(ev._id) ? (
                      <button disabled className={styles.appliedBtn}>Applied</button>
                    ) : (
                      <button onClick={() => openApply(ev)} className={styles.applyBtn}>Apply</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {successMsg && <div className={styles.success}>{successMsg}</div>}
      </div>

      {showApply && selected && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Apply for {selected.name}</h2>
            {error && <div className={styles.error}>{error}</div>}
            <form onSubmit={submit} className={styles.form}>
              <input placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input type="email" placeholder="Your Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              <input placeholder="Contact" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} required />
              <textarea placeholder="Additional Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowApply(false)}>Cancel</button>
                <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Events;


