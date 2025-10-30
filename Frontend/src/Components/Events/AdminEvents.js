import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import styles from './AdminEvents.module.css';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', date: '', time: '', location: '', maxParticipants: '' });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [apps, setApps] = useState([]);

  const accessToken = localStorage.getItem('accessToken');

  const load = async () => {
    try {
      const [evRes, appRes] = await Promise.all([
        axios.get('http://localhost:3001/api/events/my', { headers: { Authorization: `Bearer ${accessToken}` }}),
        axios.get('http://localhost:3001/api/event-applications/received', { headers: { Authorization: `Bearer ${accessToken}` }})
      ]);
      setEvents(evRes.data);
      setApps(appRes.data.map(a => ({
        ...a,
        id: a._id,
        eventName: a.eventId?.name,
        applicantName: a.applicantId?.name,
        applicantEmail: a.applicantId?.email,
        date: new Date(a.createdAt).toLocaleDateString()
      })));
    } catch (e) { console.error(e); }
  };

  useEffect(() => { load(); // eslint-disable-next-line
  }, []);

  const submit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (editing) {
        await axios.put(`http://localhost:3001/api/events/${editing._id}`, { ...form, maxParticipants: Number(form.maxParticipants) }, { headers: { Authorization: `Bearer ${accessToken}` }});
      } else {
        await axios.post('http://localhost:3001/api/events', { ...form, maxParticipants: Number(form.maxParticipants) }, { headers: { Authorization: `Bearer ${accessToken}` }});
      }
      setForm({ name: '', description: '', date: '', time: '', location: '', maxParticipants: '' });
      setEditing(null);
      await load();
    } catch (err) { setError(err.response?.data?.message || 'Failed to save'); }
  };

  const edit = (ev) => { setEditing(ev); setForm({ ...ev, maxParticipants: ev.maxParticipants?.toString() || '' }); };
  const del = async (id) => { await axios.delete(`http://localhost:3001/api/events/${id}`, { headers: { Authorization: `Bearer ${accessToken}` }}); await load(); };

  const updateApp = async (id, status) => {
    await axios.put(`http://localhost:3001/api/event-applications/${id}`, { status }, { headers: { Authorization: `Bearer ${accessToken}` }});
    await load();
  };
  const deleteApp = async (id) => { await axios.delete(`http://localhost:3001/api/event-applications/${id}`, { headers: { Authorization: `Bearer ${accessToken}` }}); await load(); };

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <h1>Volunteer Events</h1>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={submit} className={styles.form}>
          <div className={styles.row}>
            <input placeholder="Event Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          <div className={styles.row}>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
            <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required />
            <input type="number" placeholder="Max Participants" value={form.maxParticipants} onChange={e => setForm({ ...form, maxParticipants: e.target.value })} required />
          </div>
          <div className={styles.actions}>
            {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', description: '', date: '', time: '', location: '', maxParticipants: '' }); }}>Cancel</button>}
            <button type="submit">{editing ? 'Save Changes' : 'Add Event'}</button>
          </div>
        </form>

        <h2 className={styles.sectionTitle}>My Events</h2>
        <div className={styles.table}>
          <div className={styles.thead}>
            <div>Name</div><div>Date</div><div>Time</div><div>Location</div><div>Max</div><div>Actions</div>
          </div>
          {events.map(ev => (
            <div key={ev._id} className={styles.trow}>
              <div>{ev.name}</div><div>{ev.date}</div><div>{ev.time}</div><div>{ev.location}</div><div>{ev.maxParticipants}</div>
              <div className={styles.rowActions}>
                <button onClick={() => edit(ev)}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => del(ev._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        <h2 className={styles.sectionTitle}>Event Applications</h2>
        <div className={styles.table}>
          <div className={styles.thead}>
            <div>Event</div><div>Applicant</div><div>Email</div><div>Status</div><div>Date</div><div>Actions</div>
          </div>
          {apps.map(a => (
            <div key={a.id} className={styles.trow}>
              <div>{a.eventName}</div><div>{a.applicantName}</div><div>{a.applicantEmail}</div><div>{a.status}</div><div>{a.date}</div>
              <div className={styles.rowActions}>
                {a.status === 'pending' && (
                  <>
                    <button onClick={() => updateApp(a.id, 'accepted')}>Accept</button>
                    <button onClick={() => updateApp(a.id, 'declined')}>Decline</button>
                  </>
                )}
                <button className={styles.deleteBtn} onClick={() => deleteApp(a.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminEvents;


