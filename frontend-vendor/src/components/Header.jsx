import React, { useState } from 'react';
import { Bell, ChefHat, Moon, Sun, Power, ShoppingBag, User, Settings, LogOut, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Header = ({ activeOrderCount, isShopOpen, onToggleShop, onNavigate, notifications, setNotifications }) => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <header className={`sticky top-0 z-[100] border-b backdrop-blur-xl transition-all duration-500 ${theme === 'dark' ? 'bg-stone-900/80 border-stone-800' : 'bg-white/90 border-stone-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]'
            }`}>
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* ── Brand Logo ── */}
                <div
                    onClick={() => onNavigate('live')}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <div className="relative">
                        <div className="w-11 h-11 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                            <ChefHat size={26} />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white dark:border-stone-900 flex items-center justify-center">
                            <Sparkles size={8} className="text-white" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h1 className={`text-xl font-black leading-none tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                            CampusCrave
                        </h1>
                        <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest mt-0.5">
                            Partner Dashboard
                        </span>
                    </div>
                </div>

                {/* ── Action Center ── */}
                <div className="flex items-center gap-3 lg:gap-5">

                    {/* Shop Status Pill */}
                    <div className={`hidden sm:flex items-center gap-2 p-1 rounded-full border transition-all duration-500 ${isShopOpen
                            ? (theme === 'dark' ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-100')
                            : (theme === 'dark' ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-100')
                        }`}>
                        <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 transition-all ${isShopOpen ? 'text-green-600' : 'text-red-600'
                            }`}>
                            <div className={`w-2 h-2 rounded-full animate-pulse ${isShopOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {isShopOpen ? 'Active' : 'Closed'}
                            </span>
                        </div>
                        <button
                            onClick={onToggleShop}
                            className={`p-1.5 rounded-full transition-all active:scale-95 ${isShopOpen
                                    ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
                                    : 'bg-red-600 text-white shadow-lg shadow-red-500/20'
                                }`}
                        >
                            <Power size={14} />
                        </button>
                    </div>

                    <div className={`w-px h-6 hidden lg:block ${theme === 'dark' ? 'bg-stone-800' : 'bg-stone-100'}`}></div>

                    {/* Utils Group */}
                    <div className="flex items-center gap-2">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 hover:rotate-12 ${theme === 'dark' ? 'bg-stone-800 text-stone-300 hover:bg-stone-700' : 'bg-stone-50 text-stone-600 hover:bg-white hover:shadow-md'
                                }`}
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
                                className={`relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-stone-800 text-stone-300 hover:bg-stone-700' : 'bg-stone-50 text-stone-600 hover:bg-white hover:shadow-md'
                                    }`}
                            >
                                <Bell size={20} />
                                {notifications.length > 0 && (
                                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-stone-900 rounded-full"></span>
                                )}
                            </button>

                            {/* Dropdown Redesigned */}
                            {isNotifOpen && (
                                <div className={`absolute top-14 right-0 w-80 rounded-[32px] border shadow-2xl overflow-hidden z-[110] animate-in fade-in slide-in-from-top-4 duration-300 ${theme === 'dark' ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-100'
                                    }`}>
                                    <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
                                        <h3 className={`font-black text-sm uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                            Inbox
                                        </h3>
                                        <button
                                            onClick={() => setNotifications([])}
                                            className="text-[10px] font-black text-brand-500 uppercase tracking-widest hover:underline"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                    <div className="max-h-[360px] overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="py-12 text-center">
                                                <div className="w-16 h-16 bg-stone-50 dark:bg-stone-800 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                                    <Bell size={24} className="text-stone-300" />
                                                </div>
                                                <p className="text-xs font-bold text-stone-400">All caught up!</p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-stone-50 dark:divide-stone-800">
                                                {notifications.map(n => (
                                                    <div key={n.id} className="p-5 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors flex gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                                                            <ShoppingBag size={18} />
                                                        </div>
                                                        <div>
                                                            <p className={`text-xs font-bold leading-relaxed ${theme === 'dark' ? 'text-stone-300' : 'text-stone-800'}`}>
                                                                {n.text}
                                                            </p>
                                                            <span className="text-[10px] font-medium text-stone-400 mt-1 block uppercase">
                                                                {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Menu */}
                        <div className="relative">
                            <button
                                onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
                                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-stone-800 text-brand-500' : 'bg-brand-50 text-brand-600'
                                    }`}
                            >
                                <User size={20} />
                            </button>

                            {isProfileOpen && (
                                <div className={`absolute top-14 right-0 w-64 rounded-[32px] border shadow-2xl p-2 z-[110] animate-in fade-in slide-in-from-top-4 duration-300 ${theme === 'dark' ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-100'
                                    }`}>
                                    <div className="p-4 border-b border-stone-50 dark:border-stone-800 mb-2">
                                        <p className={`text-sm font-black truncate capitalize ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                            {user?.shopName || 'Vendor'}
                                        </p>
                                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">
                                            {user?.block || 'Campus Partner'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <button
                                            onClick={() => { onNavigate('profile'); setIsProfileOpen(false); }}
                                            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-colors ${theme === 'dark' ? 'text-stone-400 hover:bg-stone-800 hover:text-white' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
                                                }`}
                                        >
                                            <Settings size={18} />
                                            <span className="text-xs font-bold">Manage Stall</span>
                                        </button>
                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center gap-3 p-3 rounded-2xl text-red-500 hover:bg-red-500/10 transition-colors"
                                        >
                                            <LogOut size={18} />
                                            <span className="text-xs font-bold">Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
