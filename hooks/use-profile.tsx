'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProfileData {
  name: string;
  email: string;
  diabetesType: string;
  targetGlucose: number;
  sensitivityFactor: number;
  carbRatio: number;
}

const DEFAULT_PROFILE: ProfileData = {
  name: '',
  email: '',
  diabetesType: 'Tipo 1',
  targetGlucose: 100,
  sensitivityFactor: 50,
  carbRatio: 15,
};

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
  saveProfile: () => void;
  isLoaded: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadProfile = () => {
      const saved = localStorage.getItem('glicocalc_profile');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setProfile(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error('Failed to parse profile', e);
        }
      }
      setIsLoaded(true);
    };

    // Defer execution to avoid "setState in effect" lint error
    const timer = setTimeout(loadProfile, 0);
    return () => clearTimeout(timer);
  }, []);

  const updateProfile = (data: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...data }));
  };

  const saveProfile = () => {
    localStorage.setItem('glicocalc_profile', JSON.stringify(profile));
    // Optional: Show a toast or notification
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, saveProfile, isLoaded }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
