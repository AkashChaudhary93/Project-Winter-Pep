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
            <div className="max-w-7xl mx-auto px-3 md:px-6 h-16 md:h-20 flex items-center justify-between">

                {/* ── Brand Logo ── */}
                <div
                    onClick={() => onNavigate('live')}
                    className="flex items-center gap-2 md:gap-3 cursor-pointer group"
                >
                    <div className="relative">
                        <div className="w-9 h-9 md:w-11 md:h-11 bg-brand-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                            <ChefHat size={26} className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-amber-400 rounded-full border-2 border-white dark:border-stone-900 flex items-center justify-center">
                            <Sparkles size={8} className="text-white w-2 h-2 md:w-2.5 md:h-2.5" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h1 className={`text-lg md:text-xl font-black leading-none tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                            CampusCrave
                        </h1>
                        <span className="text-[8px] md:text-[10px] font-black text-brand-500 uppercase tracking-widest mt-0.5">
                            Partner Dashboard
                        </span>
                    </div>
                </div>

                {/* ── Action Center ── */}
                <div className="flex items-center gap-1.5 md:gap-3 lg:gap-5">

                    {/* Shop Status Pill */}
                    <div className={`flex items-center gap-1 md:gap-2 p-1 rounded-full border transition-all duration-500 ${isShopOpen
                        ? (theme === 'dark' ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-100')
                        : (theme === 'dark' ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-100')
                        }`}>
                        <div className={`hidden sm:flex px-4 py-1.5 rounded-full items-center gap-2 transition-all ${isShopOpen ? 'text-green-600' : 'text-red-600'
                            }`}>
                            <div className={`w-2 h-2 rounded-full animate-pulse ${isShopOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {isShopOpen ? 'Active' : 'Closed'}
                            </span>
                        </div>
                        {/* Mobile dot indicator (Only shown when text is hidden on small screens) */}
                        <div className={`flex sm:hidden pl-2 items-center`}>
                            <div className={`w-2 h-2 rounded-full animate-pulse ${isShopOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        </div>

                        <button
                            onClick={onToggleShop}
                            className={`p-1.5 md:p-1.5 rounded-full transition-all active:scale-95 ${isShopOpen
                                ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
                                : 'bg-red-600 text-white shadow-lg shadow-red-500/20 md:mr-0 mr-0.5'
                                }`}
                        >
                            <Power size={14} />
                        </button>
                    </div>

                    <div className={`w-px h-6 hidden lg:block ${theme === 'dark' ? 'bg-stone-800' : 'bg-stone-100'}`}></div>

                    {/* Utils Group */}
                    <div className="flex items-center gap-1 md:gap-2">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300 hover:rotate-12 ${theme === 'dark' ? 'bg-stone-800 text-stone-300 hover:bg-stone-700' : 'bg-stone-50 text-stone-600 hover:bg-white hover:shadow-md'
                                }`}
                        >
                            {theme === 'dark' ? <Sun size={20} className="w-[18px] h-[18px] md:w-5 md:h-5" /> : <Moon size={20} className="w-[18px] h-[18px] md:w-5 md:h-5" />}
                        </button>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
                                className={`relative w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-stone-800 text-stone-300 hover:bg-stone-700' : 'bg-stone-50 text-stone-600 hover:bg-white hover:shadow-md'
                                    }`}
                            >
                                <Bell size={20} className="w-[18px] h-[18px] md:w-5 md:h-5" />
                                {notifications.length > 0 && (
                                    <span className="absolute top-1.5 md:top-2 right-1.5 md:right-2 w-2 md:w-2.5 h-2 md:h-2.5 bg-red-500 border-2 border-white dark:border-stone-900 rounded-full"></span>
                                )}
                            </button>

                            {/* Dropdown Redesigned */}
                            {isNotifOpen && (
                                <div className={`absolute top-14 right-0 w-[340px] rounded-[28px] border shadow-2xl overflow-hidden z-[110] animate-in fade-in slide-in-from-top-4 duration-300 ${theme === 'dark' ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-100'
                                    }`}>
                                    {/* Gradient accent bar */}
                                    <div className="h-1 w-full bg-gradient-to-r from-brand-500 via-amber-400 to-brand-500"></div>

                                    <div className={`px-6 py-4 flex items-center justify-between ${theme === 'dark' ? 'border-b border-stone-800' : 'border-b border-stone-100'}`}>
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-brand-500/10 text-brand-400' : 'bg-brand-50 text-brand-500'}`}>
                                                <Bell size={16} />
                                            </div>
                                            <div>
                                                <h3 className={`font-black text-sm tracking-tight ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                                    Notifications
                                                </h3>
                                                {notifications.length > 0 && (
                                                    <p className="text-[10px] font-bold text-brand-500">{notifications.length} new</p>
                                                )}
                                            </div>
                                        </div>
                                        {notifications.length > 0 && (
                                            <button
                                                onClick={() => setNotifications([])}
                                                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all active:scale-95 ${theme === 'dark' ? 'text-stone-500 hover:text-red-400 hover:bg-red-500/10' : 'text-stone-400 hover:text-red-500 hover:bg-red-50'}`}
                                            >
                                                Clear all
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-[340px] overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                        {notifications.length === 0 ? (
                                            <div className="py-14 text-center">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 ${theme === 'dark' ? 'bg-stone-800 text-stone-600' : 'bg-stone-50 text-stone-300'}`}>
                                                    <Bell size={24} />
                                                </div>
                                                <p className={`text-sm font-black ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>All caught up!</p>
                                                <p className={`text-[10px] font-medium mt-1 italic ${theme === 'dark' ? 'text-stone-600' : 'text-stone-300'}`}>No new notifications</p>
                                            </div>
                                        ) : (
                                            <div className="p-2">
                                                {notifications.map(n => (
                                                    <div key={n.id} className={`flex gap-3.5 p-3.5 rounded-2xl mb-1 transition-all duration-200 group cursor-default ${theme === 'dark' ? 'hover:bg-stone-800/70' : 'hover:bg-stone-50'}`}>
                                                        <div className="relative flex-shrink-0">
                                                            <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center transition-transform group-hover:scale-110 ${theme === 'dark' ? 'bg-brand-500/15 text-brand-400' : 'bg-gradient-to-br from-brand-50 to-amber-50 text-brand-500 shadow-sm'}`}>
                                                                <ShoppingBag size={18} />
                                                            </div>
                                                            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-brand-500 rounded-full border-2 border-white dark:border-stone-900"></div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-[13px] font-bold leading-snug ${theme === 'dark' ? 'text-stone-200' : 'text-stone-800'}`}>
                                                                {n.text}
                                                            </p>
                                                            <span className={`text-[10px] font-bold mt-1 block ${theme === 'dark' ? 'text-stone-600' : 'text-stone-400'}`}>
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
                                className={`w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-stone-800 text-brand-500' : 'bg-brand-50 text-brand-600'
                                    }`}
                            >
                                <User size={20} className="w-[18px] h-[18px] md:w-5 md:h-5" />
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
