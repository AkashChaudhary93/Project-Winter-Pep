import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Clock, CheckCircle2, ChevronRight, Package, UtensilsCrossed, ChefHat, ShoppingBag, XCircle, Flame, Receipt, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = (import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:9999'}`);

const STATUS_CONFIG = {
    PENDING: {
        label: 'Pending',
        emoji: '⏳',
        lightBg: 'bg-gradient-to-r from-orange-50 to-amber-50',
        lightText: 'text-orange-600',
        lightBorder: 'border-orange-100',
        darkBg: 'bg-orange-900/20',
        darkText: 'text-orange-400',
        darkBorder: 'border-orange-800/30',
        badgeLight: 'bg-orange-100 text-orange-700 border-orange-200',
        badgeDark: 'bg-orange-900/30 text-orange-400 border-orange-700/50',
        accentLight: 'from-orange-400 to-amber-400',
        accentDark: 'from-orange-500 to-amber-500',
        icon: Clock,
    },
    ACCEPTED: {
        label: 'Accepted',
        emoji: '👍',
        lightBg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
        lightText: 'text-blue-600',
        lightBorder: 'border-blue-100',
        darkBg: 'bg-blue-900/20',
        darkText: 'text-blue-400',
        darkBorder: 'border-blue-800/30',
        badgeLight: 'bg-blue-100 text-blue-700 border-blue-200',
        badgeDark: 'bg-blue-900/30 text-blue-400 border-blue-700/50',
        accentLight: 'from-blue-400 to-indigo-400',
        accentDark: 'from-blue-500 to-indigo-500',
        icon: CheckCircle2,
    },
    COOKING: {
        label: 'Cooking',
        emoji: '🔥',
        lightBg: 'bg-gradient-to-r from-blue-50 to-violet-50',
        lightText: 'text-blue-600',
        lightBorder: 'border-blue-100',
        darkBg: 'bg-blue-900/20',
        darkText: 'text-blue-400',
        darkBorder: 'border-blue-800/30',
        badgeLight: 'bg-blue-100 text-blue-700 border-blue-200',
        badgeDark: 'bg-blue-900/30 text-blue-400 border-blue-700/50',
        accentLight: 'from-blue-400 to-violet-400',
        accentDark: 'from-blue-500 to-violet-500',
        icon: ChefHat,
    },
    READY: {
        label: 'Ready',
        emoji: '✅',
        lightBg: 'bg-gradient-to-r from-green-50 to-emerald-50',
        lightText: 'text-green-600',
        lightBorder: 'border-green-100',
        darkBg: 'bg-green-900/20',
        darkText: 'text-green-400',
        darkBorder: 'border-green-800/30',
        badgeLight: 'bg-green-100 text-green-700 border-green-200',
        badgeDark: 'bg-green-900/30 text-green-400 border-green-700/50',
        accentLight: 'from-green-400 to-emerald-400',
        accentDark: 'from-green-500 to-emerald-500',
        icon: ShoppingBag,
    },
    COMPLETED: {
        label: 'Completed',
        emoji: '🎉',
        lightBg: 'bg-gradient-to-r from-stone-50 to-stone-50',
        lightText: 'text-stone-500',
        lightBorder: 'border-stone-100',
        darkBg: 'bg-stone-800/50',
        darkText: 'text-stone-400',
        darkBorder: 'border-stone-700',
        badgeLight: 'bg-stone-100 text-stone-500 border-stone-200',
        badgeDark: 'bg-stone-800 text-stone-400 border-stone-700',
        accentLight: 'from-stone-300 to-stone-400',
        accentDark: 'from-stone-600 to-stone-700',
        icon: CheckCircle2,
    },
    REJECTED: {
        label: 'Rejected',
        emoji: '❌',
        lightBg: 'bg-gradient-to-r from-red-50 to-rose-50',
        lightText: 'text-red-500',
        lightBorder: 'border-red-100',
        darkBg: 'bg-red-900/20',
        darkText: 'text-red-400',
        darkBorder: 'border-red-800/30',
        badgeLight: 'bg-red-100 text-red-600 border-red-200',
        badgeDark: 'bg-red-900/30 text-red-400 border-red-700/50',
        accentLight: 'from-red-400 to-rose-400',
        accentDark: 'from-red-500 to-rose-500',
        icon: XCircle,
    },
};

const FALLBACK_CONFIG = STATUS_CONFIG.COMPLETED;

const OrdersPage = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        if (user) {
            fetchOrders();
            const interval = setInterval(fetchOrders, 3000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchOrders = () => {
        const studentId = user.phoneNumber;
        const altId = user.registrationNumber;
        axios.get(`${API_BASE}/orders/my-orders?studentId=${studentId}&altId=${altId}`)
            .then(res => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const activeOrders = orders.filter(o => ['PENDING', 'ACCEPTED', 'COOKING', 'READY'].includes(o.status));
    const pastOrders = orders.filter(o => ['COMPLETED', 'REJECTED'].includes(o.status));

    const filteredOrders = activeFilter === 'active' ? activeOrders
        : activeFilter === 'past' ? pastOrders
            : orders;

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diff = now - d;
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);

        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatTime = (dateStr) => {
        return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ backgroundColor: theme === 'dark' ? '#1c1917' : '#fafaf9' }}>
            <div className={`p-5 rounded-3xl ${theme === 'dark' ? 'bg-stone-800' : 'bg-white shadow-lg'}`}>
                <Receipt className="animate-pulse text-brand-500" size={32} />
            </div>
            <p className={`font-black text-sm ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>Loading orders...</p>
        </div>
    );

    return (
        <div
            className="pb-32 min-h-screen transition-colors duration-300"
            style={{ backgroundColor: theme === 'dark' ? '#1c1917' : '#fafaf9' }}
        >
            {/* ── Header ── */}
            <div className="px-6 pt-8 pb-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className={`text-4xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>My Orders</h1>
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                            ID: <span className="font-mono bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">{user?.phoneNumber || 'Unknown'}</span>
                        </p>
                    </div>

                    {/* Filter Tabs - Segmented Control Style */}
                    <div className={`flex p-1.5 rounded-2xl ${theme === 'dark' ? 'bg-stone-900 border border-stone-800' : 'bg-white border border-stone-200 shadow-sm'}`}>
                        {[
                            { key: 'all', label: 'All Orders' },
                            { key: 'active', label: 'Active', count: activeOrders.length },
                            { key: 'past', label: 'History' },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveFilter(tab.key)}
                                className={`relative px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeFilter === tab.key
                                    ? (theme === 'dark'
                                        ? 'bg-stone-800 text-white shadow-md'
                                        : 'bg-brand-500 text-white shadow-lg shadow-brand-500/20')
                                    : (theme === 'dark' ? 'text-stone-500 hover:bg-stone-800/50' : 'text-stone-400 hover:bg-stone-50')
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    {tab.label}
                                    {tab.count > 0 && (
                                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeFilter === tab.key
                                            ? 'bg-white/20 text-white'
                                            : (theme === 'dark' ? 'bg-stone-800 text-stone-400' : 'bg-stone-100 text-stone-500')
                                            }`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Active Orders Alert ── */}
                {activeFilter !== 'past' && activeOrders.length > 0 && (
                    <div className={`mb-8 p-1 rounded-3xl bg-gradient-to-r from-brand-500 via-orange-500 to-amber-500`}>
                        <div className={`px-6 py-4 rounded-[20px] flex items-center justify-between ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-brand-500 rounded-full animate-ping opacity-20"></div>
                                    <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white">
                                        <Flame size={20} className="animate-pulse" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                        {activeOrders.length} Order{activeOrders.length > 1 ? 's' : ''} in Progress
                                    </h3>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                                        Track {activeOrders.length > 1 ? 'them' : 'it'} in real-time
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveFilter('active')}
                                className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                            >
                                View
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Orders List ── */}
                <div className="min-h-[400px]">
                    {filteredOrders.length === 0 ? (
                        <div className={`flex flex-col items-center justify-center py-20 rounded-[32px] border-2 border-dashed ${theme === 'dark' ? 'border-stone-800 bg-stone-900/30' : 'border-stone-200 bg-stone-50/50'}`}>
                            <div className={`p-8 rounded-[32px] mb-6 transform rotate-3 hover:rotate-6 transition-transform ${theme === 'dark' ? 'bg-stone-800 text-stone-600' : 'bg-white text-stone-300 shadow-xl'}`}>
                                <Package size={56} strokeWidth={1.5} />
                            </div>
                            <h2 className={`font-black text-xl mb-2 ${theme === 'dark' ? 'text-stone-400' : 'text-stone-900'}`}>
                                {activeFilter === 'active' ? 'No active orders' : activeFilter === 'past' ? 'No past orders' : 'No orders found'}
                            </h2>
                            <p className={`text-sm mb-8 font-medium ${theme === 'dark' ? 'text-stone-600' : 'text-stone-400'}`}>
                                {activeFilter === 'active' ? 'Your active orders will show here' : 'Hungry? Browse our menu!'}
                            </p>
                            <Link
                                to="/home"
                                className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-brand-500 text-white text-sm font-black shadow-xl shadow-brand-500/20 hover:bg-brand-600 hover:scale-105 transition-all active:scale-95"
                            >
                                Browse Menu <ArrowRight size={16} />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredOrders.map((order, i) => {
                                const config = STATUS_CONFIG[order.status] || FALLBACK_CONFIG;
                                const StatusIcon = config.icon;
                                const isActive = ['PENDING', 'ACCEPTED', 'COOKING', 'READY'].includes(order.status);

                                return (
                                    <Link
                                        key={order.id}
                                        to={`/track/${order.id}`}
                                        className={`group relative overflow-hidden rounded-[32px] border transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl flex flex-col ${theme === 'dark'
                                            ? `bg-stone-900 ${config.darkBorder} hover:shadow-black/50`
                                            : `bg-white border-stone-100 shadow-lg shadow-stone-200/50`
                                            }`}
                                        style={{ animationDelay: `${i * 50}ms` }}
                                    >
                                        {/* Status Strip */}
                                        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${theme === 'dark' ? config.accentDark : config.accentLight} opacity-80`}></div>

                                        <div className="p-6 flex-1 flex flex-col">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${theme === 'dark' ? config.darkBg : config.lightBg}`}>
                                                        {config.emoji}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className={`font-black text-base ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                                                #{String(order.id).slice(-6)}
                                                            </p>
                                                            {isActive && (
                                                                <span className="relative flex h-2 w-2">
                                                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme === 'dark' ? 'bg-green-400' : 'bg-green-500'}`}></span>
                                                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${theme === 'dark' ? 'bg-green-500' : 'bg-green-500'}`}></span>
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className={`text-xs font-bold ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                                                            {formatDate(order.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${theme === 'dark' ? config.badgeDark : config.badgeLight}`}>
                                                    <StatusIcon size={12} />
                                                    {config.label}
                                                </div>
                                            </div>

                                            {/* Items Preview */}
                                            <div className={`flex-1 rounded-2xl p-4 mb-6 ${theme === 'dark' ? 'bg-stone-800/40' : 'bg-stone-50'}`}>
                                                <div className="space-y-3">
                                                    {order.items.slice(0, 3).map((item, index) => (
                                                        <div key={index} className="flex items-start justify-between gap-4">
                                                            <div className="flex items-start gap-2.5 overflow-hidden">
                                                                <span className={`flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-black ${theme === 'dark'
                                                                    ? 'bg-stone-700 text-stone-300'
                                                                    : 'bg-white text-stone-600 shadow-sm'
                                                                    }`}>
                                                                    {item.quantity}
                                                                </span>
                                                                <span className={`text-xs font-bold truncate ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'}`}>
                                                                    {item.menuItem.name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {order.items.length > 3 && (
                                                        <p className={`text-[10px] font-bold pl-8 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                                                            + {order.items.length - 3} more items
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Footer */}
                                            <div className={`pt-4 border-t flex items-center justify-between ${theme === 'dark' ? 'border-stone-800' : 'border-stone-100'}`}>
                                                <div>
                                                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Total</p>
                                                    <p className={`font-black text-lg ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                                        ₹{order.totalAmount}
                                                    </p>
                                                </div>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all group-hover:bg-brand-500 group-hover:text-white ${theme === 'dark' ? 'bg-stone-800 text-stone-500' : 'bg-stone-100 text-stone-400'}`}>
                                                    <ArrowRight size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;
