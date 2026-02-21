import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { ShoppingBag, X, Send, User, Plus, Minus, Sparkles, ChevronUp, Trash2, StickyNote, Receipt } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE = (import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:9999'}`);

const CartDrawer = () => {
    const { cart, totalItems, totalPrice, clearCart, updateCartItem, addToCart, removeFromCart } = useCart();
    const { theme } = useTheme();
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [studentId, setStudentId] = useState(user?.registrationNumber || user?.phoneNumber || '');
    const [isPlacing, setIsPlacing] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    if (totalItems === 0 || location.pathname === '/cart') return null;

    const handleCheckout = async () => {
        if (!studentId.trim()) return alert('Please enter your Student ID');

        setIsPlacing(true);
        const orderData = {
            studentId,
            totalAmount: totalPrice,
            items: cart.map(i => ({
                menuItem: { id: i.id },
                quantity: i.quantity,
                specialInstructions: i.specialInstructions
            }))
        };

        try {
            const res = await axios.post(`${API_BASE}/orders`, orderData);
            clearCart();
            setIsOpen(false);
            navigate(`/track/${res.data.id}`);
        } catch (err) {
            console.error(err);
            alert('Checkout failed. Is the backend running?');
        } finally {
            setIsPlacing(false);
        }
    };

    return (
        <>
            {/* ── Floating Cart Bar ── */}
            {!isOpen && (
                <div
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-24 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-8 lg:bottom-8 w-[92%] max-w-md lg:w-[420px] cursor-pointer active:scale-[0.97] transition-all z-40"
                >
                    <div className="relative overflow-hidden rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
                        {/* Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900"></div>
                        {/* Accent shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 via-transparent to-brand-500/5"></div>

                        <div className="relative z-10 flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                {/* Animated bag icon */}
                                <div className="relative">
                                    <div className="w-12 h-12 bg-brand-500/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-brand-500/20">
                                        <ShoppingBag size={20} className="text-brand-400" />
                                    </div>
                                    {/* Badge count */}
                                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
                                        <span className="text-[10px] font-black text-white">{totalItems}</span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-white font-black text-[15px] leading-tight">
                                        {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
                                    </p>
                                    <div className="flex items-center gap-1 text-stone-400">
                                        <ChevronUp size={10} />
                                        <p className="text-[10px] font-bold uppercase tracking-widest">Tap to expand</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-black text-white tracking-tight">₹{totalPrice}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Backdrop ── */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-all duration-400"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* ── Cart Sheet / Side Panel ── */}
            {/* Mobile: bottom sheet | Desktop: right side panel */}
            <div className={`fixed z-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
                bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md rounded-t-[36px]
                lg:top-0 lg:bottom-0 lg:right-0 lg:left-auto lg:translate-x-0 lg:w-[480px] lg:max-w-none lg:rounded-t-none lg:rounded-l-[36px]
                ${isOpen
                    ? 'translate-y-0 lg:translate-x-0'
                    : 'translate-y-full lg:translate-y-0 lg:translate-x-full'
                } ${theme === 'dark'
                    ? 'bg-stone-900 shadow-[0_-20px_80px_rgba(0,0,0,0.6)] lg:shadow-[-20px_0_80px_rgba(0,0,0,0.6)]'
                    : 'bg-white shadow-[0_-20px_80px_rgba(0,0,0,0.12)] lg:shadow-[-20px_0_80px_rgba(0,0,0,0.12)]'
                }`}>

                {/* Drag handle (mobile only) */}
                <div className="pt-4 pb-2 flex justify-center lg:hidden">
                    <div className={`w-10 h-1 rounded-full ${theme === 'dark' ? 'bg-stone-700' : 'bg-stone-200'}`}></div>
                </div>

                {/* Desktop header - fixed at top */}
                <div className="hidden lg:block px-8 pt-10 pb-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-2xl ${theme === 'dark' ? 'bg-brand-500/10' : 'bg-brand-50'}`}>
                                <Receipt size={20} className="text-brand-500" />
                            </div>
                            <div>
                                <h2 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>Your Basket</h2>
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>{totalItems} items · ₹{totalPrice}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${theme === 'dark'
                                ? 'bg-stone-800 text-stone-500 hover:text-white hover:bg-stone-700'
                                : 'bg-stone-100 text-stone-400 hover:text-stone-600 hover:bg-stone-200'
                                }`}
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div className={`mt-6 border-b ${theme === 'dark' ? 'border-stone-800' : 'border-stone-100'}`}></div>
                </div>

                {/* Scrollable content area */}
                <div className="px-7 pb-8 lg:px-8 lg:pb-10 lg:overflow-y-auto lg:max-h-[calc(100vh-140px)] custom-scrollbar">
                    {/* Mobile Header (hidden on desktop since it's above) */}
                    <div className="flex justify-between items-center mb-6 lg:hidden">
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-2xl ${theme === 'dark' ? 'bg-brand-500/10' : 'bg-brand-50'}`}>
                                <Receipt size={20} className="text-brand-500" />
                            </div>
                            <div>
                                <h2 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>Your Basket</h2>
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>{totalItems} items · ₹{totalPrice}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${theme === 'dark'
                                ? 'bg-stone-800 text-stone-500 hover:text-white hover:bg-stone-700'
                                : 'bg-stone-100 text-stone-400 hover:text-stone-600 hover:bg-stone-200'
                                }`}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="max-h-60 lg:max-h-none overflow-y-auto lg:overflow-visible space-y-3 mb-6 pr-1 custom-scrollbar">
                        {cart.map(item => (
                            <div key={item.id} className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'bg-stone-800/50 border-stone-800' : 'bg-stone-50/80 border-stone-100'}`}>
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-black text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>{item.name}</p>
                                            <p className={`text-xs font-bold ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>₹{item.price} each</p>
                                        </div>
                                        <p className={`text-lg font-black flex-shrink-0 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>₹{item.quantity * item.price}</p>
                                    </div>

                                    {/* Quantity + Delete Row */}
                                    <div className="flex items-center justify-between">
                                        <div className={`flex items-center gap-0 rounded-xl overflow-hidden border ${theme === 'dark' ? 'bg-stone-700 border-stone-600' : 'bg-white border-stone-200'}`}>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className={`w-8 h-8 flex items-center justify-center transition-colors ${theme === 'dark' ? 'text-stone-300 hover:bg-stone-600' : 'text-stone-500 hover:bg-stone-50'}`}
                                            >
                                                {item.quantity === 1 ? <Trash2 size={12} className="text-red-400" /> : <Minus size={12} />}
                                            </button>
                                            <span className={`w-8 text-center text-xs font-black ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>{item.quantity}</span>
                                            <button
                                                onClick={() => addToCart(item)}
                                                className="w-8 h-8 flex items-center justify-center bg-brand-500 text-white hover:bg-brand-600 transition-colors"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>

                                        {/* Special instructions toggle */}
                                        <button
                                            onClick={() => updateCartItem(item.id, { showNotes: !item.showNotes })}
                                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${item.specialInstructions || item.showNotes
                                                ? (theme === 'dark' ? 'bg-amber-900/20 text-amber-400' : 'bg-amber-50 text-amber-600')
                                                : (theme === 'dark' ? 'bg-stone-700 text-stone-400' : 'bg-stone-100 text-stone-400')
                                                }`}
                                        >
                                            <StickyNote size={10} />
                                            {item.specialInstructions ? 'Edit note' : 'Add note'}
                                        </button>
                                    </div>
                                </div>

                                {/* Notes input - expandable */}
                                {(item.showNotes || item.specialInstructions) && (
                                    <div className={`px-4 pb-3 ${theme === 'dark' ? 'border-stone-700' : 'border-stone-100'}`}>
                                        <input
                                            type="text"
                                            placeholder="e.g., No onions, extra spicy..."
                                            value={item.specialInstructions || ''}
                                            onChange={(e) => updateCartItem(item.id, { specialInstructions: e.target.value })}
                                            className={`w-full px-3 py-2 rounded-xl text-xs font-bold outline-none border-2 transition-all ${theme === 'dark'
                                                ? 'bg-stone-800 text-stone-300 border-stone-700 focus:border-brand-500/50 placeholder-stone-600'
                                                : 'bg-white text-stone-700 border-stone-100 focus:border-brand-300 placeholder-stone-400'
                                                }`}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ── Footer Section ── */}
                    <div className={`border-t pt-5 lg:pt-8 space-y-4 ${theme === 'dark' ? 'border-stone-800' : 'border-stone-100'}`}>
                        {/* Student ID */}
                        <div className={`flex items-center gap-3 p-1 rounded-2xl ${theme === 'dark' ? 'bg-stone-800' : 'bg-stone-50'}`}>
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ml-1 ${theme === 'dark' ? 'bg-stone-700 text-stone-400' : 'bg-white text-stone-400 shadow-sm'}`}>
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Student ID / Reg Number"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                className={`flex-1 bg-transparent px-2 py-3 rounded-xl outline-none font-bold text-sm ${theme === 'dark'
                                    ? 'text-white placeholder-stone-600'
                                    : 'text-stone-800 placeholder-stone-400'
                                    }`}
                            />
                        </div>

                        {/* Price Summary */}
                        <div className={`flex items-center justify-between px-1 ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>
                            <span className="text-xs font-bold">Subtotal ({totalItems} items)</span>
                            <span className="text-xs font-black">₹{totalPrice}</span>
                        </div>

                        {/* Order Button */}
                        <button
                            onClick={handleCheckout}
                            disabled={isPlacing}
                            className={`group relative w-full py-[18px] rounded-2xl font-black text-white flex items-center justify-center gap-2.5 active:scale-[0.97] transition-all overflow-hidden ${isPlacing ? 'opacity-70 cursor-wait' : ''
                                } bg-gradient-to-r from-brand-600 to-brand-500 shadow-xl shadow-brand-500/20 hover:shadow-2xl hover:shadow-brand-500/30`}
                        >
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                            {isPlacing ? (
                                <span className="text-sm uppercase tracking-widest animate-pulse">Placing Order...</span>
                            ) : (
                                <>
                                    <span className="text-sm uppercase tracking-widest relative z-10">Order Now</span>
                                    <span className="text-sm font-black relative z-10">· ₹{totalPrice}</span>
                                    <Send size={16} className="relative z-10" />
                                </>
                            )}
                        </button>

                        {/* Payment note */}
                        <div className="flex items-center justify-center gap-2">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${theme === 'dark' ? 'bg-stone-800' : 'bg-stone-50'}`}>
                                <Sparkles size={10} className={theme === 'dark' ? 'text-stone-600' : 'text-stone-300'} />
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-stone-600' : 'text-stone-400'}`}>
                                    Pay on Pickup
                                </p>
                                <Sparkles size={10} className={theme === 'dark' ? 'text-stone-600' : 'text-stone-300'} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartDrawer;
