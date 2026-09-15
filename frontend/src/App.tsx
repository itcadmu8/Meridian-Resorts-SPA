/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo } from 'react';
import { Menu } from 'lucide-react';
import { ViewMode, ViewState, NavTab, ArrivalReservation, GuestPreference, PropertyArrivalStats, PropertyCoverData } from './types';
import { getReservations, ApiReservation } from './services/api';
import { SandboxBar } from './components/SandboxBar';
import { Sidebar } from './components/Sidebar';
import { HeroBanner } from './components/HeroBanner';
import { SectionHeader, KpiStats } from './components/KpiStats';
import { ArrivalsChart } from './components/ArrivalsChart';
import { ArrivalShareDonut } from './components/ArrivalShareDonut';
import { ArrivalsTable } from './components/ArrivalsTable';
import { GuestPreferencesTable } from './components/GuestPreferencesTable';
import { ReservationModal } from './components/ReservationModal';
import { OperationalErrorState, OperationalEmptyState } from './components/StateViews';
import { FbCoversView } from './components/FbCoversView';
import { DashboardOverview } from './components/DashboardOverview';
import { INITIAL_PROPERTIES } from './data/resortData';
import GuestLanding from './pages/guest/GuestLanding';

function dateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function shiftDate(value: string, days: number) {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return dateInputValue(date);
}

function formatSelectedDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function App() {
  const isGuestView = window.location.pathname === '/guest';

  // Operational Sandbox Response View State
  const [viewMode, setViewMode] = useState<ViewMode>('live');

  // Navigation tab state (default: 'arrivals' as shown in the screenshot)
  const [activeTab, setActiveTab] = useState<NavTab>('arrivals');

  // Mobile sidebar drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Property filter state
  const [selectedProperty, setSelectedProperty] = useState('All Properties');
  const [selectedDate, setSelectedDate] = useState(() => dateInputValue(new Date()));
  const [fnbViewState, setFnbViewState] = useState<ViewState>('normal');
  const [fnbProperties] = useState<PropertyCoverData[]>(INITIAL_PROPERTIES);

  // Interactive selected reservation for modal view
  const [selectedReservation, setSelectedReservation] = useState<ArrivalReservation | null>(null);

  // Live refresh status
  const [lastUpdated, setLastUpdated] = useState('09:15 AM');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Arrivals data state (supports checking in guests)
  const [arrivals, setArrivals] = useState<ArrivalReservation[]>([]);
  const [loadError, setLoadError] = useState(false);

  const propertyCategory = (propertyName: string): ArrivalReservation['propertyCategory'] => {
    const value = propertyName.toLowerCase();
    if (value.includes('coastal') || value.includes('sea')) return 'Beach';
    if (value.includes('hillside')) return 'Mountain';
    if (value.includes('city')) return 'City';
    if (value.includes('garden')) return 'Forest';
    return 'Beach';
  };

  const mapReservation = (row: ApiReservation): ArrivalReservation => ({
    id: row.id,
    reservationId: row.id,
    guestId: row.guest_id,
    guestName: row.guest_name,
    guestInitials: row.guest_name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase(),
    guestAvatarColor: 'bg-teal-100 text-teal-800 border-teal-300',
    property: row.property_name,
    propertyCategory: propertyCategory(row.property_name),
    checkInDate: row.check_in,
    checkOutDate: row.check_out,
    loyaltyTier: (row.loyalty_tier || 'Standard') as ArrivalReservation['loyaltyTier'],
    status: (row.status === 'Checked-In' ? 'Checked In' : row.status === 'Cancelled' ? 'Canceled' : row.status) as ArrivalReservation['status'],
    roomNumber: row.room_number || 'Not assigned',
    roomType: row.room_type || 'Not assigned',
    specialPreference: row.special_preference || 'No preference recorded',
    pax: 0,
    totalNights: Math.max(0, Math.round((new Date(`${row.check_out}T00:00:00`).getTime() - new Date(`${row.check_in}T00:00:00`).getTime()) / 86400000)),
  });

  const loadArrivals = async () => {
    try {
      setLoadError(false);
      setViewMode('skeleton');
      const rows = await getReservations({ date_from: selectedDate, date_to: selectedDate });
      setArrivals(rows.map(mapReservation));
      setViewMode('live');
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch {
      setLoadError(true);
      setViewMode('error');
    }
  };

  useEffect(() => { loadArrivals(); }, [selectedDate]);

  const selectDate = (date: string) => {
    setSelectedDate(date);
    setSelectedProperty('All Properties');
  };

  const propertyStats = useMemo<PropertyArrivalStats[]>(() => {
    const colors = ['#0f766e', '#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4'];
    const counts = new Map<string, number>();
    arrivals.forEach((arrival) => counts.set(arrival.property, (counts.get(arrival.property) || 0) + 1));
    const total = arrivals.length || 1;
    return [...counts.entries()].map(([propertyName, count], index) => ({
      category: propertyCategory(propertyName),
      shortLabel: propertyName.replace('Meridian ', '').split(' ')[0],
      propertyName,
      count,
      sharePercentage: Math.round((count / total) * 100),
      color: colors[index % colors.length],
    }));
  }, [arrivals]);

  // Calculate dynamic stats based on filter
  const filteredArrivals = useMemo(() => {
    if (selectedProperty === 'All Properties' || !selectedProperty) {
      return arrivals;
    }
    return arrivals.filter(
      (a) => a.property === selectedProperty || a.propertyCategory === selectedProperty
    );
  }, [arrivals, selectedProperty]);

  const guestPreferences = useMemo<GuestPreference[]>(() => arrivals.map((arrival) => ({
    guestId: arrival.guestId,
    guestName: arrival.guestName,
    guestInitials: arrival.guestInitials,
    avatarColor: arrival.guestAvatarColor,
    roomNumber: arrival.roomNumber,
    preference: arrival.specialPreference || 'No preference recorded',
    property: arrival.property,
  })), [arrivals]);

  // Handle Refresh Action
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadArrivals().finally(() => setIsRefreshing(false));
  };

  // Handle Export to CSV
  const handleExport = () => {
    const headers = [
      'Reservation ID',
      'Guest Name',
      'Property',
      'Check-In Date',
      'Check-Out Date',
      'Loyalty Tier',
      'Status',
      'Room Number',
      'Special Preference',
    ];
    const rows = filteredArrivals.map((r) => [
      `"${r.reservationId}"`,
      `"${r.guestName}"`,
      `"${r.property}"`,
      `"${r.checkInDate}"`,
      `"${r.checkOutDate}"`,
      `"${r.loyaltyTier}"`,
      `"${r.status}"`,
      `"${r.roomNumber}"`,
      `"${r.specialPreference || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Meridian_Arrivals_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle checking in guest from modal
  const handleConfirmCheckIn = (id: string) => {
    setArrivals((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Checked In' } : r))
    );
  };

  // Handle selecting guest from preferences list to view reservation modal
  const handleSelectGuestFromPreference = (guest: GuestPreference) => {
    const found = arrivals.find((a) => a.guestId === guest.guestId);
    if (found) {
      setSelectedReservation(found);
    }
  };

  if (isGuestView) return <GuestLanding />;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Sandbox Viewport Header Bar */}
      <SandboxBar viewMode={viewMode} onViewModeChange={setViewMode} />

      {/* Main Body Container with Sidebar and Content Area */}
      <div className="flex-1 flex flex-row relative">
        {/* 2. Left Brand Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* 3. Main Operational Content */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px] mx-auto w-full">
          {/* Mobile Menu Button */}
          <div className="lg:hidden mb-4 flex items-center justify-between pb-3 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 shadow-2xs"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold tracking-wider text-slate-800 uppercase">
                Meridian Ops
              </span>
            </div>
          </div>

          {/* Hero Banner with Resort Image */}
          <HeroBanner
            currentDate={formatSelectedDate(selectedDate)}
            selectedDate={selectedDate}
            onDateChange={selectDate}
            onPreviousDate={() => selectDate(shiftDate(selectedDate, -1))}
            onToday={() => selectDate(dateInputValue(new Date()))}
            onNextDate={() => selectDate(shiftDate(selectedDate, 1))}
          />

          {/* Tab Views */}
          {activeTab === 'dashboard' ? (
            <DashboardOverview
              properties={fnbProperties}
              onNavigateToFb={() => setActiveTab('fb-covers')}
              onSelectProperty={(property) => setSelectedProperty(property.name)}
            />
          ) : activeTab === 'fb-covers' ? (
            <FbCoversView
              viewState={fnbViewState}
              onViewStateChange={setFnbViewState}
              properties={fnbProperties}
              onSelectProperty={(_property) => undefined}
            />
          ) : activeTab === 'arrivals' ? (
            <div>
              {/* Section Header: Breadcrumb, Title, and Refresh button */}
              <SectionHeader
                lastUpdated={lastUpdated}
                isRefreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
              {/* View Mode Switching: Error, Empty, Skeleton, or Live */}
              {viewMode === 'error' ? (
                <OperationalErrorState onRetry={loadArrivals} />
              ) : viewMode === 'empty' ? (
                <OperationalEmptyState onReset={() => setViewMode('live')} />
              ) : (
                <>
                  {/* KPI Stat Cards */}
                  <KpiStats
                    totalArrivals={filteredArrivals.length}
                    propertiesReporting={new Set(filteredArrivals.map((arrival) => arrival.property)).size}
                    avgArrivals={filteredArrivals.length ? Math.round(filteredArrivals.length / new Set(filteredArrivals.map((arrival) => arrival.property)).size) : 0}
                    lastUpdated={lastUpdated}
                    isRefreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    isLoading={viewMode === 'skeleton'}
                    isEmpty={false}
                  />

                  {/* Visual Charts Grid: Bar Chart & Donut Chart */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <ArrivalsChart
                      data={propertyStats}
                      targetAverage={4}
                      isLoading={viewMode === 'skeleton'}
                      selectedCategory={selectedProperty === 'All Properties' ? '' : selectedProperty}
                      onSelectCategory={(cat) => {
                        const target = cat ? propertyStats.find((p) => p.category === cat)?.propertyName || 'All Properties' : 'All Properties';
                        setSelectedProperty(target);
                      }}
                    />

                    <ArrivalShareDonut
                      data={propertyStats}
                      totalArrivals={filteredArrivals.length}
                      isLoading={viewMode === 'skeleton'}
                      selectedCategory={selectedProperty === 'All Properties' ? '' : selectedProperty}
                      onSelectCategory={(cat) => {
                        const target = cat ? propertyStats.find((p) => p.category === cat)?.propertyName || 'All Properties' : 'All Properties';
                        setSelectedProperty(target);
                      }}
                    />
                  </div>

                  {/* Arrival Details Table */}
                  <ArrivalsTable
                    arrivals={arrivals}
                    isLoading={viewMode === 'skeleton'}
                    onViewReservation={setSelectedReservation}
                    onExport={handleExport}
                    selectedProperty={selectedProperty}
                    onPropertyChange={setSelectedProperty}
                  />

                  {/* Guest Preferences Table */}
                  <GuestPreferencesTable
                    preferences={guestPreferences}
                    isLoading={viewMode === 'skeleton'}
                    onSelectGuest={handleSelectGuestFromPreference}
                  />
                </>
              )}
            </div>
          ) : (
            <DashboardOverview
              properties={fnbProperties}
              onNavigateToFb={() => setActiveTab('fb-covers')}
              onSelectProperty={(property) => setSelectedProperty(property.name)}
            />
          )}
        </main>
      </div>

      {/* Guest Reservation Detail Modal */}
      <ReservationModal
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
        onConfirmCheckIn={handleConfirmCheckIn}
      />

    </div>
  );
}
