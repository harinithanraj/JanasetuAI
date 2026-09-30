import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Layers, 
  Sparkles, 
  Sliders, 
  BarChart3, 
  Bot, 
  ShieldCheck, 
  Play, 
  Globe, 
  UserCheck, 
  LogIn, 
  LogOut, 
  User, 
  ChevronDown,
  LayoutDashboard,
  ShieldAlert
} from 'lucide-react';
import { UserRole, IndianLanguage, SUPPORTED_LANGUAGES, AuthRole } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  selectedLanguage: IndianLanguage;
  setSelectedLanguage: (lang: IndianLanguage) => void;
  onOpenDemoTour: () => void;
  onOpenAboutModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
  selectedLanguage,
  setSelectedLanguage,
  onOpenDemoTour,
  onOpenAboutModal,
}) => {
  const { currentUser, isAuthenticated, logout, openAuthModal } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Building2 },
    { id: 'citizen-dashboard', label: 'Citizen Dashboard', icon: UserCheck, highlight: 'amber' },
    { id: 'government-dashboard', label: 'Government Dashboard', icon: Building2, highlight: 'blue' },
    { id: 'citizen-portal', label: 'Report Need', icon: MapPin },
    { id: 'infrastructure-map', label: 'Real GIS Map', icon: Layers },
    { id: 'demand-hotspots', label: 'Hotspots', icon: Sparkles },
    { id: 'recommendations', label: 'AI Priorities', icon: Sliders },
    { id: 'impact-simulator', label: 'Simulator', icon: Sliders },
    { id: 'policy-copilot', label: 'Policy Copilot', icon: Bot },
    { id: 'login', label: isAuthenticated ? 'Auth Profile' : 'Login Auth', icon: LogIn, highlight: 'amber' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md border-b border-slate-800">
      {/* Disclaimer Kicker Bar */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1 text-xs text-amber-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="font-semibold tracking-wide">DIGITAL PUBLIC GOOD PLATFORM</span>
          <span className="text-amber-400/60 hidden sm:inline">·</span>
          <span className="text-amber-200/80 hidden sm:inline">
            Zero Fake Details · Real OpenStreetMap & Browser GPS Geolocation
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenDemoTour}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 transition-colors text-[11px]"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Launch Hackathon Demo (10 Steps)</span>
          </button>
          <button
            onClick={onOpenAboutModal}
            className="text-[11px] text-amber-300 hover:text-white underline underline-offset-2 flex items-center gap-1"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>DPG & Privacy</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand */}
          <div 
            onClick={() => setCurrentTab('home')}
            className="cursor-pointer flex items-center gap-3 shrink-0"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 via-orange-600 to-emerald-600 flex items-center justify-center shadow-lg ring-1 ring-white/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white font-sans">
                  JANASETU <span className="text-amber-400">AI</span>
                </span>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                  DPG
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                From Citizen Voice to National Infrastructure Action
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? item.highlight === 'blue'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-inner'
                      : item.highlight === 'amber'
                      ? 'text-amber-400 hover:text-amber-300 hover:bg-slate-800'
                      : item.highlight === 'blue'
                      ? 'text-blue-400 hover:text-blue-300 hover:bg-slate-800'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Controls: Language & Auth Profile */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Language Selector */}
            <div className="relative flex items-center">
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as IndianLanguage)}
                className="pl-8 pr-2.5 py-1.5 bg-slate-800 text-slate-200 text-xs rounded-lg border border-slate-700 hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Authentication / User Profile */}
            {isAuthenticated && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={`flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                    currentUser.role === 'government'
                      ? 'bg-blue-950/80 border-blue-600/60 text-blue-200 hover:bg-blue-900/80'
                      : 'bg-amber-950/80 border-amber-600/60 text-amber-200 hover:bg-amber-900/80'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    currentUser.role === 'government' ? 'bg-blue-600 text-white' : 'bg-amber-500 text-slate-950'
                  }`}>
                    {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                  </div>
                  <div className="text-left hidden md:block">
                    <span className="block text-white text-[11px] font-bold leading-tight line-clamp-1">
                      {currentUser.name}
                    </span>
                    <span className={`block text-[10px] leading-tight ${
                      currentUser.role === 'government' ? 'text-blue-300' : 'text-amber-300'
                    }`}>
                      {currentUser.role === 'government' ? 'Government Official' : 'Citizen'}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="font-bold text-white text-xs">{currentUser.name}</p>
                      <p className="text-slate-400 text-[11px] truncate">
                        {currentUser.email || currentUser.phone}
                      </p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        currentUser.role === 'government' 
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {currentUser.role === 'government' ? 'Gov Official (Cadre)' : 'Verified Citizen'}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setCurrentTab('citizen-dashboard');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                      >
                        <UserCheck className="w-4 h-4 text-amber-400" />
                        <span>Open Citizen Dashboard</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentTab('government-dashboard');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                      >
                        <Building2 className="w-4 h-4 text-blue-400" />
                        <span>Open Government Dashboard</span>
                      </button>

                      <button
                        onClick={() => {
                          openAuthModal(currentUser.role === 'citizen' ? 'government' : 'citizen');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-800 text-slate-300 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                        <span>Switch Account / Cadre</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-400 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setCurrentTab('login')}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-102"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login Authentication</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <div className="xl:hidden flex overflow-x-auto px-3 py-2 space-x-1.5 border-t border-slate-800 bg-slate-900/90 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded text-xs whitespace-nowrap ${
                isActive
                  ? item.highlight === 'blue'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-300 bg-slate-800/80 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
