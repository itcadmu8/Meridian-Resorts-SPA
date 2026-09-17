import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Compass, User, Briefcase, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface LoginExperienceProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (username: string) => void;
  onGuestLoginSuccess?: (resNumber: string, lastName: string) => void;
  onStaffLoginSuccess?: (employeeId: string, role: string) => void;
  onGuestCredentials?: (username: string, password: string) => Promise<void>;
  onStaffCredentials?: (username: string, password: string) => Promise<void>;
}

export const LoginExperience: React.FC<LoginExperienceProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onGuestLoginSuccess,
  onStaffLoginSuccess,
  onGuestCredentials,
  onStaffCredentials,
}) => {
  const { signIn } = useAuth();
  const [activeTab, setActiveTab] = useState<'guest' | 'staff'>('guest');

  // Guest credentials
  const [guestUsername, setGuestUsername] = useState('');
  const [guestPassword, setGuestPassword] = useState('');
  const [showGuestPassword, setShowGuestPassword] = useState(false);

  // Staff credentials
  const [staffUsername, setStaffUsername] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!guestUsername.trim() || !guestPassword.trim()) return;

    setIsLoading(true);
    const authPromise = onGuestCredentials
      ? onGuestCredentials(guestUsername, guestPassword)
      : signIn({ username: guestUsername, password: guestPassword, role: 'GUEST' });

    Promise.resolve(authPromise)
      .then(() => {
        if (onLoginSuccess) onLoginSuccess(guestUsername);
        if (onGuestLoginSuccess) onGuestLoginSuccess('MER-89241', guestUsername);
        onClose();
      })
      .catch((err: any) => {
        setError(err?.message || err?.detail || 'Invalid username or password. Please try again.');
      })
      .finally(() => setIsLoading(false));
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!staffUsername.trim() || !staffPassword.trim()) return;

    setIsLoading(true);
    const authPromise = onStaffCredentials
      ? onStaffCredentials(staffUsername, staffPassword)
      : signIn({ username: staffUsername, password: staffPassword, role: 'STAFF' });

    Promise.resolve(authPromise)
      .then(() => {
        if (onLoginSuccess) onLoginSuccess(staffUsername);
        if (onStaffLoginSuccess) onStaffLoginSuccess(staffUsername, 'Butler & Guest Experience');
        if (!onStaffCredentials) window.location.assign('/staff/dashboard');
        onClose();
      })
      .catch((err: any) => {
        setError(err?.message || err?.detail || 'Invalid staff credentials. Please check your Staff ID and password.');
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/40 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25 }}
        className="bg-[#FBF9F5] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-[#C5A880]/40 my-8 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-4 bg-[#0D242E] text-white border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-[#DFCDAA]" />
            <span className="font-serif text-lg tracking-[0.16em] uppercase text-[#FBF9F5]">
              Meridian
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle: Guest Login vs Staff Login */}
        <div className="grid grid-cols-2 border-b border-[#EFE8DE] bg-[#F5F0EB]/90">
          <button
            type="button"
            onClick={() => { setActiveTab('guest'); setError(''); }}
            className={`py-3.5 px-4 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.14em] font-semibold transition-all ${activeTab === 'guest'
                ? 'bg-[#FBF9F5] text-[#0D242E] border-b-2 border-[#C5A880]'
                : 'text-[#1C2826]/60 hover:text-[#0D242E]'
              }`}
          >
            <User className="w-4 h-4 text-[#C5A880]" />
            <span>Guest Login</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('staff'); setError(''); }}
            className={`py-3.5 px-4 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.14em] font-semibold transition-all ${activeTab === 'staff'
                ? 'bg-[#FBF9F5] text-[#0D242E] border-b-2 border-[#C5A880]'
                : 'text-[#1C2826]/60 hover:text-[#0D242E]'
              }`}
          >
            <Briefcase className="w-4 h-4 text-[#C5A880]" />
            <span>Staff Login</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}

          {activeTab === 'guest' ? (
            /* Guest Login Form */
            <form onSubmit={handleGuestSubmit} className="space-y-4">
              <div className="text-center mb-5">
                <h3 className="font-serif text-2xl text-[#0D242E] font-normal">
                  Guest Sign In
                </h3>
                <p className="text-xs text-[#1C2826]/70 mt-1 font-sans">
                  Access your upcoming stay, digital key, and concierge preferences.
                </p>
              </div>

              {/* Username */}
              <div>
                <label
                  htmlFor="guest-username-input"
                  className="block text-xs uppercase tracking-wider font-semibold text-[#1C2826]/75 mb-1.5 font-sans"
                >
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#1C2826]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="guest-username-input"
                    type="text"
                    required
                    value={guestUsername}
                    onChange={(e) => setGuestUsername(e.target.value)}
                    placeholder="Guest username"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#EFE8DE] rounded-xl text-xs text-[#0D242E] placeholder:text-[#1C2826]/40 focus:outline-none focus:border-[#C5A880] transition-colors shadow-2xs font-sans"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="guest-password-input"
                  className="block text-xs uppercase tracking-wider font-semibold text-[#1C2826]/75 mb-1.5 font-sans"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#1C2826]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="guest-password-input"
                    type={showGuestPassword ? 'text' : 'password'}
                    required
                    value={guestPassword}
                    onChange={(e) => setGuestPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 pr-10 py-3 bg-white border border-[#EFE8DE] rounded-xl text-xs text-[#0D242E] placeholder:text-[#1C2826]/40 focus:outline-none focus:border-[#C5A880] transition-colors shadow-2xs font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGuestPassword(!showGuestPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1C2826]/40 hover:text-[#0D242E] transition-colors"
                    aria-label={showGuestPassword ? 'Hide password' : 'Show password'}
                  >
                    {showGuestPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#0D242E] hover:bg-[#133845] disabled:opacity-50 text-white rounded-full text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  {isLoading ? (
                    <span>Accessing Sanctuary...</span>
                  ) : (
                    <>
                      <span>Sign In as Guest</span>
                      <ArrowRight className="w-4 h-4 text-[#C5A880]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Staff Login Form */
            <form onSubmit={handleStaffSubmit} className="space-y-4">
              <div className="text-center mb-5">
                <h3 className="font-serif text-2xl text-[#0D242E] font-normal">
                  Colleague Sign In
                </h3>
                <p className="text-xs text-[#1C2826]/70 mt-1 font-sans">
                  Access resort PMS, arrivals, and butler dispatch dashboard.
                </p>
              </div>

              {/* Username / Staff ID */}
              <div>
                <label
                  htmlFor="staff-username-input"
                  className="block text-xs uppercase tracking-wider font-semibold text-[#1C2826]/75 mb-1.5 font-sans"
                >
                  Username
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-[#1C2826]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="staff-username-input"
                    type="text"
                    required
                    value={staffUsername}
                    onChange={(e) => setStaffUsername(e.target.value)}
                    placeholder="Staff username"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#EFE8DE] rounded-xl text-xs text-[#0D242E] placeholder:text-[#1C2826]/40 focus:outline-none focus:border-[#C5A880] transition-colors shadow-2xs font-sans"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="staff-password-input"
                  className="block text-xs uppercase tracking-wider font-semibold text-[#1C2826]/75 mb-1.5 font-sans"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#1C2826]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="staff-password-input"
                    type={showStaffPassword ? 'text' : 'password'}
                    required
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 pr-10 py-3 bg-white border border-[#EFE8DE] rounded-xl text-xs text-[#0D242E] placeholder:text-[#1C2826]/40 focus:outline-none focus:border-[#C5A880] transition-colors shadow-2xs font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowStaffPassword(!showStaffPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1C2826]/40 hover:text-[#0D242E] transition-colors"
                    aria-label={showStaffPassword ? 'Hide password' : 'Show password'}
                  >
                    {showStaffPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#0D242E] hover:bg-[#133845] disabled:opacity-50 text-white rounded-full text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  {isLoading ? (
                    <span>Authenticating Terminal...</span>
                  ) : (
                    <>
                      <span>Sign In to Staff Portal</span>
                      <ArrowRight className="w-4 h-4 text-[#C5A880]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
