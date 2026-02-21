import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    CheckCircle2,
    XCircle,
    Clock,
    IndianRupee,
    TrendingUp,
    Calendar,
    ShoppingBag,
    Search,
    ChevronRight,
    ArrowUpRight,
    Filter
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:9999'}/orders/history`;

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { theme } = useTheme();
    const { user } = useAuth();

    useEffect(() => {
        if (user?.shopName) {
            fetchHistory();
        }
    }, [user]);

    const fetchHistory = async () => {
        try {
            const shopName = user?.shopName;
            if (!shopName) return;

            const res = await axios.get(`${API_URL}?stallName=${encodeURIComponent(shopName)}`);
            // Sort by ID descending (newest first)
            const sorted = res.data.sort((a, b) => b.id - a.id);
            setOrders(sorted);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching history:", error);
            setLoading(false);
        }
    };

    const totalEarnings = orders
        .filter(o => o.status === 'COMPLETED')
        .reduce((sum, o) => sum + o.totalAmount, 0);

    const filteredOrders = orders.filter(o =>
        o.id.toString().includes(searchTerm) ||
        o.items.some(i => i.menuItem.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20">
            <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-stone-500 font-bold animate-pulse uppercase tracking-widest text-xs">Retrieving records...</p>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className={`p-6 rounded-[32px] border relative overflow-hidden transition-all ${theme === 'dark' ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-100 shadow-sm'
                    }`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full translate-x-12 -translate-y-12 blur-2xl"></div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-brand-500/10 text-brand-500 rounded-2xl">
                            <TrendingUp size={24} />
                        </div>
                        <p className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Total Earnings</p>
                    </div>
                    <h3 className={`text-3xl font-black flex items-baseline gap-1 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                        <span className="text-xl">₹</span>{totalEarnings.toLocaleString()}
                    </h3>
                </div>

                <div className={`p-6 rounded-[32px] border relative overflow-hidden transition-all ${theme === 'dark' ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-100 shadow-sm'
                    }`}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-500/10 text-green-500 rounded-2xl">
                            <CheckCircle2 size={24} />
                        </div>
                        <p className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Success Rate</p>
                    </div>
                    <h3 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                        {orders.length > 0 ? Math.round((orders.filter(o => o.status === 'COMPLETED').length / orders.length) * 100) : 0}%
                    </h3>
                </div>

                <div className={`p-6 rounded-[32px] border relative overflow-hidden transition-all ${theme === 'dark' ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-100 shadow-sm'
                    }`}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-stone-500/10 text-stone-500 rounded-2xl">
                            <ShoppingBag size={24} />
                        </div>
                        <p className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Total Orders</p>
                    </div>
                    <h3 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                        {orders.length}
                    </h3>
                </div>
            </div>

            {/* ── Filters & Search ── */}
            <div className={`p-4 rounded-[28px] border mb-6 flex flex-col sm:flex-row gap-4 transition-all ${theme === 'dark' ? 'bg-stone-900/50 border-stone-800' : 'bg-white border-stone-100 shadow-sm'
                }`}>
                <div className="flex-1 flex items-center gap-3 px-4 py-2">
                    <Search size={18} className="text-stone-400" />
                    <input
                        type="text"
                        placeholder="Search by ID or Item name..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="bg-transparent outline-none w-full font-bold text-sm placeholder:text-stone-400"
                    />
                </div>
                <div className={`hidden sm:block w-px h-8 ${theme === 'dark' ? 'bg-stone-800' : 'bg-stone-100'}`}></div>
                <button className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${theme === 'dark' ? 'text-stone-400 hover:text-white' : 'text-stone-500 hover:text-stone-900'
                    }`}>
                    <Calendar size={16} /> Last 30 Days
                </button>
            </div>

            {/* ── History Table Card ── */}
            <div className={`rounded-[40px] border overflow-hidden transition-all ${theme === 'dark' ? 'bg-stone-900/40 border-stone-800' : 'bg-white border-stone-100 shadow-xl shadow-stone-200/40'
                }`}>
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className={`border-b ${theme === 'dark' ? 'border-stone-800 bg-stone-900/60' : 'bg-stone-50 border-stone-100'}`}>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Order Ref</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Timestamp</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Items Ordered</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Transaction</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Completion</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme === 'dark' ? 'divide-stone-800/50' : 'divide-stone-50'}`}>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-stone-800 text-stone-700' : 'bg-stone-50 text-stone-200'
                                                }`}>
                                                <ShoppingBag size={32} />
                                            </div>
                                            <p className={`font-black text-sm ${theme === 'dark' ? 'text-stone-600' : 'text-stone-400'}`}>No historical records found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className={`group transition-all duration-300 ${theme === 'dark' ? 'hover:bg-stone-800/40' : 'hover:bg-stone-50/50'
                                        }`}>
                                        <td className="px-8 py-6">
                                            <span className={`font-mono font-black text-sm tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                                #CC-{order.id}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-bold ${theme === 'dark' ? 'text-stone-300' : 'text-stone-800'}`}>
                                                    {new Date(order.createdAt).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                                <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-stone-600' : 'text-stone-400'}`}>
                                                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 max-w-md">
                                            <div className="flex flex-wrap gap-2">
                                                {order.items.map((i, idx) => (
                                                    <span key={idx} className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap ${theme === 'dark' ? 'bg-stone-800 text-stone-400' : 'bg-stone-100 text-stone-600'
                                                        }`}>
                                                        {i.quantity}x {i.menuItem.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-1 font-black text-lg tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-stone-900'
                                                }`}>
                                                ₹{order.totalAmount}
                                                <ArrowUpRight size={14} className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${order.status === 'COMPLETED'
                                                ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                                : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'COMPLETED' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination / View More */}
            {filteredOrders.length > 0 && (
                <div className="mt-8 text-center">
                    <p className={`text-[11px] font-black uppercase tracking-[0.2em] mb-4 ${theme === 'dark' ? 'text-stone-700' : 'text-stone-300'}`}>
                        End of transaction history
                    </p>
                    <div className="flex justify-center gap-4">
                        <div className={`p-4 rounded-3xl border flex items-center gap-6 ${theme === 'dark' ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-100'}`}>
                            <div className="flex flex-col items-start px-2">
                                <span className={`text-[10px] font-black text-stone-500 uppercase tracking-widest`}>Today</span>
                                <span className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>₹{(totalEarnings / 30).toFixed(0)} avg</span>
                            </div>
                            <button className="bg-stone-900 text-white dark:bg-white dark:text-stone-900 w-12 h-12 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all">
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
