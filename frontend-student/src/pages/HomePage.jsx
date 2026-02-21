import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Store, Clock, Sun, Moon, Utensils, Home, ShoppingBag, Coffee, Zap, Building2, GraduationCap, Search, Sparkles, TrendingUp, Users, IceCream, Milk } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const SHOP_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:9999'}/shop`;

const locations = [
    { id: 'Block 34', name: 'Block 34', desc: 'Central Food Court', color: 'from-orange-500 via-red-500 to-rose-500', icon: Utensils, shadow: 'shadow-orange-500/25', popular: true },
    { id: 'Block 33', name: 'Block 33', desc: 'University Food Court', color: 'from-amber-500 via-orange-500 to-red-400', icon: GraduationCap, shadow: 'shadow-amber-500/25', popular: true },
    { id: 'Uni-Mall', name: 'Uni-Mall', desc: 'Food Street', color: 'from-violet-500 via-purple-500 to-fuchsia-500', icon: ShoppingBag, shadow: 'shadow-violet-500/25' },
    { id: 'Block 38', name: 'Block 38', desc: 'Chai & Snacks Hub', color: 'from-orange-400 via-amber-600 to-yellow-500', icon: Coffee, shadow: 'shadow-orange-500/25', popular: true },
    { id: 'Apartment 1', name: 'Apartment 1', desc: 'Amul & Dairy Fresh', color: 'from-blue-400 via-sky-500 to-indigo-500', icon: Milk, shadow: 'shadow-blue-500/25' },
    { id: 'Apartment 2', name: 'Apartment 2', desc: 'Baskin Robbins Haven', color: 'from-pink-400 via-rose-500 to-purple-500', icon: IceCream, shadow: 'shadow-pink-500/25' },
    { id: 'Block 36', name: 'Block 36', desc: 'Momo Mia & More', color: 'from-red-500 via-orange-600 to-yellow-500', icon: Utensils, shadow: 'shadow-red-500/25', popular: true },
    { id: 'M-Block', name: 'M-Block', desc: 'Engineering Canteen', color: 'from-lime-500 via-green-500 to-emerald-500', icon: Zap, shadow: 'shadow-lime-500/25' },
    { id: 'BH7', name: 'BH 7', desc: 'The Boys Hostel Hub', color: 'from-blue-500 via-indigo-500 to-violet-500', icon: Home, shadow: 'shadow-blue-500/25' },
    { id: 'BH 1', name: 'BH 1', desc: 'Boys Hostel 1', color: 'from-sky-500 via-blue-500 to-indigo-500', icon: Building2, shadow: 'shadow-sky-500/25' },
    { id: 'BH 2', name: 'BH 2', desc: 'Boys Hostel 2', color: 'from-cyan-500 via-teal-500 to-green-500', icon: Building2, shadow: 'shadow-cyan-500/25' },
    { id: 'BH 3', name: 'BH 3', desc: 'Boys Hostel 3', color: 'from-teal-500 via-emerald-500 to-green-500', icon: Building2, shadow: 'shadow-teal-500/25' },
    { id: 'GH 1', name: 'GH 1', desc: 'Girls Hostel 1', color: 'from-pink-500 via-rose-500 to-red-400', icon: Home, shadow: 'shadow-pink-500/25' },
    { id: 'GH 2', name: 'GH 2', desc: 'Girls Hostel 2', color: 'from-rose-500 via-pink-500 to-fuchsia-400', icon: Home, shadow: 'shadow-rose-500/25' },
    { id: 'UniHospital', name: 'UniHospital', desc: 'Medical Campus Dining', color: 'from-emerald-500 via-teal-500 to-cyan-500', icon: Coffee, shadow: 'shadow-emerald-500/25' },
];

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:9999'}/orders`;

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', emoji: '🌅' };
    if (hour < 17) return { text: 'Good Afternoon', emoji: '☀️' };
    if (hour < 21) return { text: 'Good Evening', emoji: '🌇' };
    return { text: 'Late Night Craving?', emoji: '🌙' };
};

