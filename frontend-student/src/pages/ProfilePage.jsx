import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    User,
    Phone,
    LogOut,
    Save,
    ChevronLeft,
    Settings,
    ShoppingBag,
    Heart,
    CreditCard,
    MapPin,
    ChevronRight,
    Star,
    Sparkles,
    Hash
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE = 'http://localhost:9999';

const ProfilePage = () => {
    const { user, login, logout } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [name, setName] = useState(user?.name || '');
    const [isEditing, setIsEditing] = useState(false);
    const [stats, setStats] = useState({ orders: 0, spent: 0, rewards: 0 });

    useEffect(() => {
        if (user) {
            const studentId = user.phoneNumber;
            const altId = user.registrationNumber;
            axios.get(`${API_BASE}/orders/my-orders?studentId=${studentId}&altId=${altId}`)
                .then(res => {
                    const myOrders = res.data;
                    const validOrders = myOrders.filter(o => o.status !== 'REJECTED');
                    const spent = validOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);
                    // Reward logic: 5 points for every 100 spent
                    const rewards = Math.floor(spent * 0.05);
                    setStats({
                        orders: validOrders.length,
                        spent: spent,
                        rewards: rewards
                    });
                })
                .catch(err => console.error("Error fetching stats:", err));
        }
    }, [user]);

    const formatSpent = (amount) => {
        if (amount >= 1000) {
            return `₹${(amount / 1000).toFixed(1)}k`;
        }
        return `₹${amount}`;
    };

    const handleSave = () => {
        const updatedUser = { ...user, name };
        login(updatedUser);
        setIsEditing(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { icon: ShoppingBag, label: 'Order History', link: '/orders', color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { icon: Heart, label: 'Your Favorites', link: '#', color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { icon: MapPin, label: 'Address Book', link: '#', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { icon: CreditCard, label: 'Payment Methods', link: '#', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    ];

    return (
        <div
            className="pb-32 min-h-screen relative transition-colors duration-700 overflow-hidden"
            style={{ backgroundColor: theme === 'dark' ? '#0c0a09' : '#fafaf9' }}
        >
            {/* ── Visual Architecture (Mesh Gradients & Blobs) ── */}
            <div className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[130px] opacity-[0.12] animate-pulse bg-gradient-to-br ${theme === 'dark' ? 'from-brand-600 to-indigo-600' : 'from-brand-400 to-violet-400'}`}></div>
            <div className={`absolute bottom-[5%] right-[-5%] w-80 h-80 rounded-full blur-[110px] opacity-[0.08] animate-blob-reverse bg-gradient-to-tr ${theme === 'dark' ? 'from-amber-600 to-orange-600' : 'from-amber-400 to-orange-400'}`}></div>

            {/* ── Elite Header ── */}
            <header className="px-6 pt-12 pb-6 relative z-10 max-w-6xl mx-auto">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate(-1)}
                        className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all active:scale-95 group border backdrop-blur-xl ${theme === 'dark' ? 'bg-stone-900/60 text-white border-stone-800/50 hover:bg-stone-800' : 'bg-white text-stone-900 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border-white hover:shadow-xl'
                            }`}
                    >
                        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className={`text-3xl lg:text-4xl font-black tracking-tight leading-none ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                            My Account
                        </h1>
                        <p className={`text-[11px] font-black uppercase tracking-[0.2em] mt-1.5 ${theme === 'dark' ? 'text-stone-600' : 'text-stone-400'}`}>
                            Profile & Preferences
                        </p>
                    </div>
                    <button
                        className={`ml-auto w-14 h-14 rounded-[22px] flex items-center justify-center transition-all active:scale-95 group border backdrop-blur-xl ${theme === 'dark' ? 'bg-stone-900/60 text-white border-stone-800/50 hover:bg-stone-800' : 'bg-white text-stone-900 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border-white hover:shadow-xl'
                            }`}
                    >
                        <Settings size={24} className="group-hover:rotate-45 transition-transform" />
                    </button>
                </div>
            </header>

            <div className="px-6 py-4 max-w-6xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

                    {/* ── LEFT COLUMN: Profile Card ── */}
                    <div className="lg:col-span-2 lg:sticky lg:top-8">
                        <div className={`relative p-10 lg:p-12 rounded-[48px] overflow-hidden transition-all duration-1000 border group ${theme === 'dark' ? 'bg-stone-900/40 border-stone-800/50 backdrop-blur-2xl' : 'bg-white/80 border-white shadow-[0_40px_80px_rgba(0,0,0,0.04)] backdrop-blur-2xl'
                            }`}>

                            {/* Floating Decorative Elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-500/10 rounded-full blur-[50px] translate-y-1/2 -translate-x-1/2"></div>

                            <div className="flex flex-col items-center text-center relative z-10">
                                {/* Avatar with Layered Glows */}
                                <div className="relative mb-8 group">
                                    <div className={`absolute inset-0 rounded-[48px] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700 bg-gradient-to-br ${theme === 'dark' ? 'from-brand-600 to-violet-600' : 'from-brand-400 to-brand-700'}`}></div>
                                    <div className={`w-28 h-28 lg:w-32 lg:h-32 rounded-[44px] flex items-center justify-center relative z-10 border-4 transition-all duration-700 group-hover:scale-105 group-hover:-rotate-3 ${theme === 'dark'
                                        ? 'bg-stone-900 border-stone-800 text-white shadow-2xl'
                                        : 'bg-white border-white text-brand-600 shadow-2xl'
                                        }`}>
                                        <span className="text-5xl font-black uppercase tracking-tighter">
                                            {user?.name?.charAt(0) || <User size={56} />}
                                        </span>
                                    </div>
                                    <div className={`absolute -bottom-3 -right-3 w-11 h-11 rounded-[18px] border-4 flex items-center justify-center transition-transform hover:scale-110 duration-500 z-20 ${theme === 'dark' ? 'bg-stone-950 border-stone-900 text-brand-400' : 'bg-brand-500 border-white text-white shadow-lg'}`}>
                                        <Sparkles size={18} className="animate-pulse" />
                                    </div>
                                </div>

                                <div className="w-full mb-8">
                                    {isEditing ? (
                                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
                                            <div className={`relative flex items-center rounded-3xl border-2 transition-all p-2 ${theme === 'dark' ? 'bg-stone-950/50 border-stone-800 focus-within:border-brand-500' : 'bg-stone-50 border-stone-100 focus-within:bg-white focus-within:border-brand-200 focus-within:shadow-xl focus-within:shadow-brand-500/5'
                                                }`}>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={e => setName(e.target.value)}
                                                    className={`w-full bg-transparent px-5 py-3 font-black text-xl text-center outline-none tracking-tight ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}
                                                    placeholder="Your Name"
                                                />
                                            </div>
                                            <button
                                                onClick={handleSave}
                                                className="w-full bg-stone-900 dark:bg-brand-600 text-white py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-brand-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 hover:scale-[1.02]"
                                            >
                                                <Save size={18} /> Save Changes
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <h2 className={`text-4xl lg:text-5xl font-black tracking-tighter leading-none ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                                {user?.name || 'Explorer'}
                                            </h2>
                                            <div className="flex flex-wrap items-center justify-center gap-2">
                                                <div className="px-3 py-1.5 rounded-2xl bg-brand-500/10 text-brand-500 text-[10px] font-black uppercase tracking-[0.2em] border border-brand-500/20 backdrop-blur-sm flex items-center gap-1.5">
                                                    <Star size={11} fill="currentColor" /> Student Elite
                                                </div>
                                                <div className={`px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border backdrop-blur-sm flex items-center gap-1.5 ${theme === 'dark' ? 'bg-stone-800/50 border-stone-700 text-stone-500' : 'bg-stone-50 border-stone-100 text-stone-400'
                                                    }`}>
                                                    <Hash size={11} /> {user?.registrationNumber || '12310625'}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className={`mt-3 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] border transition-all active:scale-95 hover:scale-105 ${theme === 'dark' ? 'bg-stone-800/40 border-stone-700/50 text-stone-500' : 'bg-white border-stone-100 text-stone-400 shadow-sm'
                                                    }`}
                                            >
                                                Customize Profile
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Intelligence Metrics Dashboard */}
                                <div className={`w-full grid grid-cols-3 gap-2 p-7 rounded-[32px] transition-all border ${theme === 'dark' ? 'bg-stone-950/40 border-stone-800/30' : 'bg-stone-50 border-stone-100/50'}`}>
                                    <div className="text-center min-w-0 group-hover:scale-105 transition-transform duration-500">
                                        <p className="text-lg font-black text-brand-500 mb-1.5 leading-none whitespace-nowrap">{stats.orders}</p>
                                        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-stone-500">Orders</p>
                                    </div>
                                    <div className={`border-x px-2 text-center min-w-0 group-hover:scale-105 transition-transform duration-500 delay-75 ${theme === 'dark' ? 'border-stone-800' : 'border-stone-200'}`}>
                                        <p className={`text-lg font-black mb-1.5 leading-none whitespace-nowrap ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>{formatSpent(stats.spent)}</p>
                                        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-stone-500">Spent</p>
                                    </div>
                                    <div className="text-center min-w-0 group-hover:scale-105 transition-transform duration-500 delay-150">
                                        <p className="text-lg font-black text-amber-500 mb-1.5 leading-none whitespace-nowrap">{stats.rewards}</p>
                                        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-stone-500">Reward</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT COLUMN: Connection, Menu & Actions ── */}
                    <div className="lg:col-span-3 space-y-8">

                        {/* ── Verified Connection Card ── */}
                        <div className={`p-7 rounded-[40px] flex items-center gap-5 border backdrop-blur-xl transition-all hover:scale-[1.01] ${theme === 'dark' ? 'bg-stone-900/40 border-stone-800/50' : 'bg-white/80 border-white shadow-[0_20px_50px_rgba(0,0,0,0.03)]'
                            }`}>
                            <div className={`w-13 h-13 rounded-[20px] flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-stone-800 text-brand-400' : 'bg-brand-50 text-brand-500'
                                }`}>
                                <Phone size={22} />
                            </div>
                            <div>
                                <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-1 ${theme === 'dark' ? 'text-stone-600' : 'text-stone-400'}`}>Verified Connection</p>
                                <p className={`text-base font-black tracking-tight ${theme === 'dark' ? 'text-stone-200' : 'text-stone-800'}`}>{user?.phoneNumber || '+91 9368644199'}</p>
                            </div>
                            <div className={`ml-auto px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${theme === 'dark' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-600 border-green-100'
                                }`}>
                                Active
                            </div>
                        </div>

                        {/* ── Settings Intelligence Menu ── */}
                        <div className={`rounded-[40px] overflow-hidden border transition-all ${theme === 'dark' ? 'bg-stone-800/20 border-stone-800/50 shadow-inner' : 'bg-white border-white shadow-sm'
                            }`}>
                            {menuItems.map((item, idx) => (
                                <Link
                                    key={idx}
                                    to={item.link}
                                    className={`flex items-center gap-5 p-6 transition-all group ${idx !== menuItems.length - 1 ? (theme === 'dark' ? 'border-b border-stone-800/50' : 'border-b border-stone-100/50') : ''
                                        } ${theme === 'dark' ? 'hover:bg-brand-500/5' : 'hover:bg-brand-50/30'}`}
                                >
                                    <div className={`w-11 h-11 rounded-[16px] flex items-center justify-center transition-all group-active:scale-95 group-hover:rotate-6 ${item.bg} ${item.color} shadow-sm group-hover:shadow-md`}>
                                        <item.icon size={20} className="group-hover:scale-110 transition-transform" />
                                    </div>
                                    <span className={`font-black text-sm tracking-tight transition-colors ${theme === 'dark' ? 'text-stone-300 group-hover:text-white' : 'text-stone-700 group-hover:text-stone-900'}`}>
                                        {item.label}
                                    </span>
                                    <ChevronRight size={18} className={`ml-auto transition-all duration-300 group-hover:translate-x-2 ${theme === 'dark' ? 'text-stone-700 group-hover:text-brand-500' : 'text-stone-200 group-hover:text-brand-500'}`} />
                                </Link>
                            ))}
                        </div>

                        {/* ── Quick Stats Cards (Desktop Bonus) ── */}
                        <div className="hidden lg:grid grid-cols-2 gap-5">
                            <div className={`p-7 rounded-[32px] border transition-all hover:shadow-xl ${theme === 'dark' ? 'bg-stone-900/40 border-stone-800' : 'bg-white/80 border-white shadow-sm'}`}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-violet-500/10 text-violet-500 rounded-[14px] flex items-center justify-center">
                                        <Star size={20} />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Loyalty Tier</span>
                                </div>
                                <p className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>Elite Member</p>
                                <p className={`text-[10px] font-bold mt-1 ${theme === 'dark' ? 'text-stone-600' : 'text-stone-400'}`}>Top 5% of all students</p>
                            </div>
                            <div className={`p-7 rounded-[32px] border transition-all hover:shadow-xl ${theme === 'dark' ? 'bg-stone-900/40 border-stone-800' : 'bg-white/80 border-white shadow-sm'}`}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-[14px] flex items-center justify-center">
                                        <Sparkles size={20} />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Rewards</span>
                                </div>
                                <p className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>{stats.rewards} Points</p>
                                <p className={`text-[10px] font-bold mt-1 ${theme === 'dark' ? 'text-stone-600' : 'text-stone-400'}`}>Redeem on your next order</p>
                            </div>
                        </div>

                        {/* ── Elite Session Control ── */}
                        <div className="pt-2 pb-10">
                            <button
                                onClick={handleLogout}
                                className={`w-full group relative flex items-center justify-center p-5 rounded-[28px] overflow-hidden transition-all active:scale-[0.98] border-2 ${theme === 'dark'
                                    ? 'bg-stone-900/50 border-red-900/30 text-red-500 hover:bg-red-950/20 hover:border-red-500/50'
                                    : 'bg-red-50/30 border-red-100/50 text-red-500 hover:bg-red-50 hover:border-red-200 shadow-[0_10px_40px_rgba(239,68,68,0.06)]'
                                    }`}
                            >
                                {/* Glow Effect on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:rotate-12 ${theme === 'dark' ? 'bg-red-950/40 text-red-500 border border-red-900' : 'bg-white text-red-500 border border-red-100'}`}>
                                        <LogOut size={20} />
                                    </div>
                                    <span className="uppercase font-black tracking-[0.35em] text-xs">Terminate Session</span>
                                </div>
                            </button>

                            <p className={`text-center mt-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-30 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                CampusCrave v3.0.4-Elite
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
