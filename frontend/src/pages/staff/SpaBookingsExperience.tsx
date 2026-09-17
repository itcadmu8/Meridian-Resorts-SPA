/**
 * @file SpaBookingsExperience.tsx
 * @description Page view component for SpaBookingsExperience.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Download, Plus, RefreshCw, Search, Sparkles } from 'lucide-react';
import client from '../../api/client';

interface SpaAppointmentOut {
  id: string;
  property: string;
  therapist: string;
  service: string;
  time_slot: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  guest_name?: string;
  guest_id?: string;
}

interface SpaDataResponse {
  date: string;
  total_spa_bookings: number;
  bookings: SpaAppointmentOut[];
}

interface Props {
  selectedDate?: string;
  onSpaBooked?: () => void;
}

const PROPERTY_NAMES = [
  'Meridian Azure Cove',
  'Meridian Palm Bay',
  'Meridian Coral Sands',
  'Meridian Ocean Pearl',
  'Meridian Rainforest Sanctuary',
  'Meridian Sunset Cliffs',
];

const SHORT_NAME: Record<string, string> = {
  'Meridian Azure Cove': 'Azure Cove',
  'Meridian Palm Bay': 'Palm Bay',
  'Meridian Coral Sands': 'Coral Sands',
  'Meridian Ocean Pearl': 'Ocean Pearl',
  'Meridian Rainforest Sanctuary': 'Rainforest',
  'Meridian Sunset Cliffs': 'Sunset Cliffs',
};

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return iso;
  }
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function SpaBookingsExperience({ selectedDate, onSpaBooked }: Props) {
  const [data, setData] = useState<SpaDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('All Properties (6)');
  const [statusFilter, setStatusFilter] = useState<'All Statuses' | 'confirmed' | 'completed' | 'cancelled'>('All Statuses');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchSpaData = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (selectedDate) params.today = selectedDate;
      const res: any = await client.get('/api/v1/spa/appointments/today', { params });
      setData((res as any).data || res);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Failed to fetch spa appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaData();
    setPage(1);
  }, [selectedDate]);

  const bookings = data?.bookings ?? [];

  // Property appointment counts for bar chart
  const propCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    PROPERTY_NAMES.forEach((p) => (counts[p] = 0));
    bookings.forEach((b) => {
      if (b.property in counts) counts[b.property]++;
      else counts[b.property] = (counts[b.property] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, short: SHORT_NAME[name] || name.replace('Meridian ', ''), count }));
  }, [bookings]);

  const maxCount = Math.max(...propCounts.map((p) => p.count), 1);

  // Service share for donut legend
  const serviceShare = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach((b) => {
      counts[b.service] = (counts[b.service] || 0) + 1;
    });
    const total = bookings.length || 1;
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([service, count]) => ({ service, pct: Math.round((count / total) * 100) }));
  }, [bookings]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => {
      const matchStatus = statusFilter === 'All Statuses' || b.status === statusFilter;
      const matchProp = propertyFilter === 'All Properties (6)' || b.property === propertyFilter;
      const matchSearch = !q || `${b.guest_name || ''} ${b.therapist} ${b.id} ${b.service}`.toLowerCase().includes(q);
      return matchStatus && matchProp && matchSearch;
    });
  }, [bookings, statusFilter, propertyFilter, search]);

  const visible = filtered.slice((page - 1) * 8, page * 8);
  const totalPages = Math.ceil(filtered.length / 8);

  const activeCount = bookings.filter((b) => b.status !== 'cancelled').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;

  return (
    <section className="spa-operations-page" aria-labelledby="spa-schedule-title">
      {/* Header */}
      <div className="spa-page-heading">
        <div className="spa-heading-copy">
          <div className="spa-heading-icon"><Sparkles /></div>
          <div>
            <div className="spa-breadcrumb">
              Dashboard <span>›</span>{' '}
              {selectedDate
                ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
                : "Today's Spa Schedule"}
            </div>
            <h2 id="spa-schedule-title">Spa Schedule</h2>
            <p>Live spa bookings across all 6 properties from the operations database.</p>
          </div>
        </div>
        <div className="spa-heading-actions">
          {lastUpdated && <span>Last updated: <strong>{lastUpdated}</strong></span>}
          <button
            className="spa-primary-button"
            type="button"
            onClick={() => { fetchSpaData(); if (onSpaBooked) onSpaBooked(); }}
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            &nbsp; {loading ? 'Loading...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="spa-kpi-grid">
        <Kpi
          label="Total Spa Bookings"
          value={loading ? '—' : String(activeCount)}
          note={`Across all 6 luxury spa pavilions · ${selectedDate || 'today'}`}
          badge={loading ? '' : `${confirmedCount} confirmed`}
        />
        <Kpi
          label="Properties Active"
          value={loading ? '—' : String(propCounts.filter((p) => p.count > 0).length)}
          note="Properties with at least 1 appointment"
          badge="Live"
        />
        <Kpi
          label="Cancelled Today"
          value={loading ? '—' : String(bookings.filter((b) => b.status === 'cancelled').length)}
          note="Cancelled appointments (excluded from totals)"
          badge="Review"
          warning
        />
      </div>

      {/* Charts Row */}
      <div className="spa-chart-grid">
        {/* Bar Chart — appointments by property */}
        <div className="spa-chart-panel">
          <div className="spa-panel-heading">
            <h3>Appointments by Property</h3>
            <span>▮ Bookings · {selectedDate || 'Today'}</span>
          </div>
          <div className="spa-bars">
            {propCounts.map(({ short, count }) => (
              <div className="spa-bar-item" key={short}>
                <b>{count}</b>
                <i style={{ height: `${Math.max(4, (count / maxCount) * 100)}%` }} />
                <span>{short}</span>
              </div>
            ))}
          </div>
          <footer>
            Real-time booking distribution across all 6 resort destinations.
            {lastUpdated && <strong> Updated {lastUpdated}</strong>}
          </footer>
        </div>

        {/* Service Share */}
        <div className="spa-chart-panel">
          <div className="spa-panel-heading">
            <h3>Share of Treatments</h3>
            <span className="spa-total-pill">{activeCount} Total</span>
          </div>
          <div className="spa-donut">
            <strong>
              {loading ? '—' : activeCount}
              <small>TREATMENTS</small>
            </strong>
          </div>
          <div className="spa-legend">
            {serviceShare.map(({ service, pct }, idx) => (
              <span key={service}>
                <i className={`legend-${idx}`} />
                {service.length > 22 ? service.slice(0, 22) + '…' : service}
                <b>{pct}%</b>
              </span>
            ))}
          </div>
          <footer>All signature rituals · live from the operations database.</footer>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="spa-table-panel">
        <div className="spa-table-heading">
          <h3>✦ Spa Schedule Details ({filtered.length})</h3>
          <div>
            <button className="spa-primary-button" type="button">
              <Plus size={15} /> Book Appointment
            </button>
            <button className="spa-export-button" type="button">
              <Download size={15} /> Export
            </button>
          </div>
        </div>

        <div className="spa-filters">
          <label>
            Property
            <select
              value={propertyFilter}
              onChange={(e) => { setPropertyFilter(e.target.value); setPage(1); }}
            >
              <option>All Properties (6)</option>
              {PROPERTY_NAMES.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>

          <div className="spa-status-filters">
            {(['All Statuses', 'confirmed', 'completed', 'cancelled'] as const).map((s) => (
              <button
                key={s}
                className={statusFilter === s ? 'active' : ''}
                type="button"
                onClick={() => { setStatusFilter(s); setPage(1); }}
              >
                {s === 'All Statuses' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <div className="spa-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by guest, therapist, service, or booking ID..."
            />
          </div>
        </div>

        <div className="spa-table-scroll">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#647572' }}>
              Loading spa appointments…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#647572' }}>
              No spa appointments found for this date and filter.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  {['Booking ID', 'Time', 'Guest', 'Property', 'Treatment', 'Therapist', 'Status', 'Actions'].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((b) => (
                  <tr key={b.id}>
                    <td className="spa-id">{b.id}</td>
                    <td>
                      <strong>{formatTime(b.time_slot)}</strong>
                    </td>
                    <td>
                      <div className="spa-guest">
                        <i>{b.guest_name ? initials(b.guest_name) : 'GU'}</i>
                        <span>
                          <strong>{b.guest_name || 'Resort Guest'}</strong>
                        </span>
                      </div>
                    </td>
                    <td>{b.property}</td>
                    <td>
                      <strong>{b.service}</strong>
                    </td>
                    <td>{b.therapist}</td>
                    <td>
                      <span className={`spa-status ${b.status.toLowerCase()}`}>
                        <i />
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <button className="spa-view-button" type="button">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="spa-pagination">
          <span>
            Showing{' '}
            <strong>
              {filtered.length ? (page - 1) * 8 + 1 : 0} to {Math.min(page * 8, filtered.length)}
            </strong>{' '}
            of {filtered.length} appointments
          </span>
          <div>
            <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            <strong>{page}</strong>
            <button type="button" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Kpi({
  label,
  value,
  note,
  badge,
  warning = false,
}: {
  label: string;
  value: string;
  note: string;
  badge: string;
  warning?: boolean;
}) {
  return (
    <div className="spa-kpi-card">
      <div>
        <span>{label}</span>
        {badge && <em className={warning ? 'warning' : ''}>{badge}</em>}
      </div>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}
