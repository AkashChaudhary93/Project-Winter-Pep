import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    IndianRupee,
    ShoppingBag,
    TrendingUp,
    Award,
    BarChart3,
    ArrowUpRight,
    Target,
    Zap,
    Clock,
    Flame,
    PieChart,
    ChevronRight,
    Search
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:9999/orders/stats';

const AnalyticsDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const { user } = useAuth();

    const fetchStats = async () => {
        try {
            const shopName = user?.shopName;
            if (!shopName) return;

            const res = await axios.get(`${API_URL}?stallName=${encodeURIComponent(shopName)}`);
            setStats(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching stats:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.shopName) {
            fetchStats();
        }
    }, [user]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20">
            <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-stone-500 font-bold animate-pulse uppercase tracking-widest text-[10px]">Processing Analytics...</p>
        </div>
    );

    if (!stats) return (
        <div className="p-20 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <PieChart size={32} />
            </div>
            <h3 className="text-xl font-black text-stone-900 dark:text-white">Data Unavailable</h3>
            <p className="text-stone-500 text-sm mt-1">We couldn't retrieve your sales data at this time.</p>
        </div>
    );

    const avgOrderValue = stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(0) : 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* ── Page Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className={`text-3xl font-black tracking-tight flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                        <div className="p-2 bg-brand-500 rounded-xl text-white">
                            <BarChart3 size={24} />
                        </div>
                        Analytics Hub
                    </h2>
                    <p className={`text-sm font-medium mt-1 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                        Real-time performance insights for your kitchen
                    </p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${theme === 'dark' ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-100 shadow-sm'}`}>
                    <Clock size={16} className="text-brand-500" />
                    <span className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                        Updates every 5m
                    </span>
                </div>
            </div>

            {/* ── Primary KPI Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Revenue Card */}
                <div className={`group p-8 rounded-[40px] border relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${theme === 'dark' ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-100 shadow-sm'
                    }`}>
                    {/* Decorative Blob */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/5 rounded-full translate-x-12 -translate-y-12 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                    <div className="flex justify-between items-start mb-10 relative z-10">
                        <div className="w-14 h-14 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center shadow-inner">
                            <IndianRupee size={28} />
                        </div>
                        <div className="flex items-center gap-1 bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                            <TrendingUp size={12} /> +12%
                        </div>
                    </div>

                    <div className="relative z-10">
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                            Total Revenue
                        </p>
                        <h3 className={`text-5xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                            ₹{stats.totalRevenue.toLocaleString()}
                        </h3>
                    </div>
                </div>

                {/* Orders Card */}
                <div className={`group p-8 rounded-[40px] border relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${theme === 'dark' ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-100 shadow-sm'
                    }`}>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/5 rounded-full translate-x-12 -translate-y-12 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                    <div className="flex justify-between items-start mb-10 relative z-10">
                        <div className="w-14 h-14 bg-brand-500/10 text-brand-500 rounded-2xl flex items-center justify-center shadow-inner">
                            <ShoppingBag size={28} />
                        </div>
                        <div className="flex items-center gap-1 bg-brand-500/10 text-brand-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                            <Zap size={12} /> Fast
                        </div>
                    </div>

                    <div className="relative z-10">
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                            Completed Orders
                        </p>
                        <h3 className={`text-5xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                            {stats.totalOrders}
                        </h3>
                    </div>
                </div>

                {/* Best Seller Card */}
                <div className={`group p-8 rounded-[40px] border relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${theme === 'dark' ? 'bg-stone-900 border-stone-800 shadow-none' : 'bg-white border-stone-100 shadow-sm'
                    }`}>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full translate-x-12 -translate-y-12 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                    <div className="flex justify-between items-start mb-10 relative z-10">
                        <div className="w-14 h-14 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center shadow-inner">
                            <Award size={28} />
                        </div>
                        <div className="animate-bounce p-1 bg-amber-500 text-white rounded-full">
                            <Flame size={14} />
                        </div>
                    </div>

                    <div className="relative z-10">
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                            Star of the Menu
                        </p>
                        <h3 className={`text-2xl font-black tracking-tight truncate leading-none capitalize ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                            {stats.topItem}
                        </h3>
                        <p className={`text-[10px] font-bold mt-2 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                            Most ordered item this week
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Detailed Analytics Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Chart */}
                <div className={`col-span-1 lg:col-span-2 rounded-[40px] p-10 relative overflow-hidden transition-all border ${theme === 'dark' ? 'bg-stone-900/40 border-stone-800' : 'bg-white border-stone-100 shadow-xl shadow-stone-200/40'
                    }`}>
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div>
                            <h3 className={`text-xl font-black flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                <TrendingUp size={22} className="text-brand-500" /> Performance Trend
                            </h3>
                            <p className={`text-xs font-medium ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Weekly volume analysis</p>
                        </div>
                        <div className={`flex p-1 rounded-xl ${theme === 'dark' ? 'bg-stone-800' : 'bg-stone-50'}`}>
                            <button className="px-3 py-1.5 rounded-lg bg-stone-900 text-white dark:bg-white dark:text-stone-900 text-[10px] font-black">7D</button>
                            <button className="px-3 py-1.5 rounded-lg text-[10px] font-black text-stone-400">30D</button>
                        </div>
                    </div>

                    <div className="h-48 flex items-end gap-3 relative z-10">
                        {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center group">
                                <div className={`w-full rounded-2xl relative transition-all duration-500 cursor-pointer overflow-hidden ${theme === 'dark' ? 'bg-stone-800' : 'bg-brand-50 hover:bg-brand-100'
                                    }`} style={{ height: `${h}%` }}>
                                    {/* Subtle Gradient Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-t opacity-0 group-hover:opacity-100 transition-opacity ${theme === 'dark' ? 'from-brand-900/30' : 'from-brand-500/20'
                                        }`}></div>

                                    {/* Floating Val */}
                                    <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-[10px] font-black shadow-xl opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:translate-y-0 ${theme === 'dark' ? 'bg-white text-stone-900' : 'bg-stone-900 text-white'
                                        }`}>
                                        {h * 4}
                                    </div>

                                    {/* Indicator Dash */}
                                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                                </div>
                                <span className={`mt-4 text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-stone-600' : 'text-stone-300'}`}>
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Secondary Stats Column */}
                <div className="flex flex-col gap-6">
                    {/* AOV Card */}
                    <div className={`p-8 rounded-[40px] border flex flex-col justify-center relative overflow-hidden ${theme === 'dark' ? 'bg-stone-900 border-stone-800' : 'bg-stone-900 text-white border-stone-900 shadow-xl shadow-stone-300/40'
                        }`}>
                        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                            Avg Order Value
                        </p>
                        <h4 className="text-4xl font-black tracking-tighter">
                            ₹{avgOrderValue}
                        </h4>
                        <div className="flex items-center gap-1 mt-4 text-[10px] font-bold text-brand-400">
                            Healthy growth <ArrowUpRight size={12} />
                        </div>
                    </div>

                    {/* Quick Insight Card */}
                    <div className={`p-8 rounded-[40px] border flex-1 relative overflow-hidden ${theme === 'dark' ? 'bg-brand-500/10 border-brand-500/20' : 'bg-white border-stone-100 shadow-sm'
                        }`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center">
                                <Target size={20} />
                            </div>
                            <h4 className={`text-sm font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-stone-800'}`}>
                                Daily Goal
                            </h4>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Progress</span>
                                <span className={`text-xl font-black ${theme === 'dark' ? 'text-brand-400' : 'text-stone-900'}`}>68%</span>
                            </div>
                            <div className={`h-2.5 w-full rounded-full overflow-hidden ${theme === 'dark' ? 'bg-stone-800' : 'bg-stone-100'}`}>
                                <div className="h-full bg-brand-500 rounded-full" style={{ width: '68%' }}></div>
                            </div>
                            <p className="text-[10px] font-medium text-stone-500 leading-relaxed">
                                You are ₹3,213 away from your daily revenue target. Keep it up!
                            </p>
                        </div>
                    </div>

                    {/* Activity Link */}
                    <button className={`w-full p-6 p-4 rounded-3xl border flex items-center justify-between group transition-all ${theme === 'dark' ? 'bg-stone-900 border-stone-800 hover:border-brand-500/50' : 'bg-white border-stone-100 shadow-sm hover:shadow-lg'
                        }`}>
                        <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-stone-500 group-hover:text-brand-500 transition-colors">
                            View Detailed Reports
                        </div>
                        <ChevronRight size={20} className="text-stone-300 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
