import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CitizenPortal } from './components/CitizenPortal';
import { InteractiveMap } from './components/InteractiveMap';
import { HotspotsView } from './components/HotspotsView';
import { RecommendationsView } from './components/RecommendationsView';
import { ImpactSimulator } from './components/ImpactSimulator';
import { PolicyCopilot } from './components/PolicyCopilot';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { DemoStorylineModal } from './components/DemoStorylineModal';
import { AboutDPGModal } from './components/AboutDPGModal';
import { CitizenDashboard } from './components/CitizenDashboard';
import { GovernmentDashboard } from './components/GovernmentDashboard';
import { LoginPage } from './components/LoginPage';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { UserRole, IndianLanguage, CitizenRequest, DistrictMetric, RequestStatus, AuthRole } from './types';
import { INITIAL_REQUESTS, DEMAND_CLUSTERS, AI_RECOMMENDATIONS } from './data/requestsData';
import { computeLiveTotals } from './data/districtsData';
import { Building2, ShieldCheck, RotateCcw, PlusCircle, UserCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function App() {
  const { 
    currentUser, 
    isAuthenticated, 
    isAuthModalOpen, 
    closeAuthModal, 
    openAuthModal, 
    modalInitialRole 
  } = useAuth();

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [userRole, setUserRole] = useState<UserRole>('government');
  const [selectedLanguage, setSelectedLanguage] = useState<IndianLanguage>('en');
  
  // Real live requests state: Initialized to empty array [] so all numbers start at clean 0 as requested!
  const [requests, setRequests] = useState<CitizenRequest[]>([]);
  
  const [simulatorDistrict, setSimulatorDistrict] = useState<string>('Dharmapuri');
  const [isDemoTourOpen, setIsDemoTourOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [pinnedLocationForReport, setPinnedLocationForReport] = useState<{
    lat: number;
    lng: number;
    state?: string;
    district?: string;
    villageOrCity?: string;
  } | null>(null);

  // Dynamically compute live metrics from actual recorded citizen requests
  const liveStats = useMemo(() => {
    const activeClusters = requests.length > 0 ? DEMAND_CLUSTERS.slice(0, Math.min(DEMAND_CLUSTERS.length, requests.length)) : [];
    const activeRecs = requests.length > 0 ? AI_RECOMMENDATIONS.slice(0, Math.min(AI_RECOMMENDATIONS.length, requests.length)) : [];
    return computeLiveTotals(requests, activeClusters, activeRecs);
  }, [requests]);

  // Sync role switching with suggested default views
  const handleRoleChange = (newRole: UserRole) => {
    setUserRole(newRole);
    if (newRole === 'citizen') {
      setCurrentTab('citizen-dashboard');
    } else if (newRole === 'government') {
      setCurrentTab('government-dashboard');
    } else if (newRole === 'analyst') {
      setCurrentTab('analytics');
    }
  };

  const handleNewCitizenRequest = (newReq: CitizenRequest) => {
    setRequests((prev) => [newReq, ...prev]);
    // Optionally return to citizen dashboard to see the updated request
    setCurrentTab('citizen-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateRequestStatus = (id: string, newStatus: RequestStatus, note?: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: newStatus,
              explainableReasoning: note || r.explainableReasoning,
            }
          : r
      )
    );
  };

  const handleOpenSimulator = (districtName: string) => {
    setSimulatorDistrict(districtName);
    setCurrentTab('impact-simulator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewRequestFromMap = (location: {
    lat: number;
    lng: number;
    state?: string;
    district?: string;
    villageOrCity?: string;
  }) => {
    setPinnedLocationForReport(location);
    setCurrentTab('citizen-portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Primary DPG Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={userRole}
        setUserRole={handleRoleChange}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        onOpenDemoTour={() => setIsDemoTourOpen(true)}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
      />

      {/* Real Live Data Banner & Quick Switcher */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-white">Live Data Store:</span>
            <span className="text-emerald-400 font-mono font-bold">
              {requests.length} verified citizen requests
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 text-[11px]">
              {requests.length === 0 ? 'Zero fake figures (clean 0 slate)' : `Active across ${liveStats.districtsAnalysed} districts`}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Two Dashboards Switcher */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => setCurrentTab('citizen-dashboard')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
                  currentTab === 'citizen-dashboard'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-3 h-3" />
                <span>Citizen View</span>
              </button>
              <button
                onClick={() => setCurrentTab('government-dashboard')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
                  currentTab === 'government-dashboard'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3 h-3" />
                <span>Government View</span>
              </button>
            </div>

            {requests.length > 0 ? (
              <button
                onClick={() => setRequests([])}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-medium flex items-center gap-1 border border-slate-700 transition-colors"
                title="Reset all counts to 0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to 0</span>
              </button>
            ) : (
              <button
                onClick={() => setRequests(INITIAL_REQUESTS)}
                className="px-2 py-1 rounded bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-[11px] font-medium flex items-center gap-1 border border-blue-500/40 transition-colors"
                title="Load 7 verified pilot submissions"
              >
                <PlusCircle className="w-3 h-3" />
                <span>Load Verified Records</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <>
            <HeroSection
              onNavigate={(tab) => {
                setCurrentTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenDemoTour={() => setIsDemoTourOpen(true)}
              liveStats={liveStats}
              onResetToZero={() => setRequests([])}
              onLoadPilotRecords={() => setRequests(INITIAL_REQUESTS)}
            />
            {/* Real Map & Location Access on Home */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
              <InteractiveMap
                requests={requests}
                onOpenSimulatorForDistrict={handleOpenSimulator}
                onNewRequestFromMap={handleNewRequestFromMap}
              />
            </div>
          </>
        )}

        {/* Dedicated Login Authentication Tab */}
        {currentTab === 'login' && (
          <LoginPage
            initialRole={userRole === 'government' ? 'government' : 'citizen'}
            onSuccessRedirect={(role) => {
              setCurrentTab(role === 'citizen' ? 'citizen-dashboard' : 'government-dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExploreAsGuest={() => {
              setCurrentTab('infrastructure-map');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 1. DEDICATED CITIZEN DASHBOARD */}
        {currentTab === 'citizen-dashboard' && (
          !currentUser ? (
            <LoginPage
              initialRole="citizen"
              onSuccessRedirect={() => {
                setCurrentTab('citizen-dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreAsGuest={() => {
                setCurrentTab('citizen-portal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : (
            <CitizenDashboard
              requests={requests}
              onOpenReportModal={() => {
                setCurrentTab('citizen-portal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectRequestForReport={handleNewRequestFromMap}
              selectedLanguage={selectedLanguage}
            />
          )
        )}

        {/* 2. DEDICATED GOVERNMENT DASHBOARD */}
        {currentTab === 'government-dashboard' && (
          !currentUser ? (
            <LoginPage
              initialRole="government"
              onSuccessRedirect={() => {
                setCurrentTab('government-dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreAsGuest={() => {
                setCurrentTab('infrastructure-map');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : (
            <GovernmentDashboard
              requests={requests}
              onUpdateRequestStatus={handleUpdateRequestStatus}
              onResetToZero={() => setRequests([])}
              onLoadPilotRecords={() => setRequests(INITIAL_REQUESTS)}
              onOpenSimulatorForDistrict={handleOpenSimulator}
            />
          )
        )}

        {currentTab === 'citizen-portal' && (
          <CitizenPortal
            requests={requests}
            onNewRequest={handleNewCitizenRequest}
            selectedLanguage={selectedLanguage}
            initialPinnedLocation={pinnedLocationForReport}
          />
        )}

        {currentTab === 'infrastructure-map' && (
          <InteractiveMap
            requests={requests}
            onOpenSimulatorForDistrict={handleOpenSimulator}
            onNewRequestFromMap={handleNewRequestFromMap}
          />
        )}

        {currentTab === 'demand-hotspots' && (
          <HotspotsView
            onOpenSimulatorForDistrict={handleOpenSimulator}
          />
        )}

        {currentTab === 'recommendations' && (
          <RecommendationsView
            onOpenSimulatorForDistrict={handleOpenSimulator}
          />
        )}

        {currentTab === 'impact-simulator' && (
          <ImpactSimulator initialDistrict={simulatorDistrict} />
        )}

        {currentTab === 'analytics' && <AnalyticsDashboard />}

        {currentTab === 'policy-copilot' && <PolicyCopilot />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-white tracking-wide">JANASETU AI</span>
            <span className="text-slate-500">·</span>
            <span>Digital Public Good for National Infrastructure Action</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsAboutModalOpen(true)}
              className="hover:text-amber-400 underline underline-offset-2"
            >
              Responsible AI & Privacy Notice
            </button>
            <span>·</span>
            <span>Real OpenStreetMap & Live GPS Location</span>
            <span>·</span>
            <span className="text-emerald-400 font-mono">Open DPG Prototype</span>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialRole={modalInitialRole}
        onSuccessRole={(role) => {
          if (role === 'citizen') {
            setCurrentTab('citizen-dashboard');
          } else {
            setCurrentTab('government-dashboard');
          }
        }}
      />

      {/* Guided 10-Step Storyline Modal */}
      <DemoStorylineModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* DPG & Responsible AI Modal */}
      <AboutDPGModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </div>
  );
}
