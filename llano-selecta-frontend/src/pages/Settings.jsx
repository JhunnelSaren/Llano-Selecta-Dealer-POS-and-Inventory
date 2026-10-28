import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Upload, 
  Image as ImageIcon, 
  Save, 
  CheckCircle2, 
  Eye, 
  RotateCcw, 
  IceCream, 
  Building, 
  Phone, 
  MapPin, 
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth, DEFAULT_SETTINGS } from '../context/AuthContext';

export default function Settings() {
  const { systemSettings, updateSystemSettings } = useAuth();

  const [loginPhoto, setLoginPhoto] = useState(systemSettings?.login_photo_url || DEFAULT_SETTINGS.login_photo_url);
  const [loginCaption, setLoginCaption] = useState(systemSettings?.login_caption || DEFAULT_SETTINGS.login_caption);
  const [loginDescription, setLoginDescription] = useState(systemSettings?.login_description || DEFAULT_SETTINGS.login_description);
  const [dealerLogo, setDealerLogo] = useState(systemSettings?.dealer_logo_url || '');
  const [dealerName, setDealerName] = useState(systemSettings?.dealer_name || DEFAULT_SETTINGS.dealer_name);
  const [contactNumber, setContactNumber] = useState(systemSettings?.contact_number || DEFAULT_SETTINGS.contact_number);
  const [address, setAddress] = useState(systemSettings?.address || DEFAULT_SETTINGS.address);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Preset Wallpapers
  const PRESET_WALLPAPERS = [
    {
      name: 'Classic Ice Cream Scoops',
      url: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=2000'
    },
    {
      name: 'Cold Cones & Sundae',
      url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=2000'
    },
    {
      name: 'Selecta Strawberry & Vanilla',
      url: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=2000'
    }
  ];

  // Handle Photo Upload from file
  const handlePhotoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLoginPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Logo Upload from file
  const handleLogoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setDealerLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      login_photo_url: loginPhoto,
      login_caption: loginCaption,
      login_description: loginDescription,
      dealer_logo_url: dealerLogo,
      dealer_name: dealerName,
      contact_number: contactNumber,
      address: address
    };

    await updateSystemSettings(payload);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset branding and login layout back to standard default settings?')) {
      setLoginPhoto(DEFAULT_SETTINGS.login_photo_url);
      setLoginCaption(DEFAULT_SETTINGS.login_caption);
      setLoginDescription(DEFAULT_SETTINGS.login_description);
      setDealerLogo('');
      setDealerName(DEFAULT_SETTINGS.dealer_name);
      setContactNumber(DEFAULT_SETTINGS.contact_number);
      setAddress(DEFAULT_SETTINGS.address);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            System Branding & Login Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Customize the login homepage photo from local files, modify dealership captions, descriptions & logo
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={handleResetDefaults}
            className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
          </button>
          <button 
            type="button"
            onClick={handleSave}
            className="btn-primary py-2 px-5 text-xs font-bold shadow-md shadow-brand-red/20 flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Settings saved successfully! Login portal photo, captions, descriptions, and logo have been updated.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Customization Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Login Homepage Photo & Presets */}
          <div className="card space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-brand-red" />
                <h3 className="font-bold text-slate-900 text-sm">Login Homepage Photo</h3>
              </div>
              <span className="text-[11px] text-slate-400">High-res wallpaper</span>
            </div>

            <div className="space-y-3">
              {/* Photo Preview & Upload */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-900 h-44 shadow-xs group">
                <img 
                  src={loginPhoto} 
                  alt="Login background preview" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center gap-3 backdrop-blur-2xs">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-black shadow-lg hover:bg-slate-100 transition-colors">
                    <Upload className="w-4 h-4 text-brand-red" /> Choose Photo from Files
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoFileUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {/* URL Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Or Paste Photo Image URL
                </label>
                <input 
                  type="text" 
                  value={loginPhoto}
                  onChange={(e) => setLoginPhoto(e.target.value)}
                  placeholder="https://..."
                  className="input-field text-xs" 
                />
              </div>

              {/* Preset Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                  Or Pick a Preset Wallpaper:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_WALLPAPERS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLoginPhoto(preset.url)}
                      className={`p-2 rounded-xl border text-left transition-all text-[11px] font-semibold ${
                        loginPhoto === preset.url
                          ? 'border-brand-red bg-red-50 text-brand-red ring-1 ring-brand-red'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="truncate">{preset.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Login Captions & Descriptions */}
          <div className="card space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm">Login Captions & Descriptions</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Homepage Headline / Caption
                </label>
                <input 
                  type="text" 
                  value={loginCaption}
                  onChange={(e) => setLoginCaption(e.target.value)}
                  placeholder="e.g. Selecta Ice Cream Dealer Operations..."
                  className="input-field font-bold text-xs" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Homepage Description & Welcome Text
                </label>
                <textarea 
                  value={loginDescription}
                  onChange={(e) => setLoginDescription(e.target.value)}
                  placeholder="Detailed subtitle or dealer instructions displayed on the login screen..."
                  rows={3}
                  className="input-field resize-none text-xs leading-relaxed" 
                />
              </div>
            </div>
          </div>

          {/* Card 3: Dealer Logo & Business Information */}
          <div className="card space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Building className="w-4 h-4 text-brand-red" />
              <h3 className="font-bold text-slate-900 text-sm">Dealership Logo & Contact Details</h3>
            </div>

            <div className="space-y-3">
              {/* Logo Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Dealer Brand Logo
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-1 overflow-hidden shadow-xs shrink-0">
                    {dealerLogo ? (
                      <img src={dealerLogo} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <div className="bg-brand-red w-10 h-10 rounded-xl flex items-center justify-center text-white">
                        <IceCream className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs">
                      <Upload className="w-3.5 h-3.5" /> Upload Logo from Files
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleLogoFileUpload} 
                        className="hidden" 
                      />
                    </label>
                    <input 
                      type="text" 
                      value={dealerLogo}
                      onChange={(e) => setDealerLogo(e.target.value)}
                      placeholder="Or paste Logo Image URL..."
                      className="input-field text-xs" 
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dealer Business Name</label>
                  <input 
                    type="text" 
                    value={dealerName}
                    onChange={(e) => setDealerName(e.target.value)}
                    className="input-field text-xs font-bold" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Business Phone Number</label>
                  <input 
                    type="text" 
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="input-field text-xs" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dealership Hub Address</label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input-field text-xs" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview: Live Interactive Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-20 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4" /> Live Login Portal Preview
              </span>
              <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                Real-Time
              </span>
            </div>

            {/* Mockup Card */}
            <div className="rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-950 text-white shadow-2xl relative min-h-[460px] flex flex-col justify-between p-5">
              {/* Background with Ambient Vignette */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-40 scale-105"
                style={{ backgroundImage: `url('${loginPhoto}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />

              {/* Content Preview */}
              <div className="relative z-10 space-y-4">
                {/* Brand Logo & Name */}
                <div className="flex items-center gap-2.5">
                  {dealerLogo ? (
                    <img src={dealerLogo} alt="Logo" className="w-9 h-9 object-contain rounded-xl bg-white/10 p-1" />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-brand-red flex items-center justify-center text-white shadow-md shadow-brand-red/30">
                      <IceCream className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-black text-white text-sm">{dealerName}</h4>
                    <p className="text-[10px] text-slate-400">Bukidnon Cold-Chain Operations</p>
                  </div>
                </div>

                {/* Captions Preview */}
                <div className="pt-8 space-y-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-brand-red/30 text-red-300 border border-brand-red/40 uppercase">
                    Official Portal
                  </span>
                  <h3 className="text-xl font-black text-white leading-tight">
                    {loginCaption || 'Selecta Ice Cream Operations'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed opacity-90 line-clamp-4">
                    {loginDescription || 'Official distribution portal for store bookings and deliveries.'}
                  </p>
                </div>
              </div>

              {/* Mockup Bottom Controls */}
              <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-brand-red" /> {contactNumber}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-red" /> {address}
                </span>
              </div>
            </div>

            <button 
              type="submit"
              onClick={handleSave}
              className="w-full btn-primary py-3 rounded-xl font-black text-xs shadow-lg shadow-brand-red/25 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save System Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
