import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Store, Loader2, Star, Clock, ChevronRight, Sparkles, MapPin, UtensilsCrossed } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

// Color palette for vendor cards — cycles through these
const CARD_ACCENTS = [
    { bg: 'from-orange-500 to-amber-500', light: 'bg-orange-50', iconBg: 'bg-orange-100 text-orange-600', darkIconBg: 'bg-orange-900/30 text-orange-400', badge: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
    { bg: 'from-blue-500 to-indigo-500', light: 'bg-blue-50', iconBg: 'bg-blue-100 text-blue-600', darkIconBg: 'bg-blue-900/30 text-blue-400', badge: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { bg: 'from-emerald-500 to-teal-500', light: 'bg-emerald-50', iconBg: 'bg-emerald-100 text-emerald-600', darkIconBg: 'bg-emerald-900/30 text-emerald-400', badge: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { bg: 'from-purple-500 to-violet-500', light: 'bg-purple-50', iconBg: 'bg-purple-100 text-purple-600', darkIconBg: 'bg-purple-900/30 text-purple-400', badge: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
    { bg: 'from-rose-500 to-pink-500', light: 'bg-rose-50', iconBg: 'bg-rose-100 text-rose-600', darkIconBg: 'bg-rose-900/30 text-rose-400', badge: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' },
];

const LocationPage = () => {
    const { locId } = useParams();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [stalls, setStalls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStalls = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:9999'}/users?role=VENDOR&block=${encodeURIComponent(locId)}`);
                setStalls(res.data);
            } catch (error) {
                console.error("Failed to fetch stalls", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStalls();
    }, [locId]);

    return (
        <div
            className="pb-32 min-h-screen transition-colors duration-300"
            style={{ backgroundColor: theme === 'dark' ? '#1c1917' : '#fafaf9' }}
        >
            {/* ── Premium Header ── */}
            <div className={`relative overflow-hidden px-6 pt-6 pb-8 ${theme === 'dark' ? '' : ''}`}>
                {/* Decorative gradient blob */}
                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-[0.07] bg-gradient-to-br from-brand-500 to-orange-500 blur-3xl"></div>

                <header className="flex items-center gap-4 mb-2 relative z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center active:scale-95 transition-all ${theme === 'dark'
                            ? 'bg-stone-800 text-stone-300 border border-stone-700 hover:bg-stone-700'
                            : 'bg-white text-stone-600 shadow-sm border border-stone-100 hover:shadow-md'
                            }`}
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                            <MapPin size={10} className="text-brand-500" />
                            <p className="text-brand-500 text-[10px] font-black uppercase tracking-widest">Food Court</p>
                        </div>
                        <h1 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>{locId}</h1>
                    </div>
                    <div className={`px-3 py-1.5 rounded-xl text-xs font-black ${theme === 'dark' ? 'bg-stone-800 text-stone-400 border border-stone-700' : 'bg-white text-stone-500 shadow-sm border border-stone-100'}`}>
                        {stalls.length} {stalls.length === 1 ? 'Shop' : 'Shops'}
                    </div>
                </header>
            </div>

            <div className="px-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-stone-800' : 'bg-white shadow-sm'}`}>
                            <Loader2 className="animate-spin text-brand-500" size={28} />
                        </div>
                        <p className={`text-xs font-bold ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Finding restaurants...</p>
                    </div>
                ) : (
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {stalls.map((stall, index) => {
                            const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
                            const initials = (stall.shopName || 'S').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

                            return (
                                <Link
                                    key={stall.id}
                                    to={`/menu/${encodeURIComponent(locId)}/${encodeURIComponent(stall.shopName)}`}
                                    className={`group relative overflow-hidden rounded-[24px] border transition-all duration-300 active:scale-[0.97] ${theme === 'dark'
                                        ? 'bg-stone-900 border-stone-800 hover:border-stone-700'
                                        : 'bg-white border-stone-100 shadow-sm hover:shadow-xl hover:border-stone-200'
                                        }`}
                                >
                                    {/* Gradient accent strip at top */}
                                    <div className={`h-1.5 bg-gradient-to-r ${accent.bg} opacity-80`}></div>

                                    {/* Decorative background watermark */}
                                    <div className="absolute -right-6 -bottom-6 opacity-[0.03]">
                                        <UtensilsCrossed size={120} strokeWidth={1} />
                                    </div>

                                    <div className="p-5 flex items-center gap-4 relative z-10">
                                        {/* Avatar with initials */}
                                        <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${accent.bg} flex items-center justify-center shadow-lg flex-shrink-0`}
                                            style={{ boxShadow: `0 8px 24px -8px rgba(0,0,0,0.15)` }}
                                        >
                                            <span className="text-white font-black text-lg">{initials}</span>
                                            {/* Online indicator */}
                                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-stone-900"></div>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-[17px] font-black leading-tight mb-1 truncate ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                                {stall.shopName || "Unnamed Shop"}
                                            </h3>
                                            <p className={`text-xs font-bold mb-2 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                                                by {stall.name || "Vendor"}
                                            </p>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black ${theme === 'dark' ? accent.darkIconBg : accent.iconBg}`}>
                                                    <Star size={9} fill="currentColor" /> 4.{3 + (index % 5)}
                                                </span>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${theme === 'dark' ? 'bg-stone-800 text-stone-400' : 'bg-stone-100 text-stone-500'}`}>
                                                    <Clock size={9} /> 15-25 min
                                                </span>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${theme === 'dark' ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-600'}`}>
                                                    <Sparkles size={9} /> New
                                                </span>
                                            </div>
                                        </div>

                                        {/* Chevron */}
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all group-hover:translate-x-0.5 ${theme === 'dark' ? 'bg-stone-800 text-stone-500' : 'bg-stone-100 text-stone-400'}`}>
                                            <ChevronRight size={16} />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {!loading && stalls.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className={`p-6 rounded-3xl ${theme === 'dark' ? 'bg-stone-800 text-stone-600' : 'bg-white text-stone-300 shadow-sm'}`}>
                            <Store size={40} />
                        </div>
                        <p className={`font-black text-sm ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>No active stalls here</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-stone-600' : 'text-stone-400'}`}>Check back later for new openings!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LocationPage;
