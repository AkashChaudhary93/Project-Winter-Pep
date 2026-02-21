import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, Plus, Minus, ShoppingBag, Sparkles, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const API_BASE = (import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:9999'}`);

const CartPage = () => {
    const { cart, removeFromCart, addToCart, clearCart } = useCart();
    const { user } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handlePlaceOrder = () => {
        if (cart.length === 0) return;

        const orderData = {
            studentId: user?.registrationNumber || user?.phoneNumber || 'GUEST',
            totalAmount: total,
            items: cart.map(item => ({
                menuItem: { id: item.id },
                quantity: item.quantity
            }))
        };

        axios.post(`${API_BASE}/orders`, orderData)
            .then(res => {
                clearCart();
                navigate(`/track/${res.data.id}`);
            })
            .catch(err => {
                console.error("Order failed", err);
                alert("Failed to place order. Please try again.");
            });
    };

    return (
        <div
            className="pb-32 min-h-screen transition-colors duration-300"
            style={{ backgroundColor: theme === 'dark' ? '#1c1917' : '#fafaf9' }}
        >
            {/* Header */}
            <div className="px-6 pt-8 pb-4">
                <div className="flex items-center gap-4 mb-1">
                    <button
                        onClick={() => navigate(-1)}
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center active:scale-95 transition-all flex-shrink-0 ${theme === 'dark'
                            ? 'bg-stone-800 text-stone-300 border border-stone-700'
                            : 'bg-white text-stone-600 shadow-sm border border-stone-100'
                            }`}
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex-1">
                        <h1 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>Your Cart</h1>
                    </div>
                    {cart.length > 0 && (
                        <div className={`px-3 py-1.5 rounded-xl text-xs font-black ${theme === 'dark' ? 'bg-stone-800 text-stone-400 border border-stone-700' : 'bg-white text-stone-500 shadow-sm border border-stone-100'}`}>
                            {totalItems} items
                        </div>
                    )}
                </div>
            </div>

            <div className={`px-6 max-w-7xl mx-auto`}>
                {cart.length === 0 ? (
                    <div className={`flex flex-col items-center justify-center py-20 rounded-[32px] border-2 border-dashed transition-all ${theme === 'dark' ? 'border-stone-800 bg-stone-900/30' : 'border-stone-200 bg-stone-50/50'}`}>
                        <div className={`p-8 rounded-[32px] mb-6 transform rotate-3 transition-transform hover:rotate-6 ${theme === 'dark' ? 'bg-stone-800 text-stone-600 shadow-2xl' : 'bg-white text-stone-300 shadow-xl'}`}>
                            <ShoppingBag size={56} strokeWidth={1.5} />
                        </div>
                        <h2 className={`font-black text-xl mb-2 ${theme === 'dark' ? 'text-stone-400' : 'text-stone-900'}`}>Your cart is empty</h2>
                        <p className={`text-sm mb-8 font-medium ${theme === 'dark' ? 'text-stone-600' : 'text-stone-400'}`}>Add some delicious food to get started!</p>
                        <button
                            onClick={() => navigate('/home')}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-500 text-white text-sm font-black shadow-xl shadow-brand-500/20 hover:bg-brand-600 hover:scale-105 transition-all active:scale-95"
                        >
                            Browse Menu <ArrowRight size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* ── Left Column: Cart Items ── */}
                        <div className="flex-1 w-full space-y-4">
                            {cart.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`group relative rounded-[28px] border overflow-hidden transition-all duration-300 hover:shadow-lg ${theme === 'dark'
                                        ? 'bg-stone-900 border-stone-800 hover:border-stone-700'
                                        : 'bg-white border-stone-100 shadow-sm hover:border-stone-200'
                                        }`}
                                >
                                    <div className="p-5 flex items-start gap-5">
                                        {/* Item Image / Placeholder */}
                                        <div className={`w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center ${theme === 'dark' ? 'bg-stone-800 text-stone-600' : 'bg-stone-100 text-stone-400'}`}>
                                            <ShoppingBag size={24} />
                                        </div>

                                        {/* Item info */}
                                        <div className="flex-1 min-w-0 pt-1">
                                            <div className="flex justify-between items-start gap-4 mb-2">
                                                <div>
                                                    <h3 className={`font-black text-lg leading-tight mb-1 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>{item.name}</h3>
                                                    <p className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                                                        ₹{item.price} / item
                                                    </p>
                                                </div>
                                                <p className={`font-black text-lg ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                                    ₹{item.price * item.quantity}
                                                </p>
                                            </div>

                                            {/* Controls Row */}
                                            <div className="flex items-center justify-between mt-4">
                                                {/* Quantity controls */}
                                                <div className={`flex items-center gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-stone-700 text-stone-400' : 'hover:bg-white hover:shadow-sm text-stone-500'}`}
                                                    >
                                                        {item.quantity === 1 ? <Trash2 size={16} className="text-red-500" /> : <Minus size={16} />}
                                                    </button>
                                                    <span className={`w-8 text-center text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>{item.quantity}</span>
                                                    <button
                                                        onClick={() => addToCart(item)}
                                                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${theme === 'dark' ? 'bg-stone-700 text-white shadow-sm' : 'bg-white text-stone-900 shadow-sm'}`}
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ── Right Column: Order Summary (Sticky) ── */}
                        <div className="w-full lg:w-[400px] lg:sticky lg:top-8 space-y-4">
                            <div className={`rounded-[32px] border overflow-hidden relative ${theme === 'dark'
                                ? 'bg-stone-900 border-stone-800'
                                : 'bg-white border-stone-100 shadow-xl shadow-stone-200/50'
                                }`}>

                                {/* Decorative blob */}
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

                                {/* Summary details */}
                                <div className="p-8 relative z-10">
                                    <h2 className={`text-xl font-black mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                        Order Summary
                                    </h2>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>Item Total</span>
                                            <span className={`text-sm font-bold ${theme === 'dark' ? 'text-stone-300' : 'text-stone-900'}`}>₹{total}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>Platform Fee</span>
                                            <span className={`text-xs font-black px-2 py-0.5 rounded-md bg-green-500/10 text-green-500`}>FREE</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>Taxes & Charges</span>
                                            <span className={`text-sm font-bold ${theme === 'dark' ? 'text-stone-300' : 'text-stone-900'}`}>₹12</span>
                                        </div>
                                    </div>

                                    {/* Dashed Separator */}
                                    <div className={`border-t border-dashed my-6 ${theme === 'dark' ? 'border-stone-800' : 'border-stone-200'}`}></div>

                                    <div className="flex items-end justify-between mb-8">
                                        <div>
                                            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Grand Total</p>
                                            <p className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>₹{total + 12}</p>
                                        </div>
                                    </div>

                                    {/* Place Order Button */}
                                    <button
                                        onClick={handlePlaceOrder}
                                        className="group relative w-full py-4 bg-brand-500 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-brand-500/30 hover:shadow-2xl hover:shadow-brand-500/40 hover:-translate-y-1 transition-all active:scale-[0.98] overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                        <span className="relative z-10">Place Order</span>
                                        <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className={`flex items-center justify-center gap-2 py-4 rounded-2xl border border-dashed ${theme === 'dark' ? 'border-stone-800 bg-stone-900/50' : 'border-stone-200 bg-stone-50'}`}>
                                <Sparkles size={14} className="text-brand-500" />
                                <p className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-stone-500' : 'text-stone-500'}`}>
                                    100% Secure Checkout
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
