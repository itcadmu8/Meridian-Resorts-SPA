import React, { useState } from 'react';
import { ViewState, NavScreen, PropertyCoverData } from './types';
import { INITIAL_PROPERTIES } from './data/resortData';
import { SandboxBanner } from './components/SandboxBanner';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FbCoversView } from './components/FbCoversView';
import { DashboardOverview } from './components/DashboardOverview';
import { ArrivalsView } from './components/ArrivalsView';
import { SpaView } from './components/SpaView';
import { PropertiesView } from './components/PropertiesView';
import { ReportsView } from './components/ReportsView';
import { PropertyDetailModal } from './components/PropertyDetailModal';

export default function App() {
  const [viewState, setViewState] = useState<ViewState>('normal');
  const [currentScreen, setCurrentScreen] = useState<NavScreen>('fb-covers');
  const [properties, setProperties] = useState<PropertyCoverData[]>(INITIAL_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<PropertyCoverData | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Handlers for Sandbox live modifications
  const handleSimulateDinnerRush = () => {
    setProperties((prev) =>
      prev.map((p) => {
        const bonus = Math.floor(Math.random() * 8) + 4;
        const newCovers = p.covers + bonus;
        const newVariance = newCovers - p.target;
        return {
          ...p,
          covers: newCovers,
          variance: newVariance,
          breakdown: {
            ...p.breakdown,
            dinner: p.breakdown.dinner + bonus,
          },
        };
      })
    );
    if (viewState !== 'normal') {
      setViewState('normal');
    }
  };

  const handleResetData = () => {
    setProperties(INITIAL_PROPERTIES);
    setViewState('normal');
  };

  const handleViewStateChange = (state: ViewState) => {
    setViewState(state);
  };

  return (
    <div className="min-h-screen flex flex-col antialiased bg-[#F6F8F7] text-[#10201E]">
      {/* Sandbox Viewport Control Banner */}
      <SandboxBanner
        currentViewState={viewState}
        onViewStateChange={handleViewStateChange}
        onSimulateDinnerRush={handleSimulateDinnerRush}
        onResetData={handleResetData}
      />

      {/* Main Dashboard Layout */}
      <div className="flex-1 flex flex-row overflow-hidden min-h-[calc(100vh-41px)]">
        {/* Sidebar Navigation */}
        <Sidebar
          currentScreen={currentScreen}
          onSelectScreen={setCurrentScreen}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-[#F6F8F7]">
          {/* Top Panoramic Luxury Coastal Resort Header */}
          <Header onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />

          {/* Dashboard Body Container (Max-w-7xl with rhythmic padding) */}
          <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {currentScreen === 'fb-covers' && (
              <FbCoversView
                viewState={viewState}
                onViewStateChange={handleViewStateChange}
                properties={properties}
                onSelectProperty={setSelectedProperty}
              />
            )}

            {currentScreen === 'dashboard' && (
              <DashboardOverview
                properties={properties}
                onNavigateToFb={() => setCurrentScreen('fb-covers')}
                onSelectProperty={setSelectedProperty}
              />
            )}

            {currentScreen === 'arrivals' && <ArrivalsView />}

            {currentScreen === 'spa' && <SpaView />}

            {currentScreen === 'properties' && (
              <PropertiesView
                properties={properties}
                onSelectProperty={setSelectedProperty}
              />
            )}

            {currentScreen === 'reports' && <ReportsView properties={properties} />}
          </div>
        </main>
      </div>

      {/* Interactive Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />
    </div>
  );
}
