import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  UserCheck, 
  Building2, 
  Phone, 
  Mail, 
  Lock, 
  MapPin, 
  BadgeCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthRole } from '../types';
import { INDIAN_DISTRICTS } from '../data/districtsData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: AuthRole;
  onSuccessRole?: (role: AuthRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'citizen',
  onSuccessRole,
}) => {
  const { loginAsCitizen, loginAsGovernment, loginWithDemoAccount } = useAuth();
  const [role, setRole] = useState<AuthRole>(initialRole);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Citizen form state
  const [citizenName, setCitizenName] = useState('Ramesh Kumar');
  const [citizenPhone, setCitizenPhone] = useState('9840123456');
  const [citizenState, setCitizenState] = useState('Tamil Nadu');
  const [citizenDistrict, setCitizenDistrict] = useState('Dharmapuri');
  const [citizenOtp, setCitizenOtp] = useState('7492');
  const [otpSent, setOtpSent] = useState(false);

  // Government form state
  const [govName, setGovName] = useState('Dr. K. Vijayakumar, IAS');
  const [govEmail, setGovEmail] = useState('dm-dharmapuri@nic.in');
  const [govDesignation, setGovDesignation] = useState('District Magistrate & Collector');
  const [govDepartment, setGovDepartment] = useState('District Administration & Infrastructure Monitoring');
  const [govLevel, setGovLevel] = useState<'National' | 'State' | 'District'>('District');
  const [govDistrict, setGovDistrict] = useState('Dharmapuri');
  const [govState, setGovState] = useState('Tamil Nadu');
  const [govEmployeeId, setGovEmployeeId] = useState('IAS-TN-2014-0412');
  const [govPassword, setGovPassword] = useState('••••••••••');

  if (!isOpen) return null;

  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsCitizen({
      name: citizenName || 'Citizen User',
      phone: `+91 ${citizenPhone}`,
      district: citizenDistrict,
      state: citizenState,
    });
    if (onSuccessRole) onSuccessRole('citizen');
    onClose();
  };

  const handleGovSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    if (onSuccessRole) onSuccessRole('government');
    onClose();
  };

  const handleQuickDemo = (targetRole: AuthRole) => {
    loginWithDemoAccount(targetRole);
    if (onSuccessRole) onSuccessRole(targetRole);
    onClose();
  };

  const statesList = Array.from(new Set(INDIAN_DISTRICTS.map((d) => d.state))).sort();
  const districtList = INDIAN_DISTRICTS.filter((d) => 
    role === 'citizen' ? d.state === citizenState : d.state === govState
  ).map((d) => d.name).sort();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow">
              <ShieldCheck className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-xs font-mono tracking-wider uppercase text-amber-400 font-bold">
              JanaSetu Single Sign-On
            </span>
          </div>

          <h2 className="text-xl font-bold text-white">
            {role === 'citizen' ? 'Citizen Sign In' : 'Government Official Sign In'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {role === 'citizen' 
              ? 'Submit, track your development grievances, and explore verified local infrastructure.' 
              : 'Access the District & National Infrastructure Intelligence Command Center.'}
          </p>

          {/* Role Tabs */}
          <div className="grid grid-cols-2 gap-2 mt-5 p-1 bg-slate-800/90 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setRole('citizen')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                role === 'citizen'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Citizen Portal</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('government')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                role === 'government'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Government / Admin</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* 1-Click Demo Shortcut */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-amber-950">Quick 1-Click Demo Account</span>
                <p className="text-amber-800 text-[11px]">
                  {role === 'citizen' ? 'Login as Ramesh Kumar (Dharmapuri, TN)' : 'Login as Dr. Vijayakumar, IAS (District Collector)'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleQuickDemo(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm shrink-0 ${
                role === 'citizen'
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Instant Demo Login
            </button>
          </div>

          {/* Form based on selected role */}
          {role === 'citizen' ? (
            <form onSubmit={handleCitizenSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name / नागरिक का नाम
                </label>
                <input
                  type="text"
                  required
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">+91</span>
                    <input
                      type="tel"
                      required
                      value={citizenPhone}
                      onChange={(e) => setCitizenPhone(e.target.value)}
                      placeholder="9840123456"
                      className="w-full pl-10 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State
                  </label>
                  <select
                    value={citizenState}
                    onChange={(e) => setCitizenState(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    {statesList.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Home District
                </label>
                <select
                  value={citizenDistrict}
                  onChange={(e) => setCitizenDistrict(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {districtList.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Privacy First:</strong> Your phone number is used strictly for SMS status updates regarding your grievance. No public exposure of personal details.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Enter Citizen Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleGovSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Officer Name & Title
                </label>
                <input
                  type="text"
                  required
                  value={govName}
                  onChange={(e) => setGovName(e.target.value)}
                  placeholder="e.g. Dr. K. Vijayakumar, IAS"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gov / NIC Email ID
                  </label>
                  <input
                    type="email"
                    required
                    value={govEmail}
                    onChange={(e) => setGovEmail(e.target.value)}
                    placeholder="officer@nic.in"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    required
                    value={govDesignation}
                    onChange={(e) => setGovDesignation(e.target.value)}
                    placeholder="District Collector / Director"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jurisdiction Level
                  </label>
                  <select
                    value={govLevel}
                    onChange={(e) => setGovLevel(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    <option value="District">District Collectorate</option>
                    <option value="State">State Infrastructure Ministry</option>
                    <option value="National">National Planning Commission / PMO</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned District
                  </label>
                  <select
                    value={govDistrict}
                    onChange={(e) => setGovDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    {districtList.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department / Cell
                </label>
                <input
                  type="text"
                  required
                  value={govDepartment}
                  onChange={(e) => setGovDepartment(e.target.value)}
                  placeholder="e.g. Infrastructure Monitoring Cell / PWD"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-200 text-[11px] text-blue-900 flex items-start gap-2">
                <BadgeCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Official Cadre Access:</strong> Authorizes access to administrative sanction workflows, departmental routing, and priority gap briefs.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Enter Government Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
