import React, { useState } from 'react';
import axios from 'axios';
import { ChefHat, CheckCircle, Clock, X, Check, ShoppingBag, Coffee } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const API_BASE = 'http://localhost:9999';

const OrderCard = ({ order, onStatusUpdate, onPickupVerified }) => {
    const { theme } = useTheme();
    const [verifyingId, setVerifyingId] = useState(null);
    const [codeInput, setCodeInput] = useState('');
    const [codeError, setCodeError] = useState('');
    const [verifying, setVerifying] = useState(false);

    const handleVerifyPickup = async () => {
        if (codeInput.length !== 4) {
            setCodeError('Enter 4-digit code');
            return;
        }
        setVerifying(true);
        setCodeError('');
        try {
            await axios.post(`${API_BASE}/orders/${order.id}/verify-pickup?code=${codeInput}`);
            setVerifyingId(null);
            setCodeInput('');
            // Use dedicated callback to avoid hitting the blocked PATCH endpoint
            if (onPickupVerified) {
                onPickupVerified(order.id);
            }
        } catch (err) {
            setCodeError(err.response?.data?.error || 'Invalid code');
        } finally {
            setVerifying(false);
        }
    };

    const statusStyles = {
        PENDING: {
            bg: "bg-orange-500/10",
            text: "text-orange-600",
            border: "border-orange-500/20",
            icon: "text-orange-500",
            dot: "bg-orange-500",
            shadow: "shadow-orange-500/10",
            gradient: "from-orange-500 to-amber-500"
        },
        ACCEPTED: {
            bg: "bg-blue-500/10",
            text: "text-blue-600",
            border: "border-blue-500/20",
            icon: "text-blue-500",
            dot: "bg-blue-500",
            shadow: "shadow-blue-500/10",
            gradient: "from-blue-500 to-indigo-500"
        },
        COOKING: {
            bg: "bg-violet-500/10",
            text: "text-violet-600",
            border: "border-violet-500/20",
            icon: "text-violet-500",
            dot: "bg-violet-500",
            shadow: "shadow-violet-500/10",
            gradient: "from-violet-500 to-purple-500"
        },
        READY: {
            bg: "bg-green-500/10",
            text: "text-green-600",
            border: "border-green-500/20",
            icon: "text-green-500",
            dot: "bg-green-500",
            shadow: "shadow-green-500/10",
            gradient: "from-green-500 to-emerald-500"
        },
        COMPLETED: {
            bg: "bg-stone-500/10",
            text: "text-stone-500",
            border: "border-stone-500/20",
            icon: "text-stone-400",
            dot: "bg-stone-500",
            shadow: "shadow-stone-500/10",
            gradient: "from-stone-400 to-stone-500"
        },
        REJECTED: {
            bg: "bg-red-500/10",
            text: "text-red-600",
            border: "border-red-500/20",
            icon: "text-red-500",
            dot: "bg-red-500",
            shadow: "shadow-red-500/10",
            gradient: "from-red-500 to-rose-500"
        }
    };

    const style = statusStyles[order.status] || statusStyles.PENDING;

    return (
        <div className={`p-6 rounded-[32px] glass-card hover:-translate-y-2 transition-all duration-500 relative group overflow-hidden border ${theme === 'dark' ? 'bg-stone-900/60 border-stone-800/50 hover:shadow-2xl hover:shadow-brand-500/10' : 'bg-white/80 border-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]'}`}>

            {/* Status Gradient Bar */}
            <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${style.gradient} opacity-80`}></div>

            {/* Header */}
            <div className="flex justify-between items-start mb-6 pt-3 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest border shadow-sm ${theme === 'dark' ? 'bg-stone-950 border-stone-800 text-stone-400' : 'bg-white border-stone-100 text-stone-600'
                            }`}>
                            #{order.id}
                        </span>
                        <div className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-stone-800' : 'bg-stone-200'}`}></div>
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-stone-600' : 'text-stone-400'}`}>
                            Order ID
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${theme === 'dark' ? 'bg-stone-800/50 text-stone-500' : 'bg-stone-100/50 text-stone-400'}`}>
                            <Clock size={12} strokeWidth={3} />
                        </div>
                        <p className={`text-xs font-bold ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
                <div className={`pl-3 pr-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border shadow-sm transition-transform group-hover:scale-105 ${style.bg} ${style.text} ${style.border}`}>
                    <span className={`relative flex h-2.5 w-2.5`}>
                        {['PENDING', 'COOKING'].includes(order.status) && (
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${style.dot}`}></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${style.dot}`}></span>
                    </span>
                    {order.status}
                </div>
            </div>

            {/* Items Container */}
            <div className={`space-y-3 mb-8 min-h-[100px] p-4 rounded-[24px] ${theme === 'dark' ? 'bg-stone-950/30 border border-stone-800/30' : 'bg-stone-50/50 border border-stone-100'}`}>
                {order.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-4">
                        <span className={`font-black w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-xl text-xs shadow-sm border ${theme === 'dark' ? 'bg-stone-800 text-stone-200 border-stone-700' : 'bg-white text-stone-700 border-stone-100'
                            }`}>
                            {item.quantity}x
                        </span>
                        <div className="flex-1 pt-0.5">
                            <span className={`font-bold text-sm leading-snug flex items-center gap-2 ${theme === 'dark' ? 'text-stone-200' : 'text-stone-700'
                                }`}>
                                <div className={`w-3.5 h-3.5 border-[2.5px] rounded-[5px] ${item.menuItem?.veg ? 'border-green-500' : 'border-red-500'} flex items-center justify-center p-[1px]`}>
                                    <div className={`w-full h-full rounded-[1px] ${item.menuItem?.veg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                </div>
                                {item.menuItem.name}
                            </span>
                            {item.specialInstructions && (
                                <p className="mt-2 text-[10px] font-bold text-amber-600 bg-amber-500/10 px-3 py-1.5 rounded-lg inline-block border border-amber-500/20">
                                    ✍️ {item.specialInstructions}
                                </p>
                            )}
                        </div>
                        <div className={`text-sm font-black ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                            ₹{item.menuItem.price * item.quantity}
                        </div>
                    </div>
                ))}
            </div>

            {/* Total Footer */}
            <div className="flex justify-between items-end mb-6">
                <div>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${theme === 'dark' ? 'text-stone-600' : 'text-stone-400'}`}>Total Bill</p>
                    <div className="flex items-baseline gap-1">
                        <span className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-stone-800'}`}>₹{order.totalAmount}</span>
                        <span className={`text-xs font-bold ${theme === 'dark' ? 'text-stone-600' : 'text-stone-400'}`}>.00</span>
                    </div>
                </div>
                {order.paymentMethod === 'UPI' && (
                    <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                        UPI Paid
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
                {order.status === 'PENDING' && (
                    <>
                        <button
                            onClick={() => onStatusUpdate(order.id, 'REJECTED')}
                            className={`flex-1 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] transition-all active:scale-95 border hover:bg-red-500 hover:text-white hover:border-red-500 group ${theme === 'dark'
                                ? 'bg-transparent text-stone-500 border-stone-800'
                                : 'bg-white text-stone-400 border-stone-100 shadow-sm'}`}
                        >
                            Reject
                        </button>
                        <button
                            onClick={() => onStatusUpdate(order.id, 'ACCEPTED')}
                            className="flex-[2] bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            Accept Order <CheckCircle size={16} strokeWidth={3} />
                        </button>
                    </>
                )}

                {order.status === 'ACCEPTED' && (
                    <button
                        onClick={() => onStatusUpdate(order.id, 'COOKING')}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <ChefHat size={18} strokeWidth={2.5} /> Start Cooking
                    </button>
                )}

                {order.status === 'COOKING' && (
                    <button
                        onClick={() => onStatusUpdate(order.id, 'READY')}
                        className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <ShoppingBag size={18} strokeWidth={2.5} /> Mark Ready
                    </button>
                )}

                {order.status === 'READY' && (
                    <div className="w-full space-y-3">
                        {verifyingId === order.id ? (
                            <>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        maxLength={4}
                                        value={codeInput}
                                        onChange={(e) => { setCodeInput(e.target.value.replace(/\D/g, '')); setCodeError(''); }}
                                        placeholder="4-digit code"
                                        autoFocus
                                        className={`flex-1 text-center text-2xl font-black tracking-[0.5em] py-3 rounded-2xl outline-none border-2 transition-all ${codeError
                                            ? 'border-red-500 bg-red-500/5 text-red-500'
                                            : theme === 'dark'
                                                ? 'bg-stone-800 text-white border-stone-700 focus:border-green-500'
                                                : 'bg-stone-50 text-stone-900 border-stone-200 focus:border-green-500'
                                            }`}
                                    />
                                </div>
                                {codeError && (
                                    <p className="text-red-500 text-[11px] font-black text-center uppercase tracking-wider">{codeError}</p>
                                )}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setVerifyingId(null); setCodeInput(''); setCodeError(''); }}
                                        className={`flex-1 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] transition-all active:scale-95 border ${theme === 'dark'
                                            ? 'bg-transparent text-stone-500 border-stone-800 hover:bg-stone-800'
                                            : 'bg-white text-stone-400 border-stone-100 shadow-sm hover:bg-stone-50'}`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleVerifyPickup}
                                        disabled={verifying || codeInput.length !== 4}
                                        className={`flex-[2] py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${verifying || codeInput.length !== 4
                                            ? 'bg-stone-400 text-white cursor-not-allowed opacity-60'
                                            : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/30 hover:shadow-green-500/50 hover:scale-[1.02]'}`}
                                    >
                                        {verifying ? 'Verifying...' : <><CheckCircle size={16} strokeWidth={3} /> Confirm Pickup</>}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={() => setVerifyingId(order.id)}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-[1.02] hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={18} strokeWidth={2.5} /> Verify Pickup Code
                            </button>
                        )}
                    </div>
                )}

                {(order.status === 'COMPLETED' || order.status === 'REJECTED') && (
                    <div className={`w-full text-center py-4 font-black text-[10px] uppercase tracking-[0.25em] rounded-2xl opacity-60 dashed-border ${order.status === 'COMPLETED'
                        ? (theme === 'dark' ? 'bg-stone-800/50 text-stone-500 border border-stone-800' : 'bg-stone-100 text-stone-400 border border-stone-200')
                        : (theme === 'dark' ? 'bg-red-900/10 text-red-500 border border-red-900/20' : 'bg-red-50 text-red-400 border border-red-100')
                        }`}>
                        Order {order.status}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderCard;
