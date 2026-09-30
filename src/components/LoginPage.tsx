import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  Phone, 
  Mail, 
  Lock, 
  MapPin, 
  BadgeCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  KeyRound, 
  AlertCircle,
  HelpCircle,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  RotateCcw,
  Check,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthRole } from '../types';
import { INDIAN_DISTRICTS } from '../data/districtsData';

interface LoginPageProps {
  onSuccessRedirect?: (role: AuthRole) => void;
  initialRole?: AuthRole;
  onExploreAsGuest?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccessRedirect,
  initialRole = 'citizen',
  onExploreAsGuest,
}) => {
  const { loginAsCitizen, loginAsGovernment, loginWithDemoAccount } = useAuth();
  const [selectedRole, setSelectedRole] = useState<AuthRole>(initialRole);
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  
  // Citizen state
  const [citizenLoginType, setCitizenLoginType] = useState<'otp' | 'password'>('otp');
  const [citizenPhone, setCitizenPhone] = useState('9840123456');
  const [citizenName, setCitizenName] = useState('Ramesh Kumar');
  const [citizenState, setCitizenState] = useState('Tamil Nadu');
  const [citizenDistrict, setCitizenDistrict] = useState('Dharmapuri');
  const [citizenTaluk, setCitizenTaluk] = useState('Morappur');
  const [citizenPincode, setCitizenPincode] = useState('635305');
  const [citizenPassword, setCitizenPassword] = useState('CitizenPass@2026');
  const [citizenOtp, setCitizenOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Government state
  const [govEmail, setGovEmail] = useState('dm-dharmapuri@nic.in');
  const [govPassword, setGovPassword] = useState('GovAdmin#2026');
  const [govName, setGovName] = useState('Dr. K. Vijayakumar, IAS');
  const [govDesignation, setGovDesignation] = useState('District Magistrate & District Collector');
  const [govDepartment, setGovDepartment] = useState('District Infrastructure Monitoring Cell / Revenue');
  const [govLevel, setGovLevel] = useState<'National' | 'State' | 'District'>('District');
  const [govState, setGovState] = useState('Tamil Nadu');
  const [govDistrict, setGovDistrict] = useState('Dharmapuri');
  const [govEmployeeId, setGovEmployeeId] = useState('IAS-TN-2014-0412');
  const [showGovPassword, setShowGovPassword] = useState(false);

  // Error and success feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const statesList = Array.from(new Set(INDIAN_DISTRICTS.map((d) => d.state))).sort();
  const districtsForCitizen = INDIAN_DISTRICTS.filter((d) => d.state === citizenState).map((d) => d.name).sort();
  const districtsForGov = INDIAN_DISTRICTS.filter((d) => d.state === govState).map((d) => d.name).sort();

  // Send simulated OTP
  const handleSendOtp = () => {
    if (!citizenPhone || citizenPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMsg(null);
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setCitizenOtp(code); // auto-fill for frictionless demo
    setOtpSent(true);
    setSuccessMsg(`OTP sent to +91 ${citizenPhone}. Demo code: ${code}`);
  };

  // Submit Citizen Login
  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (citizenLoginType === 'otp' && !citizenOtp) {
      setErrorMsg('Please enter the 4-digit verification code.');
      return;
    }

    loginAsCitizen({
      name: citizenName || 'Citizen User',
      phone: `+91 ${citizenPhone}`,
      district: citizenDistrict,
      state: citizenState,
      talukOrVillage: citizenTaluk,
      pincode: citizenPincode,
    });

    if (onSuccessRedirect) {
      onSuccessRedirect('citizen');
    }
  };

  // Submit Government Login
  const handleGovSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!govEmail.includes('@')) {
      setErrorMsg('Please enter a valid official email address.');
      return;
    }

    loginAsGovernment({
      name: govName,
      email: govEmail,
      designation: govDesignation,
      department: govDepartment,
      level: govLevel,
      district: govLevel === 'District' ? govDistrict : undefined,
      state: govState,
      employeeId: govEmployeeId,
    });

    if (onSuccessRedirect) {
      onSuccessRedirect('government');
    }
  };

  // 1-Click Demo Shortcut
  const handleQuickDemo = (role: AuthRole) => {
    loginWithDemoAccount(role);
    if (onSuccessRedirect) {
      onSuccessRedirect(role);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden animate-fadeIn">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/10 via-blue-600/10 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-emerald-600 text-white shadow-2xl ring-4 ring-white/10 mb-4">
          <Building2 className="w-8 h-8" />
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-xs uppercase font-mono tracking-widest text-amber-400 font-bold">
            JanaSetu AI Single Sign-On
          </span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded font-mono">
            SECURE DPG
          </span>
        </div>

        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Login Authentication
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
          Choose your authentication portal to access personalized grievance redressal or national infrastructure intelligence.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
          {/* Portal Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('citizen');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                selectedRole === 'citizen'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Citizen Portal (नागरिक)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('government');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                selectedRole === 'government'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Government Cadre (अधिकारी)</span>
            </button>
          </div>

          {/* Quick Instant Demo Shortcut */}
          <div className="mb-6 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">
                  Quick 1-Click Demo Login
                </span>
                <span className="text-[11px] text-slate-400">
                  {selectedRole === 'citizen' 
                    ? 'Log in as Ramesh Kumar (Verified Citizen, Dharmapuri, TN)' 
                    : 'Log in as Dr. K. Vijayakumar, IAS (District Collector)'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleQuickDemo(selectedRole)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shrink-0 ${
                selectedRole === 'citizen'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-slate-950'
                  : 'bg-blue-600/20 text-blue-300 border border-blue-500/40 hover:bg-blue-600 hover:text-white'
              }`}
            >
              Instant Demo Access →
            </button>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Citizen Login / Register Form */}
          {selectedRole === 'citizen' && (
            <div className="space-y-5">
              {/* Sign in vs Register Toggle */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <span className="text-slate-300 font-medium">
                  {authMode === 'signin' ? 'Sign in to your citizen account' : 'Register a new citizen account'}
                </span>
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'signin' ? 'register' : 'signin')}
                  className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2"
                >
                  {authMode === 'signin' ? 'Create New Account' : 'Already registered? Sign In'}
                </button>
              </div>

              <form onSubmit={handleCitizenSubmit} className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name / नागरिक का नाम
                    </label>
                    <input
                      type="text"
                      required
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      Mobile Number / मोबाइल नंबर
                    </label>
                    {authMode === 'signin' && (
                      <div className="flex items-center gap-2 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setCitizenLoginType('otp')}
                          className={`font-semibold ${citizenLoginType === 'otp' ? 'text-amber-400' : 'text-slate-500'}`}
                        >
                          OTP Sign In
                        </button>
                        <span className="text-slate-600">|</span>
                        <button
                          type="button"
                          onClick={() => setCitizenLoginType('password')}
                          className={`font-semibold ${citizenLoginType === 'password' ? 'text-amber-400' : 'text-slate-500'}`}
                        >
                          Password
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs text-slate-500 font-mono">+91</span>
                    <input
                      type="tel"
                      required
                      value={citizenPhone}
                      onChange={(e) => setCitizenPhone(e.target.value)}
                      placeholder="98401 23456"
                      className="w-full pl-12 pr-24 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 font-mono focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                    {citizenLoginType === 'otp' && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="absolute right-2 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-semibold transition-colors"
                      >
                        {otpSent ? 'Resend' : 'Send OTP'}
                      </button>
                    )}
                  </div>
                </div>

                {/* OTP Input Field */}
                {citizenLoginType === 'otp' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-300">
                        4-Digit Verification Code (OTP)
                      </label>
                      {generatedOtp && (
                        <span className="text-[10px] text-amber-400 font-mono">
                          Auto-filled code: {generatedOtp}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        maxLength={6}
                        value={citizenOtp}
                        onChange={(e) => setCitizenOtp(e.target.value)}
                        placeholder="e.g. 7492"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 font-mono tracking-widest text-center text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Password field if password mode */}
                {citizenLoginType === 'password' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Account Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={citizenPassword}
                        onChange={(e) => setCitizenPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-amber-500 outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Geographic Jurisdiction for Citizen */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      State / राज्य
                    </label>
                    <select
                      value={citizenState}
                      onChange={(e) => setCitizenState(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-1 focus:ring-amber-500 outline-none"
                    >
                      {statesList.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      District / ज़िला
                    </label>
                    <select
                      value={citizenDistrict}
                      onChange={(e) => setCitizenDistrict(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-1 focus:ring-amber-500 outline-none"
                    >
                      {districtsForCitizen.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {authMode === 'register' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Taluk / Village / Ward
                      </label>
                      <input
                        type="text"
                        value={citizenTaluk}
                        onChange={(e) => setCitizenTaluk(e.target.value)}
                        placeholder="e.g. Morappur"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={citizenPincode}
                        onChange={(e) => setCitizenPincode(e.target.value)}
                        placeholder="635305"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>DPG Privacy Protection:</strong> Authenticated citizens can submit voice & text grievances, track real-time resolution status, and receive official SMS receipts.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  <LogIn className="w-4 h-4" />
                  <span>
                    {authMode === 'signin' ? 'Sign In to Citizen Dashboard' : 'Register & Open Citizen Dashboard'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Government Official Login Form */}
          {selectedRole === 'government' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <span className="text-slate-300 font-medium">
                  Official Cadre & District Administration Login
                </span>
                <span className="text-blue-400 font-mono text-[11px] flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" /> NIC / Gov.in SSO
                </span>
              </div>

              <form onSubmit={handleGovSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Official Government Email ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={govEmail}
                      onChange={(e) => setGovEmail(e.target.value)}
                      placeholder="officer.collectorate@nic.in"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 font-mono focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cadre Access Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type={showGovPassword ? 'text' : 'password'}
                      required
                      value={govPassword}
                      onChange={(e) => setGovPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-blue-600 outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGovPassword(!showGovPassword)}
                      className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                    >
                      {showGovPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Officer Name
                    </label>
                    <input
                      type="text"
                      required
                      value={govName}
                      onChange={(e) => setGovName(e.target.value)}
                      placeholder="e.g. Dr. K. Vijayakumar, IAS"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-1 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Employee / Cadre ID
                    </label>
                    <input
                      type="text"
                      required
                      value={govEmployeeId}
                      onChange={(e) => setGovEmployeeId(e.target.value)}
                      placeholder="IAS-TN-2014-0412"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:ring-1 focus:ring-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Jurisdiction Level
                    </label>
                    <select
                      value={govLevel}
                      onChange={(e) => setGovLevel(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-1 focus:ring-blue-600 outline-none"
                    >
                      <option value="District">District Magistrate / Collectorate</option>
                      <option value="State">State Infrastructure Ministry</option>
                      <option value="National">National Planning / PMO</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Assigned District
                    </label>
                    <select
                      value={govDistrict}
                      onChange={(e) => setGovDistrict(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-1 focus:ring-blue-600 outline-none"
                    >
                      {districtsForGov.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Designation & Department
                  </label>
                  <input
                    type="text"
                    required
                    value={govDesignation}
                    onChange={(e) => setGovDesignation(e.target.value)}
                    placeholder="District Collector / Executive Engineer"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-200 flex items-start gap-2">
                  <BadgeCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Administrative Oversight:</strong> Authorizes DPR budget approvals, field inspection delegation, and priority infrastructure sanctions across all 112 districts.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Enter Government Command Center</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Continue as Guest option */}
          {onExploreAsGuest && (
            <div className="mt-6 pt-5 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={onExploreAsGuest}
                className="text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 mx-auto"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Explore Public Infrastructure Map as Guest Analyst</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
