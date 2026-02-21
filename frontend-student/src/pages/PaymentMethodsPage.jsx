import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Plus, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const PaymentMethodsPage = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();

    return (
        <div className={`min-h-screen relative transition-colors duration-700 overflow-hidden ${theme === 'dark' ? 'bg-[#0c0a09]' : 'bg-[#fafaf9]'}`}>
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[130px] opacity-[0.1] bg-gradient-to-tr ${theme === 'dark' ? 'from-amber-600 to-orange-600' : 'from-amber-400 to-orange-400'}`}></div>

            <header className="px-6 pt-12 pb-6 relative z-10 max-w-6xl mx-auto flex items-center gap-6">
                <button
                    onClick={() => navigate(-1)}
                    className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all active:scale-95 border backdrop-blur-xl ${theme === 'dark' ? 'bg-stone-900/60 text-white border-stone-800' : 'bg-white text-stone-900 border-white shadow-sm'}`}
                >
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h1 className={`text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>Wallet & Cards</h1>
                    <p className={`text-[11px] font-black uppercase tracking-widest mt-1 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Payment Methods</p>
                </div>
            </header>

            <div className="px-6 py-4 max-w-6xl mx-auto relative z-10 space-y-8">

                {/* ── Mock Campus Card ── */}
                <div>
                    <h2 className={`text-sm font-black uppercase tracking-widest mb-4 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Campus Card</h2>
                    <div className={`aspect-[1.586] w-full max-w-md rounded-[32px] p-8 relative overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] ${theme === 'dark' ? 'bg-gradient-to-br from-stone-800 to-stone-950 border border-stone-700' : 'bg-gradient-to-br from-stone-900 to-stone-700 text-white'}`}>
                        {/* Card Glow */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[50px] translate-x-1/3 -translate-y-1/3"></div>

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start">
                                <div className="text-2xl font-black tracking-tighter text-white">CampusCrave<span className="text-brand-500">.Pay</span></div>
                                <CreditCard size={32} className="text-white/50" />
                            </div>
                            <div>
                                <p className="font-mono text-xl tracking-[0.2em] text-white/90 mb-2">•••• •••• •••• 1062</p>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/50">Card Holder</p>
                                        <p className="font-bold text-white tracking-widest uppercase">AKASH CHAUDHARY</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/50">Balance</p>
                                        <p className="font-black text-2xl text-white">₹2,450</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── UPI / Other Methods ── */}
                <div>
                    <h2 className={`text-sm font-black uppercase tracking-widest mb-4 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Linked Methods</h2>
                    <div className={`p-5 rounded-[24px] border flex items-center gap-5 transition-all mb-3 opacity-60 ${theme === 'dark' ? 'bg-stone-900/40 border-stone-800' : 'bg-white border-white shadow-sm'}`}>
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                            <Lock size={18} />
                        </div>
                        <div>
                            <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>Google Pay (UPI)</h3>
                            <p className={`text-xs ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Linked via +91 93686...</p>
                        </div>
                        <button className="ml-auto text-xs font-bold text-brand-500 uppercase tracking-wider">Default</button>
                    </div>

                    <button className={`w-full py-4 rounded-[24px] border-2 border-dashed flex items-center justify-center gap-2 font-bold transition-all ${theme === 'dark' ? 'border-stone-800 text-stone-500 hover:border-brand-500 hover:text-brand-500' : 'border-stone-200 text-stone-400 hover:border-brand-500 hover:text-brand-500'}`}>
                        <Plus size={20} /> Add New Method
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodsPage;
