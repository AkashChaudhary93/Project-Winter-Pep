import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

const FavoritesPage = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { favorites, toggleFavorite } = useCart();

    // No need for local state or useEffects for localStorage, as CartContext handles it.

    return (
        <div className={`min-h-screen relative transition-colors duration-700 overflow-hidden ${theme === 'dark' ? 'bg-[#0c0a09]' : 'bg-[#fafaf9]'}`}>
            {/* Background Blobs */}
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[130px] opacity-[0.1] bg-gradient-to-br ${theme === 'dark' ? 'from-rose-600 to-pink-600' : 'from-rose-400 to-pink-400'}`}></div>

            <header className="px-6 pt-12 pb-6 relative z-10 max-w-6xl mx-auto flex items-center gap-6">
                <button
                    onClick={() => navigate(-1)}
                    className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all active:scale-95 border backdrop-blur-xl ${theme === 'dark' ? 'bg-stone-900/60 text-white border-stone-800' : 'bg-white text-stone-900 border-white shadow-sm'}`}
                >
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h1 className={`text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>Your Favorites</h1>
                    <p className={`text-[11px] font-black uppercase tracking-widest mt-1 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Saved Items</p>
                </div>
            </header>

            <div className="px-6 py-4 max-w-6xl mx-auto relative z-10">
                {favorites.length === 0 ? (
                    <div className="text-center py-20 opacity-50">
                        <Heart size={48} className="mx-auto mb-4 text-stone-400" />
                        <p className={theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}>No favorites yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map(item => (
                            <div key={item.id} className={`p-4 rounded-[32px] border transition-all hover:scale-[1.02] flex gap-4 ${theme === 'dark' ? 'bg-stone-900/40 border-stone-800' : 'bg-white border-white shadow-sm'}`}>
                                <img src={item.imageUrl || item.image} alt={item.name} className="w-24 h-24 rounded-[24px] object-cover" />
                                <div className="flex-1 flex flex-col justify-center">
                                    <h3 className={`font-black text-lg leading-tight mb-1 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>{item.name}</h3>
                                    <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>{item.shopName || item.shop}</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className={`font-black ${theme === 'dark' ? 'text-brand-400' : 'text-brand-600'}`}>₹{item.price}</span>
                                        <button onClick={() => toggleFavorite(item)} className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-stone-800 text-stone-500 hover:text-red-400' : 'bg-stone-100 text-stone-400 hover:text-red-500'}`}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;
