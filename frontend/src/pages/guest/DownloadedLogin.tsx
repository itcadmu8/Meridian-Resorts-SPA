/**
 * @file DownloadedLogin.tsx
 * @description Page view component for DownloadedLogin.
 */
import React, { useRef } from 'react';
import { LoginExperience } from '../../guest-experience/components/LoginExperience';
import { useAuth } from '../../hooks/useAuth';

interface DownloadedLoginProps {
  onNavigate: (path: string) => void;
}

export default function DownloadedLogin({ onNavigate }: DownloadedLoginProps) {
  const { signIn } = useAuth();
  const navigatedAsStaff = useRef(false);
  const redirect = new URLSearchParams(window.location.search).get('redirect') || '/guest';

  return (
    <div className="min-h-screen bg-[#0D242E]">
      <LoginExperience
        isOpen
        onClose={() => {
          if (!navigatedAsStaff.current) onNavigate('/guest');
        }}
        onGuestCredentials={async (username, password) => {
          await signIn({ username, password, role: 'GUEST' });
          window.location.assign(redirect);
        }}
        onStaffCredentials={async (username, password) => {
          await signIn({ username, password, role: 'STAFF' });
          navigatedAsStaff.current = true;
          onNavigate('/staff/dashboard');
        }}
      />
    </div>
  );
}
