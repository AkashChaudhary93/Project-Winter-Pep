import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ChefHat, Store, MapPin, Phone, KeyRound, ArrowRight, Loader2, Sparkles, Utensils, Zap, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const API_base = 'http://localhost:9999/auth';

const BLOCKS = [
    "Block 34 (Main Cafeteria)",
    "Block 33 (Food Court)",
    "Block 34 (Oven Express)",
    "BH 1 (Boys Hostel 1)",
    "BH 2 (Boys Hostel 2)",
    "BH 3 (Boys Hostel 3)",
    "GH 1 (Girls Hostel 1)",
    "GH 2 (Girls Hostel 2)",
    "Uni-Mall (Food Street)",
    "M-Block (Engineering Canteen)"
];

const LoginPage = () => {
    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
    const [step, setStep] = useState(1); // 1: Input, 2: OTP
    const [loading, setLoading] = useState(false);

    // Form States
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [shopName, setShopName] = useState('');
    const [block, setBlock] = useState('');

    const sendOtp = async () => {
        if (phoneNumber.length < 10) return alert("Enter valid phone number");
        setLoading(true);
        try {
            await axios.post(`${API_base}/send-otp`, { phoneNumber });
            setStep(2);
        } catch (error) {
            alert("Failed to send OTP. Is backend running?");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        if (otp.length !== 4) return alert("Enter 4-digit OTP");
        setLoading(true);
        try {
            const payload = {
                phoneNumber,
                otp,
                role: 'VENDOR'
            };

            if (authMode === 'signup') {
                if (!name || !shopName || !block) {
                    setLoading(false);
                    return alert("Please fill all details");
                }
                payload.name = name;
                payload.shopName = shopName;
                payload.block = block;
            }

            const res = await axios.post(`${API_base}/verify-otp`, payload);

            if (res.data.success) {
                login(res.data.user);
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Verification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden transition-colors duration-700 ${theme === 'dark' ? 'bg-[#0c0a09]' : 'bg-stone-50'
            }`}>
            {/* ── Dynamic Mesh Gradient Background ── */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full blur-[140px] opacity-20 animate-blob mix-blend-screen ${theme === 'dark' ? 'bg-brand-600' : 'bg-brand-400'}`}></div>
                <div className={`absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 animate-blob-reverse mix-blend-screen ${theme === 'dark' ? 'bg-orange-600' : 'bg-orange-400'}`} style={{ animationDelay: '2s' }}></div>
                <div className={`absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-10 animate-pulse mix-blend-screen ${theme === 'dark' ? 'bg-amber-600' : 'bg-amber-400'}`}></div>
            </div>

            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className={`absolute top-6 right-6 z-50 p-3 rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700' : 'bg-white text-stone-400 hover:text-brand-600 hover:shadow-lg'}`}
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className={`w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-[48px] shadow-2xl border transition-all duration-500 overflow-hidden relative z-10 ${theme === 'dark'
                ? 'bg-stone-900/80 border-stone-800 backdrop-blur-2xl shadow-black/50'
                : 'bg-white/70 border-white/60 backdrop-blur-2xl shadow-stone-200/50'
                }`}>

                {/* ── Visual Side Panel (Elite Redesign) ── */}
                <div className="hidden md:flex flex-col justify-between p-12 text-white relative overflow-hidden">
                    {/* Glass Surface Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-600/95 via-brand-500/90 to-orange-600/95 animate-gradient-slow overflow-hidden z-0">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    </div>

                    {/* Animated Decor */}
                    <div className="absolute top-[-20%] right-[-20%] w-80 h-80 bg-white/10 rounded-full blur-3xl animate-blob z-0"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-orange-300/20 rounded-full blur-3xl animate-blob-reverse z-0" style={{ animationDelay: '4s' }}></div>

                    <div className="relative z-10 animate-in fade-in slide-in-from-left-8 duration-700">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[24px] flex items-center justify-center mb-10 border border-white/20 shadow-2xl transition-transform hover:scale-110 hover:rotate-6 duration-500 group cursor-pointer">
                            <ChefHat size={36} className="drop-shadow-lg group-hover:text-amber-200 transition-colors" />
                        </div>
                        <h2 className="text-6xl font-black leading-[0.95] tracking-tighter drop-shadow-lg">
                            Fueling <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-200">Campus</span> <br />
                            Cravings. <span className="inline-block animate-bounce-slow filter drop-shadow-lg">🍕</span>
                        </h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-white/40 to-transparent rounded-full mt-10"></div>
                        <p className="text-lg font-medium text-white/90 mt-8 leading-relaxed max-w-[320px] backdrop-blur-sm">
                            Join the elite circle of campus vendors. Scale your brand with real-time intelligence.
                        </p>
                    </div>

                    <div className="relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <div className="flex items-center gap-5 bg-black/20 backdrop-blur-xl p-5 rounded-[32px] border border-white/10 group hover:bg-black/30 hover:border-white/20 hover:translate-y-[-2px] hover:shadow-2xl transition-all duration-300 cursor-default">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                <Zap size={24} fill="currentColor" strokeWidth={0} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-1 group-hover:text-white/80 transition-colors">Kitchen Intelligence</p>
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    <p className="text-sm font-black text-white uppercase tracking-tight">Active Real-Time Node</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Form Panel (Glassmorphism & Refined UI) ── */}
                <div className="p-8 md:p-14 flex flex-col justify-center relative">
                    {/* Mobile Branding */}
                    <div className="md:hidden flex items-center gap-3 mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                            <ChefHat size={28} />
                        </div>
                        <h1 className={`text-2xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>CampusCrave</h1>
                    </div>

                    {/* Auth Toggle (Premium Design) */}
                    <div className={`p-1.5 rounded-[24px] mb-12 flex transition-all duration-500 ${theme === 'dark'
                        ? 'bg-stone-800/80 backdrop-blur-lg border border-stone-700/50 shadow-inner'
                        : 'bg-stone-100/80 backdrop-blur-lg border border-stone-200/50 shadow-inner'
                        }`}>
                        {['login', 'signup'].map((mode, idx) => (
                            <button
                                key={mode}
                                onClick={() => { setAuthMode(mode); setStep(1); }}
                                className={`flex-1 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 relative overflow-hidden ${authMode === mode
                                    ? (theme === 'dark' ? 'text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)]' : 'text-stone-900 shadow-[0_8px_20px_rgba(0,0,0,0.08)]')
                                    : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
                                    }`}
                            >
                                {authMode === mode && (
                                    <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-stone-700' : 'bg-white'} rounded-[20px] transition-all duration-300 layout-id-${mode}`}></div>
                                )}
                                <span className="relative z-10">{mode}</span>
                            </button>
                        ))}
                    </div>

                    {/* Content Header */}
                    <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="h-0.5 w-6 bg-brand-500 rounded-full"></div>
                            <span className="text-[11px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-[0.25em]">
                                Welcome Partner
                            </span>
                            <Sparkles size={14} className="text-amber-400 animate-pulse" />
                        </div>
                        <h3 className={`text-4xl font-black tracking-tight mb-3 transition-colors ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                            {step === 1
                                ? (authMode === 'login' ? 'Vendor Portal' : 'Register Shop')
                                : 'Protect Identity'
                            }
                        </h3>
                        <p className={`font-bold text-sm transition-colors ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                            {step === 1
                                ? "Enter credentials to access your dashboard."
                                : "A secure token has been dispatched to your device."}
                        </p>
                    </div>

                    <div className="space-y-6">
                        {step === 1 ? (
                            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-500">
                                {authMode === 'signup' && (
                                    <>
                                        <div className="group relative">
                                            <div className={`absolute inset-0 rounded-[22px] transition-opacity duration-300 pointer-events-none opacity-0 group-focus-within:opacity-100 ${theme === 'dark' ? 'bg-brand-500/10' : 'bg-brand-50'}`}></div>
                                            <Utensils size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-brand-500 transition-colors z-10" />
                                            <input
                                                type="text"
                                                placeholder="Proprietor Name"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                className={`w-full pl-14 pr-6 py-5 rounded-[22px] border outline-none font-bold text-sm transition-all relative z-10 bg-transparent ${theme === 'dark'
                                                    ? 'border-stone-800 text-white placeholder-stone-600 focus:border-brand-500/50 hover:border-stone-700'
                                                    : 'border-stone-200 text-stone-900 placeholder-stone-400 focus:border-brand-300 hover:border-stone-300'
                                                    }`}
                                            />
                                        </div>
                                        <div className="group relative">
                                            <div className={`absolute inset-0 rounded-[22px] transition-opacity duration-300 pointer-events-none opacity-0 group-focus-within:opacity-100 ${theme === 'dark' ? 'bg-brand-500/10' : 'bg-brand-50'}`}></div>
                                            <Store size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-brand-500 transition-colors z-10" />
                                            <input
                                                type="text"
                                                placeholder="Legal Shop Name"
                                                value={shopName}
                                                onChange={e => setShopName(e.target.value)}
                                                className={`w-full pl-14 pr-6 py-5 rounded-[22px] border outline-none font-bold text-sm transition-all relative z-10 bg-transparent ${theme === 'dark'
                                                    ? 'border-stone-800 text-white placeholder-stone-600 focus:border-brand-500/50 hover:border-stone-700'
                                                    : 'border-stone-200 text-stone-900 placeholder-stone-400 focus:border-brand-300 hover:border-stone-300'
                                                    }`}
                                            />
                                        </div>
                                        <div className="group relative">
                                            <div className={`absolute inset-0 rounded-[22px] transition-opacity duration-300 pointer-events-none opacity-0 group-focus-within:opacity-100 ${theme === 'dark' ? 'bg-brand-500/10' : 'bg-brand-50'}`}></div>
                                            <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-brand-500 transition-colors z-10" />
                                            <select
                                                value={block}
                                                onChange={e => setBlock(e.target.value)}
                                                className={`w-full pl-14 pr-10 py-5 rounded-[22px] border outline-none font-bold text-sm appearance-none cursor-pointer transition-all relative z-10 bg-transparent ${theme === 'dark'
                                                    ? 'border-stone-800 text-white focus:border-brand-500/50 hover:border-stone-700'
                                                    : 'border-stone-200 text-stone-900 focus:border-brand-300 hover:border-stone-300'
                                                    }`}
                                            >
                                                <option value="" disabled className={theme === 'dark' ? 'bg-stone-900' : 'bg-white'}>Market Area (Block)</option>
                                                {BLOCKS.map(b => (
                                                    <option key={b} value={b} className={theme === 'dark' ? 'bg-stone-900' : 'bg-white'}>{b}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4.5L6 7.5L9 4.5" /></svg>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="group relative">
                                    <div className={`absolute inset-0 rounded-[22px] transition-opacity duration-300 pointer-events-none opacity-0 group-focus-within:opacity-100 ${theme === 'dark' ? 'bg-brand-500/10' : 'bg-brand-50'}`}></div>
                                    <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-brand-500 transition-colors z-10" />
                                    <input
                                        type="tel"
                                        placeholder="Mobile Identity"
                                        value={phoneNumber}
                                        onChange={e => setPhoneNumber(e.target.value)}
                                        className={`w-full pl-14 pr-6 py-5 rounded-[22px] border outline-none font-bold text-sm transition-all relative z-10 bg-transparent ${theme === 'dark'
                                            ? 'border-stone-800 text-white placeholder-stone-600 focus:border-brand-500/50 hover:border-stone-700'
                                            : 'border-stone-200 text-stone-900 placeholder-stone-400 focus:border-brand-300 hover:border-stone-300'
                                            }`}
                                    />
                                </div>

                                <button
                                    onClick={sendOtp}
                                    disabled={loading}
                                    className="group w-full h-16 bg-stone-900 dark:bg-brand-600 text-white rounded-[26px] font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl hover:shadow-brand-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 mt-8 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    {loading ? <Loader2 className="animate-spin" /> : (
                                        <span className="relative z-10 flex items-center gap-2">
                                            Request Secure Token
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                                <div className={`flex flex-col items-center gap-6 p-10 rounded-[40px] border shadow-[inset_0_2px_20px_rgba(0,0,0,0.02)] ${theme === 'dark' ? 'bg-stone-800/20 border-stone-800' : 'bg-stone-50/50 border-stone-100'
                                    }`}>
                                    <div className="w-16 h-16 bg-brand-500/10 rounded-[22px] flex items-center justify-center text-brand-500 animate-bounce-slow">
                                        <KeyRound size={32} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="0000"
                                        value={otp}
                                        onChange={e => setOtp(e.target.value)}
                                        className="bg-transparent outline-none w-full font-black tracking-[0.5em] text-center text-5xl text-brand-600 dark:text-brand-500 placeholder:text-stone-200 dark:placeholder:text-stone-800 transition-colors"
                                        maxLength={4}
                                        autoFocus
                                    />
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">
                                            Check your authorized device
                                        </p>
                                        <div className="flex gap-1.5">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className={`h-1.5 w-8 rounded-full transition-all duration-500 ${otp.length >= i ? 'bg-brand-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-stone-200 dark:bg-stone-800'}`}></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleVerify}
                                    disabled={loading}
                                    className="w-full h-16 bg-brand-600 text-white rounded-[26px] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {loading ? <Loader2 className="animate-spin mx-auto" /> : (
                                            <>
                                                Verify Identity
                                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </span>
                                </button>
                                <button
                                    onClick={() => setStep(1)}
                                    className="w-full text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] hover:text-brand-500 transition-colors py-2 group flex items-center justify-center gap-1"
                                >
                                    <span>Wrong number?</span>
                                    <span className="group-hover:translate-x-0.5 transition-transform">Edit Identity</span>
                                </button>
                            </div>
                        )}

                        <div className="pt-10 mt-2 border-t border-stone-100 dark:border-stone-800/50 text-center relative">
                            <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 transition-colors ${theme === 'dark' ? 'bg-[#151311]' : 'bg-white'}`}>
                                <span className="text-[9px] font-black text-stone-300 dark:text-stone-600 uppercase tracking-[0.3em]">Evaluation Only</span>
                            </div>
                            <button
                                onClick={() => login({
                                    id: 999,
                                    name: "Demo Vendor",
                                    phoneNumber: "9999999999",
                                    role: "VENDOR",
                                    shopName: "Apna khana",
                                    block: "Block 34"
                                })}
                                className="group relative px-8 py-3 rounded-full text-[11px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.2em] hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-300 overflow-hidden"
                            >
                                <span className="relative z-10">Bypass for Quick Demo</span>
                                <div className="absolute inset-0 bg-brand-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default LoginPage;
