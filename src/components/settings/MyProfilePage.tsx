import React, { useState } from 'react';
import { 
  UserProfile, 
  CurrentView 
} from '../../types';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  ShieldCheck, 
  Key, 
  Bell, 
  CheckCircle2, 
  Save, 
  Smartphone, 
  Globe, 
  Lock 
} from 'lucide-react';

interface MyProfilePageProps {
  currentUser: UserProfile;
  onNavigate: (view: CurrentView) => void;
  onUpdateProfile?: (updated: Partial<UserProfile>) => void;
}

export const MyProfilePage: React.FC<MyProfilePageProps> = ({
  currentUser,
  onNavigate,
  onUpdateProfile,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [roleTitle, setRoleTitle] = useState(currentUser.roleTitle);
  const [phone, setPhone] = useState('+84 908 182 991');
  const [timezone, setTimezone] = useState('Asia/Ho_Chi_Minh (GMT+7)');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsUrgentAlerts, setSmsUrgentAlerts] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        name,
        email,
        roleTitle,
      });
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span className="cursor-pointer hover:text-indigo-600" onClick={() => onNavigate({ type: 'public', tab: 'home' })}>
            FlexGO
          </span>
          <span>/</span>
          <span className="font-semibold text-slate-700">Settings</span>
          <span>/</span>
          <span className="text-indigo-600 font-bold">My Profile</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <User className="w-7 h-7 text-indigo-600" />
          <span>User Account & Security Profile</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal authorized representative details, login security credentials, and RFQ notification settings.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center gap-5 border-b border-slate-100 pb-6">
            <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-black shadow-md ring-4 ring-indigo-50">
              {initials}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{name}</h2>
              <p className="text-xs text-slate-500">{currentUser.companyName} • {currentUser.companyType} Persona</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold mt-2 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Authorized Officer</span>
              </div>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Full Legal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Corporate Position / Job Title</label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Work Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Mobile / WhatsApp Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Operating Timezone</label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Assigned Organization</label>
              <input
                type="text"
                disabled
                value={currentUser.companyName}
                className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Security & Authentication */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            <span>Authentication & Two-Factor Security</span>
          </h3>

          <div className="divide-y divide-slate-100">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Two-Factor Authentication (2FA OTP)</p>
                <p className="text-slate-500 text-[11px]">Require OTP verification when executing contracts or authorizing large credit top-ups</p>
              </div>
              <button
                type="button"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                  twoFactorEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Account Password</p>
                <p className="text-slate-500 text-[11px]">Last changed 30 days ago</p>
              </div>
              <button
                type="button"
                onClick={() => alert('Password reset verification link sent to your registered work email.')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold text-xs cursor-pointer"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <span>RFQ & Quotation Notification Channels</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
              <div>
                <span className="font-semibold text-slate-900 block">Email Instant Alerts</span>
                <span className="text-slate-500 text-[11px]">Receive quote responses and RFQ bids directly in your inbox</span>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
              <div>
                <span className="font-semibold text-slate-900 block">Urgent Lead SMS / WhatsApp Notifications</span>
                <span className="text-slate-500 text-[11px]">Instant text alert when urgent matching leads are posted</span>
              </div>
              <input
                type="checkbox"
                checked={smsUrgentAlerts}
                onChange={(e) => setSmsUrgentAlerts(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
            </label>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between">
          {isSaved ? (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
            </span>
          ) : (
            <span className="text-xs text-slate-400">Changes are applied immediately across your workspace.</span>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
