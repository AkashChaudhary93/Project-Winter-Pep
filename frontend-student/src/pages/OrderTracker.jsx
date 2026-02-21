import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import {
    CheckCircle2,
    Clock,
    ChefHat,
    Package,
    ChevronLeft,
    RefreshCw,
    MapPin,
    FileText,
    Star,
    MessageSquare,
    Heart,
    Sparkles,
    PartyPopper,
    Coffee,
    Truck,
    ArrowLeft,
    X,
    Utensils,
    ShoppingBag
} from 'lucide-react';

const API_BASE = 'http://localhost:9999';

const OrderTracker = () => {
    const { orderId } = useParams();
    const { theme } = useTheme();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    const submitRating = () => {
        axios.post(`${API_BASE}/orders/${orderId}/rate`, { rating, review })
            .then(res => {
                setOrder(res.data);
            })
            .catch(err => console.error("Rating failed", err));
    };

    const fetchStatus = () => {
        axios.get(`${API_BASE}/orders/${orderId}`)
            .then(res => {
                setOrder(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 3000);
        return () => clearInterval(interval);
    }, [orderId]);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 transition-colors duration-500"
            style={{ backgroundColor: theme === 'dark' ? '#0c0a09' : '#fafaf9' }}>
            <div className={`p-6 rounded-[32px] ${theme === 'dark' ? 'bg-stone-900 border border-stone-800' : 'bg-white shadow-2xl shadow-stone-200'}`}>
                <RefreshCw className="animate-spin text-brand-500" size={40} />
            </div>
            <div className="text-center">
                <p className={`font-black text-xs uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                    Synchronizing Records
                </p>
                <div className="h-1 w-24 bg-stone-200 dark:bg-stone-800 rounded-full mt-3 mx-auto overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full animate-progress-indefinite w-1/3"></div>
                </div>
            </div>
        </div>
    );

    if (!order) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center"
            style={{ backgroundColor: theme === 'dark' ? '#0c0a09' : '#fafaf9' }}>
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[32px] flex items-center justify-center mb-6">
                <X size={40} />
            </div>
            <h2 className={`text-2xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>Order Expired</h2>
            <p className="text-stone-400 text-sm mb-8 font-medium">We couldn't locate this order reference.</p>
            <Link to="/" className="px-8 py-4 bg-brand-600 text-white rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-500/20 active:scale-95 transition-all">
                Return Dashboard
            </Link>
        </div>
    );

    const steps = [
        { status: 'PENDING', icon: <ShoppingBag />, label: 'Placed', desc: 'Awaiting Vendor', color: 'orange' },
        { status: 'ACCEPTED', icon: <FileText />, label: 'Accepted', desc: 'Vendor Confirmed', color: 'blue' },
        { status: 'COOKING', icon: <ChefHat />, label: 'Cooking', desc: 'Preparing Meal', color: 'purple' },
        { status: 'READY', icon: <Package />, label: 'Ready', desc: 'Counter Pickup', color: 'green' },
        { status: 'COMPLETED', icon: <Heart />, label: 'Enjoyed', desc: 'Order Finished', color: 'brand' }
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.status);
    const statusMap = {
        'PENDING': {
            color: 'from-orange-500 to-amber-500',
            icon: <Clock size={44} />,
            title: 'ORDER PLACED',
            msg: 'Waiting for vendor to accept'
        },
        'ACCEPTED': {
            color: 'from-blue-500 to-indigo-500',
            icon: <FileText size={44} />,
            title: 'CONFIRMED',
            msg: 'Vendor has accepted'
        },
        'COOKING': {
            color: 'from-purple-500 to-pink-500',
            icon: <ChefHat size={44} />,
            title: 'SIPPING & SIZZLING',
            msg: 'Your meal is being prepared'
        },
        'READY': {
            color: 'from-green-500 to-emerald-500',
            icon: <Package size={44} />,
            title: 'READY FOR YOU',
            msg: 'Collect from Counter 04'
        },
        'COMPLETED': {
            color: 'from-brand-600 to-violet-600',
            icon: <PartyPopper size={44} />,
            title: 'MEAL FINISHED',
            msg: 'Order successful'
        },
        'REJECTED': {
            color: 'from-red-500 to-rose-600',
            icon: <X size={44} />,
            title: 'CANCELLED',
            msg: 'Order could not be fulfilled'
        }
    };

    const currentStatus = statusMap[order.status] || statusMap['PENDING'];

    return (
        <div
            className="pb-32 min-h-screen transition-colors duration-700 relative overflow-hidden"
            style={{ backgroundColor: theme === 'dark' ? '#0c0a09' : '#fafaf9' }}
        >
            {/* ── Visual Background Architecture ── */}
            <div className={`absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.12] animate-pulse bg-gradient-to-br ${currentStatus.color}`}></div>
            <div className="absolute bottom-[-5%] left-[-5%] w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] animate-blob"></div>

            {/* ── Elite Header ── */}
            <header className="px-6 pt-12 pb-8 relative z-10 max-w-7xl mx-auto">
                <div className="flex items-center gap-6">
                    <Link to="/orders" className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all active:scale-95 group ${theme === 'dark' ? 'bg-stone-900/80 text-white border border-stone-800 backdrop-blur-xl hover:bg-stone-800' : 'bg-white text-stone-900 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-stone-100 hover:shadow-xl'
                        }`}>
                        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h1 className={`text-4xl font-black tracking-tight leading-none ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                            Order Details
                        </h1>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded-md">
                                ID: CC-{order.id}
                            </span>
                            <div className="w-1.5 h-1.5 rounded-full bg-stone-200 dark:bg-stone-800"></div>
                            <span className={`text-[11px] font-extrabold uppercase tracking-widest ${theme === 'dark' ? 'text-stone-600' : 'text-stone-400'}`}>
                                Ref: #{order.vendorId || '42'}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="px-6 py-2 max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* ── LEFT COLUMN: Status & Timeline ── */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* ── Ultra-Premium Status Visualization ── */}
                        <div className={`relative p-12 rounded-[56px] overflow-hidden transition-all duration-1000 border group ${theme === 'dark' ? 'bg-stone-900/40 border-stone-800/50 backdrop-blur-2xl' : 'bg-white/80 border-white shadow-[0_40px_80px_rgba(0,0,0,0.04)] backdrop-blur-2xl'
                            }`}>
                            {/* Dynamic Ambient Light */}
                            <div className={`absolute -top-32 -right-32 w-80 h-80 rounded-full blur-[90px] opacity-[0.2] group-hover:opacity-[0.3] transition-opacity duration-1000 bg-gradient-to-br ${currentStatus.color}`}></div>

                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.35em] mb-6 px-4 py-1.5 rounded-full border ${theme === 'dark' ? 'text-stone-500 border-stone-800/50 bg-stone-950/30' : 'text-stone-300 border-stone-100 bg-stone-50/50'}`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
                                    Live Status Tracking
                                </div>
                                <h2 className={`text-6xl lg:text-7xl font-black mb-6 tracking-tighter leading-[0.9] ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                    {currentStatus.title}
                                </h2>

                                <div className={`mt-4 p-5 px-10 rounded-[32px] flex items-center gap-5 border transition-all duration-500 group-hover:scale-[1.02] ${theme === 'dark' ? 'bg-stone-800/40 border-stone-700/50 hover:bg-stone-800/60' : 'bg-white border-stone-100 shadow-xl shadow-stone-200/20'
                                    }`}>
                                    <div className={`w-14 h-14 rounded-[20px] bg-gradient-to-br ${currentStatus.color} text-white flex items-center justify-center shadow-2xl transition-transform group-hover:rotate-6`}>
                                        {React.cloneElement(currentStatus.icon, { size: 32, strokeWidth: 2.5 })}
                                    </div>
                                    <div className="text-left">
                                        <p className={`text-base font-black tracking-tight ${theme === 'dark' ? 'text-stone-200' : 'text-stone-800'}`}>
                                            {currentStatus.msg}
                                        </p>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                                            Update Received Just Now
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Pickup Verification Code Card ── */}
                        {order.status === 'READY' && order.pickupCode && (
                            <div className={`relative p-8 rounded-[40px] overflow-hidden border text-center transition-all ${theme === 'dark' ? 'bg-stone-900/60 border-green-500/20 backdrop-blur-xl' : 'bg-white border-green-100 shadow-[0_20px_60px_rgba(0,0,0,0.04)]'}`}>
                                {/* Green glow */}
                                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] opacity-20 bg-gradient-to-br from-green-400 to-emerald-500"></div>

                                <div className="relative z-10">
                                    <div className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] mb-4 px-4 py-1.5 rounded-full border ${theme === 'dark' ? 'text-green-400 border-green-500/20 bg-green-500/10' : 'text-green-600 border-green-100 bg-green-50'}`}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                        Pickup Code
                                    </div>
                                    <div className={`text-6xl lg:text-7xl font-black tracking-[0.4em] leading-none mb-4 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                        {order.pickupCode}
                                    </div>
                                    <p className={`text-xs font-bold ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                                        Show this code to the vendor to collect your order
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ── Adaptive Status Pipeline (Alignment Fixed) ── */}
                        <div className={`p-8 md:p-10 rounded-[56px] border backdrop-blur-xl transition-all ${theme === 'dark' ? 'bg-stone-900/40 border-stone-800/50' : 'bg-white/80 border-white shadow-[0_20px_50px_rgba(0,0,0,0.03)]'
                            }`}>
                            <div className="flex justify-between items-start relative px-1">
                                {/* Progress Background Line (Fixed Alignment) */}
                                <div className={`absolute top-10 left-[12%] right-[12%] h-[4px] rounded-full ${theme === 'dark' ? 'bg-stone-800/50' : 'bg-stone-100'}`}></div>

                                {/* Animated Progress Active Line (Dynamic Adjustment) */}
                                <div
                                    className={`absolute top-10 left-[12%] h-[4px] rounded-full transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] bg-brand-500 shadow-[0_0_20px_rgba(255,83,30,0.4)]`}
                                    style={{
                                        width: `${(currentStepIndex / (steps.length - 1)) * 76}%`
                                    }}
                                ></div>

                                {steps.map((step, idx) => {
                                    const isDone = idx <= currentStepIndex;
                                    const isCurrent = idx === currentStepIndex;

                                    return (
                                        <div key={step.status} className="flex flex-col items-center relative z-10 w-1/5 group">
                                            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[28px] flex items-center justify-center transition-all duration-700 mb-5 relative ${isCurrent
                                                ? `bg-brand-600 text-white shadow-[0_15px_40px_rgba(255,83,30,0.3)] translate-y-[-10px] scale-110 z-20`
                                                : isDone
                                                    ? `bg-stone-900 text-white dark:bg-stone-800 shadow-lg`
                                                    : `bg-stone-50 dark:bg-stone-950 text-stone-300 border ${theme === 'dark' ? 'border-stone-800' : 'border-stone-100'}`
                                                }`}>
                                                {React.cloneElement(step.icon, { size: isCurrent ? 28 : 22, strokeWidth: isCurrent ? 2.5 : 2 })}

                                                {isCurrent && (
                                                    <div className="absolute -top-3 -right-3">
                                                        <span className="relative flex h-5 w-5">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-5 w-5 bg-brand-500 border-2 border-white dark:border-stone-900"></span>
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-center w-full">
                                                <p className={`text-[10px] md:text-[11px] font-black uppercase tracking-widest mb-1.5 transition-colors duration-500 ${isCurrent ? 'text-brand-500' : isDone ? (theme === 'dark' ? 'text-white' : 'text-stone-900') : 'text-stone-300'
                                                    }`}>
                                                    {step.label}
                                                </p>
                                                <div className={`flex flex-col items-center transition-opacity duration-700 ${isDone ? 'opacity-100' : 'opacity-0'}`}>
                                                    <p className={`text-[9px] font-black tracking-tighter ${isCurrent ? 'text-brand-400' : (theme === 'dark' ? 'text-stone-600' : 'text-stone-400')}`}>
                                                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── Status Actions (Desktop) ── */}
                        {order.status !== 'COMPLETED' && (
                            <div className="grid grid-cols-2 gap-5">
                                <div className={`p-8 rounded-[40px] border flex flex-col items-center gap-4 transition-all hover:shadow-xl ${theme === 'dark' ? 'bg-stone-900/40 border-stone-800' : 'bg-white/80 border-white shadow-sm'
                                    }`}>
                                    <div className="w-12 h-12 bg-brand-500/10 text-brand-500 rounded-2xl flex items-center justify-center shadow-inner">
                                        <MapPin size={24} />
                                    </div>
                                    <div className="text-center">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 block mb-1">Location</span>
                                        <span className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>BLOCK 34</span>
                                    </div>
                                </div>
                                <button
                                    onClick={fetchStatus}
                                    className={`group flex flex-col items-center justify-center gap-2 p-6 rounded-[40px] text-[11px] font-black uppercase tracking-[0.3em] transition-all active:scale-95 border hover:scale-[1.02] ${theme === 'dark' ? 'bg-stone-900/80 border-stone-800 text-stone-500 backdrop-blur-xl' : 'bg-white border-white text-stone-400 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-xl'
                                        }`}
                                >
                                    <RefreshCw size={24} className="group-active:rotate-180 transition-transform duration-1000 text-brand-500 mb-1" />
                                    Refresh Status
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT COLUMN: Basket & Rating ── */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* ── Basket Contents (Elite Redesign) ── */}
                        <div className={`rounded-[48px] p-8 border transition-all hover:shadow-2xl hover:shadow-stone-200/20 ${theme === 'dark' ? 'bg-stone-900/40 border-stone-800/50' : 'bg-white/80 border-white shadow-sm'
                            }`}>
                            <div className="flex items-center gap-5 mb-8">
                                <div className="w-12 h-12 bg-brand-500/10 rounded-[18px] text-brand-500 flex items-center justify-center shadow-inner">
                                    <Utensils size={24} />
                                </div>
                                <div>
                                    <h3 className={`font-black text-base uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                        Stall Basket
                                    </h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-700"></span>
                                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                                            {order.items?.length || 0} Items
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start group">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-[16px] flex items-center justify-center font-black text-xs transition-all ${theme === 'dark' ? 'bg-stone-800 text-stone-400 group-hover:bg-stone-700' : 'bg-stone-50 text-stone-500 group-hover:bg-stone-100'
                                                }`}>
                                                {item.quantity}x
                                            </div>
                                            <div className="space-y-1">
                                                <p className={`font-black text-sm tracking-tight leading-tight ${theme === 'dark' ? 'text-stone-100' : 'text-stone-900'}`}>
                                                    {item.menuItem?.name || 'Signature Dish'}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${item.menuItem?.veg ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                                                        {item.menuItem?.veg ? 'VEG' : 'NV'}
                                                    </span>
                                                    <p className={`text-[10px] font-extrabold ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                                                        ₹{item.menuItem?.price || 0}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`text-sm font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                            ₹{(item.menuItem?.price || 0) * item.quantity}
                                        </span>
                                    </div>
                                ))}

                                <div className={`pt-6 mt-6 border-t-2 border-dashed flex justify-between items-end ${theme === 'dark' ? 'border-stone-800' : 'border-stone-100'
                                    }`}>
                                    <div className="space-y-1">
                                        <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-stone-600' : 'text-stone-300'}`}>Total</p>
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-green-50 text-green-600 border border-green-100'
                                            }`}>
                                            <Sparkles size={10} className="animate-pulse" /> Paid
                                        </div>
                                    </div>
                                    <span className={`text-4xl font-black tracking-tighter block leading-[0.9] ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                        <span className="text-xl mr-0.5 opacity-50 font-bold">₹</span>{order.totalAmount}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ── Elite Action Footer (Right Column) ── */}
                        {order.status === 'COMPLETED' && (
                            !order.rating ? (
                                <div className={`p-8 rounded-[48px] animate-in fade-in slide-in-from-bottom-12 duration-1000 border ${theme === 'dark' ? 'bg-brand-500/5 border-brand-500/10 shadow-[0_0_60px_rgba(255,83,30,0.05)]' : 'bg-white shadow-[0_40px_100px_rgba(0,0,0,0.08)] border-white'
                                    }`}>
                                    <div className="text-center mb-6">
                                        <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center mx-auto mb-4 shadow-2xl transition-transform hover:scale-110 duration-500 ${theme === 'dark' ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-50 text-amber-500'}`}>
                                            <Star size={32} fill="currentColor" className="drop-shadow-lg" />
                                        </div>
                                        <h3 className={`text-2xl font-black mb-2 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                            Rate the Craft
                                        </h3>
                                    </div>

                                    <div className="flex justify-center gap-3 mb-8">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => setRating(star)}
                                                className={`transition-all duration-500 active:scale-90 ${(hoverRating || rating) >= star ? 'text-amber-400 scale-125 hover:rotate-12' : 'text-stone-200 dark:text-stone-800 hover:scale-110'}`}
                                            >
                                                <Star size={32} fill={(hoverRating || rating) >= star ? "currentColor" : "none"} strokeWidth={2.5} />
                                            </button>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <div className={`group flex items-start gap-4 p-5 rounded-[24px] border-2 transition-all duration-500 ${theme === 'dark' ? 'bg-stone-900/50 border-stone-800 focus-within:border-brand-500 focus-within:bg-stone-900' : 'bg-stone-50 border-stone-50 focus-within:bg-white focus-within:border-brand-200 focus-within:shadow-2xl focus-within:shadow-brand-500/5'
                                            }`}>
                                            <MessageSquare size={20} className="text-stone-400 mt-1 transition-colors group-focus-within:text-brand-500" />
                                            <textarea
                                                placeholder="Write a review..."
                                                value={review}
                                                onChange={e => setReview(e.target.value)}
                                                rows={2}
                                                className={`flex-1 bg-transparent outline-none font-bold text-sm resize-none ${theme === 'dark' ? 'text-white placeholder-stone-700' : 'text-stone-800 placeholder-stone-300'}`}
                                            />
                                        </div>

                                        <button
                                            onClick={submitRating}
                                            disabled={!rating}
                                            className={`w-full py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.25em] transition-all duration-500 active:scale-[0.98] ${!rating
                                                ? 'bg-stone-100 text-stone-300 dark:bg-stone-800 dark:text-stone-700 cursor-not-allowed opacity-50'
                                                : 'bg-stone-900 dark:bg-brand-600 text-white shadow-2xl shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-[1.02]'
                                                }`}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className={`text-center p-8 rounded-[48px] border-2 border-dashed flex flex-col items-center backdrop-blur-sm transition-all duration-700 ${theme === 'dark' ? 'border-stone-800 bg-stone-900/40' : 'border-brand-100 bg-brand-50/20'
                                    }`}>
                                    <div className="flex gap-2 mb-4">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star key={star} size={20} className={star <= order.rating ? 'text-amber-400' : 'text-stone-200 dark:text-stone-800'} fill={star <= order.rating ? "currentColor" : "none"} />
                                        ))}
                                    </div>
                                    <h4 className={`text-lg font-black mb-1 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                        Thanks!
                                    </h4>
                                    <p className="text-sm font-medium text-stone-400 italic max-w-xs mx-auto">"{order.review || 'An exceptional campus culinary journey.'}"</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracker;