const HomePage = () => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isShopOpen, setIsShopOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [waitTime, setWaitTime] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const greeting = getGreeting();

    useEffect(() => {
        const fetchStatus = () => {
            axios.get(`${SHOP_URL}/users`)
                .then(res => {
                    const vendors = res.data.filter(u => u.role === 'VENDOR');
                    // Check for either `isOpen` (backend fix) or `open` (default serialization)
                    const isAnyOpen = vendors.some(v => v.isOpen === true || v.open === true);
                    setIsShopOpen(isAnyOpen);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });

            axios.get(`${API_URL}/wait-time`)
                .then(res => setWaitTime(res.data))
                .catch(err => console.error(err));
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    const filteredLocations = locations.filter(loc =>
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ backgroundColor: theme === 'dark' ? '#1c1917' : '#fafaf9' }}>
            <div className={`p-5 rounded-3xl ${theme === 'dark' ? 'bg-stone-800' : 'bg-white shadow-lg'}`}>
                <Utensils className="animate-pulse text-brand-500" size={32} />
            </div>
            <p className={`font-black text-sm ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>Checking kitchen status...</p>
        </div>
    );

    return (
        <div
            className="pb-32 min-h-screen relative transition-colors duration-300"
            style={{ backgroundColor: theme === 'dark' ? '#1c1917' : '#fafaf9' }}
        >
            {/* ── Decorative background blobs ── */}
            <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-brand-500/5 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute top-40 right-0 w-60 h-60 rounded-full bg-violet-500/5 blur-3xl translate-x-1/2 pointer-events-none"></div>

            {/* ── Header ── */}
            <header className="px-6 pt-8 pb-2 relative z-10">
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <p className={`text-xs font-bold mb-1 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                            {greeting.emoji} {greeting.text}
                        </p>
                        <h1 className={`text-3xl font-black leading-tight ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                            Hello, <span className="text-brand-500">{user?.name?.split(' ')[0] || 'Foodie'}!</span>
                        </h1>
                        <p className={`text-sm font-medium mt-1 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                            Where are you eating today?
                        </p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className={`md:hidden w-11 h-11 rounded-2xl flex items-center justify-center active:scale-95 transition-all ${theme === 'dark'
                            ? 'bg-stone-800 text-amber-400 border border-stone-700 hover:bg-stone-700'
                            : 'bg-white text-stone-500 shadow-sm border border-stone-100 hover:shadow-md'
                            }`}
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>

                {/* ── Quick Stats Bar (Mobile Only) ── */}
                <div className={`md:hidden flex items-center gap-3 p-3 rounded-2xl mb-5 ${theme === 'dark' ? 'bg-stone-800/60 border border-stone-800' : 'bg-white/80 border border-stone-100 shadow-sm backdrop-blur-sm'}`}>
                    {waitTime && (
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${waitTime.traffic === 'Busy'
                            ? (theme === 'dark' ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500')
                            : (theme === 'dark' ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-600')
                            }`}>
                            <Clock size={13} />
                            <span className="text-xs font-black">{waitTime.minutes} min wait</span>
                        </div>
                    )}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${isShopOpen
                        ? (theme === 'dark' ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-600')
                        : (theme === 'dark' ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500')
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${isShopOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className="text-xs font-black">{isShopOpen ? 'Open' : 'Closed'}</span>
                    </div>
                    <div className={`ml-auto px-3 py-1.5 rounded-xl text-xs font-black ${theme === 'dark' ? 'bg-stone-700 text-stone-400' : 'bg-stone-50 text-stone-400'}`}>
                        {locations.length} locations
                    </div>
                </div>
            </header>

            <div className="px-6 relative z-10">
                {/* ── Search Bar & Stats Row (Desktop Optimized) ── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="relative w-full md:max-w-xl">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-stone-600' : 'text-stone-400'}`} size={16} />
                        <input
                            type="text"
                            placeholder="Find your food court..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full py-3.5 pl-11 pr-4 rounded-2xl font-bold text-sm outline-none transition-all border-2 ${theme === 'dark'
                                ? 'bg-stone-800 border-stone-800 text-white placeholder-stone-600 focus:border-brand-500/50'
                                : 'bg-white border-white text-stone-900 placeholder-stone-400 shadow-sm focus:border-brand-500/30 focus:shadow-md'
                                }`}
                        />
                    </div>

                    {/* Desktop Stats (Hidden on mobile, moved here on desktop) */}
                    <div className="hidden md:flex items-center gap-2">
                        <div className={`px-4 py-2 rounded-xl text-xs font-black ${theme === 'dark' ? 'bg-stone-800 text-stone-400' : 'bg-white text-stone-400 shadow-sm'}`}>
                            {locations.length} Locations
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black ${isShopOpen
                            ? (theme === 'dark' ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-600')
                            : (theme === 'dark' ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500')
                            }`}>
                            <div className={`w-2 h-2 rounded-full ${isShopOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                            <span>{isShopOpen ? 'Open Now' : 'Closed'}</span>
                        </div>
                    </div>
                </div>

                {/* ── Kitchen Closed Banner (Keep full width) ── */}
                {!isShopOpen && (
                    <div className={`mb-6 p-6 rounded-3xl border-2 border-dashed text-center ${theme === 'dark' ? 'bg-red-950/30 border-red-900/50' : 'bg-red-50 border-red-200'}`}>
                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 ${theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-500'}`}>
                            <Store size={28} />
                        </div>
                        <h2 className={`text-xl font-black mb-1 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>Kitchen is Closed</h2>
                        <p className={`text-sm font-medium mb-4 ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>Not accepting orders right now</p>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black ${theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-white text-red-500 shadow-sm'}`}>
                            <Clock size={13} /> Opens Soon
                        </div>
                    </div>
                )}

                {/* ── Popular Section Label ── */}
                {!searchQuery && (
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <TrendingUp size={14} className="text-brand-500" />
                        <p className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                            Popular Near You
                        </p>
                    </div>
                )}

                {/* ── Location Cards (XL Grid) ── */}
                <div className={`grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${!isShopOpen ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                    {filteredLocations.map((loc, index) => (
                        <Link
                            key={loc.id}
                            to={`/location/${loc.id}`}
                            className={`group relative overflow-hidden rounded-[28px] transition-all duration-500 active:scale-[0.97] hover:-translate-y-1 ${loc.shadow} shadow-xl hover:shadow-2xl`}
                            style={{ height: '200px' }}
                        >
                            {/* Background gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${loc.color} transition-all duration-500`}></div>

                            {/* Glass noise overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10"></div>

                            {/* Decorative circles */}
                            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
                            <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-black/5 rounded-full blur-xl"></div>

                            {/* Large watermark icon */}
                            <div className="absolute -bottom-6 -right-6 opacity-[0.08] text-white transform rotate-12 group-hover:rotate-6 group-hover:scale-110 transition-all duration-700">
                                <loc.icon size={index < 2 ? 160 : 120} strokeWidth={1} />
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                {/* Top row: icon + popular badge */}
                                <div className="flex items-start justify-between">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300 shadow-lg">
                                        <loc.icon size={22} />
                                    </div>
                                    {loc.popular && (
                                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border border-white/10">
                                            <Sparkles size={9} /> Popular
                                        </div>
                                    )}
                                </div>

                                {/* Bottom row: name + arrow */}
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.15em] mb-1 drop-shadow-sm">
                                            {loc.desc}
                                        </p>
                                        <h2 className={`font-black text-white tracking-tight drop-shadow-lg ${index < 2 ? 'text-3xl' : 'text-2xl'}`}>
                                            {loc.name}
                                        </h2>
                                    </div>
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/10 group-hover:bg-white group-hover:text-stone-900 transition-all duration-300 shadow-lg">
                                        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* ── No Results ── */}
                {filteredLocations.length === 0 && (
                    <div className={`flex flex-col items-center justify-center py-16 rounded-3xl border-2 border-dashed ${theme === 'dark' ? 'border-stone-800 bg-stone-900/30' : 'border-stone-200 bg-stone-50/50'}`}>
                        <div className={`p-5 rounded-2xl mb-3 ${theme === 'dark' ? 'bg-stone-800 text-stone-600' : 'bg-white text-stone-300 shadow-sm'}`}>
                            <MapPin size={32} />
                        </div>
                        <p className={`font-black text-sm mb-1 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>No locations found</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-stone-600' : 'text-stone-400'}`}>Try searching for "{searchQuery}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
