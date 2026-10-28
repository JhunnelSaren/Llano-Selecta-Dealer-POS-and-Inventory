import React, { useState } from 'react';
import { 
  IceCream, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Building,
  KeyRound
} from 'lucide-react';
import { useAuth, ROLES, DEFAULT_SETTINGS } from '../context/AuthContext';

export default function Login() {
  const { login, registerEmployee, systemSettings } = useAuth();
  
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Login Form State
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  // Registration Form State
  const [regData, setRegData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    notes: ''
  });

  // Settings values with fallbacks
  const bgPhoto = systemSettings?.login_photo_url || DEFAULT_SETTINGS.login_photo_url;
  const brandLogo = systemSettings?.dealer_logo_url || '';
  const brandName = systemSettings?.dealer_name || DEFAULT_SETTINGS.dealer_name;
  const headline = systemSettings?.login_caption || DEFAULT_SETTINGS.login_caption;
  const description = systemSettings?.login_description || DEFAULT_SETTINGS.login_description;
  const contactPhone = systemSettings?.contact_number || DEFAULT_SETTINGS.contact_number;

  // Handle Login Submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (!usernameOrEmail.trim() || !password.trim()) {
      setErrorMsg('Please enter both your username/email and password.');
      setLoading(false);
      return;
    }

    const result = await login(usernameOrEmail.trim(), password.trim());
    setLoading(false);
    if (!result.success) {
      setErrorMsg(result.message);
    }
  };



  // Handle Employee Registration Submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regData.name.trim() || !regData.password.trim() || !regData.phone.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setLoading(true);
    const result = await registerEmployee(regData);
    setLoading(false);

    if (result.success) {
      setSuccessMsg(result.message);
      setIsRegister(false);
      setUsernameOrEmail(regData.username || regData.email || 'employee');
      setPassword(regData.password);
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-hidden bg-slate-950 font-sans">
      {/* Background Image configured by Admin via Settings */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-105"
        style={{ backgroundImage: `url('${bgPhoto}')` }}
      >
        {/* Dark Vignette & Red Ambient Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/95 backdrop-blur-2xs" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-red/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Floating Hero Banner with Settings Customizations */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-between h-full min-h-[520px] p-6 text-white">
          {/* Top Brand Logo & Dealership Name */}
          <div className="flex items-center gap-3">
            {brandLogo ? (
              <img src={brandLogo} alt="Logo" className="w-12 h-12 object-contain rounded-2xl bg-white/10 p-1.5 shadow-lg" />
            ) : (
              <div className="bg-brand-red p-3 rounded-2xl text-white shadow-lg shadow-brand-red/40 flex items-center justify-center">
                <IceCream className="w-7 h-7" />
              </div>
            )}
            <div>
              <span className="text-xl font-black tracking-tight text-white block">
                {brandName.split(' ')[0]} <span className="text-brand-red">{brandName.split(' ').slice(1).join(' ') || 'SELECTA'}</span>
              </span>
              <p className="text-xs text-slate-400 font-medium">Dealer POS & Inventory System</p>
            </div>
          </div>

          {/* Center Captions & Descriptions (Customizable via Settings) */}
          <div className="space-y-4 my-auto py-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-red" /> Authorized Dealer Portal
            </div>
            <h1 className="text-3xl xl:text-4xl font-black text-white leading-tight">
              {headline}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md font-normal opacity-90">
              {description}
            </p>
          </div>

          {/* Footer Info */}
          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div>Support: <strong className="text-white">{contactPhone}</strong></div>
            <div>PostgreSQL 18 Connected</div>
          </div>
        </div>

        {/* Right Form: Login / Registration Portal */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            {/* Header Tabs: Sign In vs Apply / Register */}
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => { setIsRegister(false); setErrorMsg(''); }}
                className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
                  !isRegister
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsRegister(true); setErrorMsg(''); }}
                className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
                  isRegister
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Apply / Register
              </button>
            </div>

            {/* Error & Success Messages */}
            {errorMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-semibold leading-snug">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-semibold leading-snug">{successMsg}</span>
              </div>
            )}

            {/* FORM 1: SIGN IN */}
            {!isRegister ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Username or Email
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={usernameOrEmail}
                      onChange={(e) => setUsernameOrEmail(e.target.value)}
                      placeholder="e.g. admin or staff"
                      className="input-field pl-10 text-xs font-bold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password..."
                      className="input-field pl-10 pr-10 text-xs font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>



                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 rounded-2xl font-black text-xs shadow-lg shadow-brand-red/30 flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? 'Authenticating...' : 'Sign In to Portal'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* FORM 2: EMPLOYEE REGISTRATION (Pending Verification) */
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    New employee registrations must be <strong>verified and accepted by the Admin</strong> before access is granted.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={regData.name}
                    onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                    placeholder="e.g. Maria Dela Cruz"
                    className="input-field text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Desired Username
                    </label>
                    <input
                      type="text"
                      value={regData.username}
                      onChange={(e) => setRegData({ ...regData, username: e.target.value })}
                      placeholder="e.g. maria_staff"
                      className="input-field text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={regData.phone}
                      onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                      placeholder="e.g. 0917-123-4567"
                      className="input-field text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    placeholder="e.g. maria@gmail.com"
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Create Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    placeholder="Enter account password..."
                    className="input-field text-xs font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Application Note / Experience
                  </label>
                  <textarea
                    value={regData.notes}
                    onChange={(e) => setRegData({ ...regData, notes: e.target.value })}
                    placeholder="e.g. Applying as delivery driver or inventory crew..."
                    rows={2}
                    className="input-field text-xs resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 rounded-2xl font-black text-xs shadow-lg shadow-brand-red/30 flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? 'Submitting...' : 'Submit Application for Admin Approval'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
