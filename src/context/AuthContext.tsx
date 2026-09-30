import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AuthRole } from '../types';

export interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  loginAsCitizen: (info: {
    name: string;
    phone: string;
    district: string;
    state: string;
    talukOrVillage?: string;
    pincode?: string;
  }) => void;
  loginAsGovernment: (info: {
    name: string;
    email: string;
    designation: string;
    department: string;
    employeeId?: string;
    level: 'National' | 'State' | 'District';
    district?: string;
    state?: string;
  }) => void;
  loginWithDemoAccount: (role: 'citizen' | 'government') => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: (initialRole?: AuthRole) => void;
  closeAuthModal: () => void;
  modalInitialRole: AuthRole;
}

const DEMO_CITIZEN: UserProfile = {
  id: 'cit-tn-0821',
  name: 'Ramesh Kumar',
  role: 'citizen',
  phone: '+91 98401 23456',
  email: 'ramesh.kumar@example.in',
  citizenDistrict: 'Dharmapuri',
  citizenState: 'Tamil Nadu',
  citizenPincode: '636701',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
};

const DEMO_GOVERNMENT: UserProfile = {
  id: 'gov-ias-4412',
  name: 'Dr. K. Vijayakumar, IAS',
  role: 'government',
  email: 'dm-dharmapuri@nic.in',
  designation: 'District Magistrate & District Collector',
  department: 'Revenue & Disaster Management / District Infrastructure Cell',
  employeeId: 'IAS-TN-2014-0412',
  jurisdiction: {
    level: 'District',
    district: 'Dharmapuri',
    state: 'Tamil Nadu',
  },
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('janasetu_auth_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalInitialRole, setModalInitialRole] = useState<AuthRole>('citizen');

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('janasetu_auth_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('janasetu_auth_user');
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  const loginAsCitizen = (info: {
    name: string;
    phone: string;
    district: string;
    state: string;
    talukOrVillage?: string;
    pincode?: string;
  }) => {
    const user: UserProfile = {
      id: `cit-${Date.now().toString(36)}`,
      name: info.name,
      role: 'citizen',
      phone: info.phone,
      citizenDistrict: info.district,
      citizenState: info.state,
      citizenPincode: info.pincode,
    };
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const loginAsGovernment = (info: {
    name: string;
    email: string;
    designation: string;
    department: string;
    employeeId?: string;
    level: 'National' | 'State' | 'District';
    district?: string;
    state?: string;
  }) => {
    const user: UserProfile = {
      id: `gov-${Date.now().toString(36)}`,
      name: info.name,
      role: 'government',
      email: info.email,
      designation: info.designation,
      department: info.department,
      employeeId: info.employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      jurisdiction: {
        level: info.level,
        district: info.district,
        state: info.state,
      },
    };
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const loginWithDemoAccount = (role: 'citizen' | 'government') => {
    if (role === 'citizen') {
      setCurrentUser(DEMO_CITIZEN);
    } else {
      setCurrentUser(DEMO_GOVERNMENT);
    }
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const openAuthModal = (initialRole: AuthRole = 'citizen') => {
    setModalInitialRole(initialRole);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        loginAsCitizen,
        loginAsGovernment,
        loginWithDemoAccount,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        modalInitialRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
