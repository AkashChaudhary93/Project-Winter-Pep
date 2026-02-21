import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Minus, Heart, ChefHat, ChevronRight, Flame, Leaf, Clock, Star, Sparkles, UtensilsCrossed } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:9999'}/menu`;

// Rotating gradient palettes for food item placeholders
const FOOD_GRADIENTS = [
    'from-amber-400 via-orange-400 to-red-400',
    'from-emerald-400 via-teal-400 to-cyan-400',
    'from-violet-400 via-purple-400 to-fuchsia-400',
    'from-rose-400 via-pink-400 to-red-400',
    'from-blue-400 via-indigo-400 to-violet-400',
    'from-lime-400 via-green-400 to-emerald-400',
];

const FOOD_EMOJIS = ['🍛', '🍜', '🥗', '🍲', '🥘', '🍕', '🌮', '🍱', '🥙', '🍝'];

const MenuPage = () => {
    const { addToCart, removeFromCart, cart, favorites, toggleFavorite } = useCart();
    const { theme } = useTheme();
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const params = useParams();

    const locId = params.locId || searchParams.get('loc') || null;
    const stallId = params.stallId || searchParams.get('stall') || null;

    const [waitTime, setWaitTime] = useState(null);

    const [shopStatuses, setShopStatuses] = useState({});

    const fetchMenu = async () => {
        setLoading(true);
        setError(null);
        try {
            const [menuRes, usersRes] = await Promise.all([
                axios.get(API_URL),
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:9999'}/shop/users`)
            ]);

            const statusMap = {};
            usersRes.data.forEach(u => {
                if (u.role === 'VENDOR' && u.shopName) {
                    // rigorous check for true/false status
                    statusMap[u.shopName.toLowerCase()] = (u.isOpen === true || u.open === true);
                }
            });
            setShopStatuses(statusMap);
            setMenu(menuRes.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err);
            setLoading(false);
        }

        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:9999'}/orders/wait-time`)
            .then(res => setWaitTime(res.data))
            .catch(err => console.error(err));
    };

    const [activeCategory, setActiveCategory] = useState('All');
    const [isVegOnly, setIsVegOnly] = useState(false);

    useEffect(() => {
        fetchMenu();
    }, [locId, stallId]);

    const categories = ['All', 'Favorites', ...new Set(menu.map(item => item.category || 'Other'))];

    const filteredMenu = menu.filter(item => {
        const matchLoc = locId ? (item.location && item.location.includes(locId)) : true;
        const matchStall = stallId ? item.stallName === stallId : true;
        const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());

        let matchCategory = true;
        if (activeCategory === 'Favorites') {
            matchCategory = favorites.some(fav => fav.id === item.id);
        } else if (activeCategory !== 'All') {
            matchCategory = (item.category || 'Other') === activeCategory;
        }

        const matchVeg = isVegOnly ? item.veg : true;
        return matchLoc && matchStall && matchSearch && matchCategory && matchVeg;
    });

    const getItemQty = (id) => cart.find(i => i.id === id)?.quantity || 0;

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ backgroundColor: theme === 'dark' ? '#1c1917' : '#fafaf9' }}>
            <div className={`p-5 rounded-3xl ${theme === 'dark' ? 'bg-stone-800' : 'bg-white shadow-lg'}`}>
                <UtensilsCrossed className="animate-pulse text-brand-500" size={32} />
            </div>
            <p className={`font-black text-sm ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>Loading menu...</p>
        </div>
    );

    return (
        <div
            className="pb-32 min-h-screen transition-colors duration-300"
            style={{ backgroundColor: theme === 'dark' ? '#1c1917' : '#fafaf9' }}
        >
            {/* ── Premium Sticky Header ── */}
            <header className={`px-6 pt-6 pb-4 border-b sticky top-0 z-20 backdrop-blur-xl transition-colors ${theme === 'dark' ? 'bg-stone-900/90 border-stone-800' : 'bg-white/90 border-stone-100 shadow-sm'}`}>
                {/* Top Row - Nav + Shop Name + Wait Time */}
                <div className="flex items-center gap-3 mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center active:scale-95 transition-all flex-shrink-0 ${theme === 'dark'
                            ? 'bg-stone-800 text-stone-300 border border-stone-700 hover:bg-stone-700'
                            : 'bg-stone-50 text-stone-600 border border-stone-100 hover:bg-stone-100'
                            }`}
                    >
                        <ChevronRight className="rotate-180" size={18} />
                    </button>
                    <div className="flex-1 min-w-0">
                        <p className="text-brand-500 text-[10px] font-black uppercase tracking-widest truncate">{locId || 'All Locations'}</p>
                        <h1 className={`text-xl font-black truncate ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>{stallId || 'Full Menu'}</h1>
                    </div>
                    {waitTime && (
                        <div className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl flex-shrink-0 ${waitTime.traffic === 'Busy'
                            ? (theme === 'dark' ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500')
                            : (theme === 'dark' ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-600')
                            }`}>
                            <Clock size={12} />
                            <div className="text-right">
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-70">Wait</p>
                                <p className="text-sm font-black leading-none">{waitTime.minutes}m</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Search Bar */}
                <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search for food..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full rounded-2xl pl-11 pr-4 py-3 font-bold text-sm focus:outline-none transition-all border-2 ${theme === 'dark'
                            ? 'bg-stone-800 border-stone-800 text-white placeholder-stone-500 focus:border-brand-500/50'
                            : 'bg-stone-50 border-stone-50 text-stone-900 placeholder-stone-400 focus:border-brand-500/30 focus:bg-white'
                            }`}
                    />
                </div>

                {/* Category Tabs & Veg Toggle */}
                <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
                    {/* Veg Toggle */}
                    <button
                        onClick={() => setIsVegOnly(!isVegOnly)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all flex-shrink-0 border ${isVegOnly
                            ? (theme === 'dark' ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-green-50 border-green-200 text-green-700')
                            : (theme === 'dark' ? 'bg-stone-800 border-stone-700 text-stone-400' : 'bg-white border-stone-200 text-stone-400')
                            }`}
                    >
                        <Leaf size={12} className={isVegOnly ? 'text-green-500' : ''} />
                        Veg
                    </button>

                    <div className={`w-px h-5 flex-shrink-0 ${theme === 'dark' ? 'bg-stone-700' : 'bg-stone-200'}`}></div>

                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all flex-shrink-0 ${activeCategory === cat
                                ? (theme === 'dark'
                                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                                    : 'bg-stone-900 text-white shadow-md shadow-stone-900/20')
                                : (theme === 'dark'
                                    ? 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-300'
                                    : 'bg-white text-stone-400 border border-stone-100 hover:bg-stone-50 hover:text-stone-600')
                                }`}
                        >
                            {cat === 'Favorites' ? '♡ Favorites' : cat}
                        </button>
                    ))}
                </div>
            </header>

            {/* ── Menu Items ── */}
            <div className="px-6 py-5">
                {/* Items count */}
                <div className="flex items-center justify-between mb-4">
                    <p className={`text-xs font-bold ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                        {filteredMenu.length} item{filteredMenu.length !== 1 ? 's' : ''} found
                    </p>
                    {isVegOnly && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-2 py-0.5 rounded-md">
                            <Leaf size={10} /> Veg Only
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {error ? (
                        <div className={`text-center py-16 rounded-3xl border-2 border-dashed p-8 ${theme === 'dark' ? 'bg-red-950/50 border-red-900/50' : 'bg-red-50 border-red-100'}`}>
                            <div className={`inline-flex p-4 rounded-2xl mb-3 ${theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100'}`}>
                                <UtensilsCrossed size={28} className="text-red-400" />
                            </div>
                            <p className="text-red-500 font-black mb-1 dark:text-red-300">Connection Failed</p>
                            <p className="text-xs text-red-400 mb-4">Couldn't load the menu</p>
                            <button onClick={fetchMenu} className="bg-red-500 text-white px-6 py-2.5 rounded-xl font-black text-sm hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all active:scale-95">
                                Retry
                            </button>
                        </div>
                    ) : filteredMenu.length === 0 ? (
                        <div className={`flex flex-col items-center justify-center py-16 rounded-3xl border-2 border-dashed ${theme === 'dark' ? 'border-stone-800 bg-stone-900/30' : 'border-stone-200 bg-stone-50/50'}`}>
                            <div className={`p-5 rounded-2xl mb-3 ${theme === 'dark' ? 'bg-stone-800 text-stone-600' : 'bg-white text-stone-300 shadow-sm'}`}>
                                <Search size={32} />
                            </div>
                            <p className={`font-black text-sm ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>No items found</p>
                            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-stone-600' : 'text-stone-400'}`}>Try a different search or category</p>
                        </div>
                    ) : (
                        filteredMenu.map((item, index) => {
                            const qty = getItemQty(item.id);
                            const isFav = favorites.some(fav => fav.id === item.id);
                            const gradient = FOOD_GRADIENTS[index % FOOD_GRADIENTS.length];
                            const emoji = FOOD_EMOJIS[index % FOOD_EMOJIS.length];

                            // Check if stall is open (default to true if loading/unknown to avoid blocking)
                            const isStallOpen = shopStatuses[item.stallName?.toLowerCase()] !== false;
                            const isAvailable = item.available && isStallOpen;

                            return (
                                <div
                                    key={item.id}
                                    className={`group relative rounded-[24px] border overflow-hidden transition-all duration-300 ${theme === 'dark'
                                        ? 'bg-stone-900 border-stone-800 hover:border-stone-700'
                                        : 'bg-white border-stone-100 shadow-sm hover:shadow-lg hover:border-stone-200'
                                        } ${!isAvailable ? 'opacity-60' : ''}`}
                                >
                                    <div className="flex gap-0">
                                        {/* Image / Placeholder */}
                                        <div className="relative w-[120px] min-h-[130px] flex-shrink-0">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
                                                    {/* Background pattern */}
                                                    <div className="absolute inset-0 opacity-20">
                                                        <div className="absolute top-2 left-2 rotate-12">
                                                            <UtensilsCrossed size={20} className="text-white" />
                                                        </div>
                                                        <div className="absolute bottom-2 right-2 -rotate-12">
                                                            <ChefHat size={18} className="text-white" />
                                                        </div>
                                                    </div>
                                                    <span className="text-4xl z-10 drop-shadow-lg">{emoji}</span>
                                                </div>
                                            )}

                                            {/* Veg/Non-Veg badge - top left */}
                                            <div className={`absolute top-2.5 left-2.5 p-1 rounded-lg backdrop-blur-md ${theme === 'dark' ? 'bg-stone-900/80' : 'bg-white/90 shadow-sm'}`}>
                                                <div className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center ${item.veg ? 'border-green-600' : 'border-red-600'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${item.veg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                                </div>
                                            </div>

                                            {/* Favorite button overlay */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleFavorite(item); }}
                                                className={`absolute top-2.5 right-2.5 p-1.5 rounded-xl backdrop-blur-md transition-all active:scale-90 ${isFav
                                                    ? 'bg-red-500/20 text-red-500'
                                                    : (theme === 'dark' ? 'bg-stone-900/60 text-white/60 hover:text-red-400' : 'bg-white/80 text-stone-400 hover:text-red-400 shadow-sm')
                                                    }`}
                                            >
                                                <Heart size={14} className={isFav ? 'fill-red-500' : ''} />
                                            </button>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 p-4 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                                    <h3 className={`font-black text-[15px] leading-tight line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                                        {item.name}
                                                    </h3>
                                                </div>

                                                {/* Tags row */}
                                                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                                                    {isAvailable ? (
                                                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wide ${theme === 'dark' ? 'bg-green-900/25 text-green-400' : 'bg-green-50 text-green-600'}`}>
                                                            <Sparkles size={8} /> In Stock
                                                        </span>
                                                    ) : (
                                                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wide ${theme === 'dark' ? 'bg-red-900/25 text-red-400' : 'bg-red-50 text-red-500'}`}>
                                                            {!isStallOpen ? 'Kitchen Closed' : 'Sold Out'}
                                                        </span>
                                                    )}
                                                    {item.averageRating > 0 && (
                                                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-black ${theme === 'dark' ? 'bg-amber-900/25 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
                                                            <Star size={8} fill="currentColor" /> {item.averageRating.toFixed(1)}
                                                            <span className="opacity-60">({item.totalRatings})</span>
                                                        </span>
                                                    )}
                                                    {item.specialInstructions && (
                                                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold ${theme === 'dark' ? 'bg-stone-800 text-stone-400' : 'bg-stone-100 text-stone-400'}`}>
                                                            ✍️ Notes
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Price + Cart Controls */}
                                            <div className="flex items-center justify-between mt-auto">
                                                <div>
                                                    <span className={`font-black text-xl ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                                        ₹{item.price}
                                                    </span>
                                                </div>

                                                {isAvailable ? (
                                                    qty > 0 ? (
                                                        <div className={`flex items-center gap-0 rounded-2xl overflow-hidden border ${theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
                                                            <button
                                                                onClick={() => removeFromCart(item.id)}
                                                                className={`w-9 h-9 flex items-center justify-center active:scale-90 transition-all ${theme === 'dark' ? 'text-stone-300 hover:bg-stone-700' : 'text-stone-600 hover:bg-stone-100'}`}
                                                            >
                                                                <Minus size={14} strokeWidth={3} />
                                                            </button>
                                                            <span className={`font-black text-sm w-7 text-center ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>{qty}</span>
                                                            <button
                                                                onClick={() => addToCart(item)}
                                                                className="w-9 h-9 flex items-center justify-center bg-brand-500 text-white active:scale-90 transition-all hover:bg-brand-600"
                                                            >
                                                                <Plus size={14} strokeWidth={3} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => addToCart(item)}
                                                            className={`group/btn flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-black text-xs transition-all active:scale-95 shadow-lg ${theme === 'dark'
                                                                ? 'bg-brand-500 text-white shadow-brand-500/20 hover:bg-brand-600'
                                                                : 'bg-stone-900 text-white shadow-stone-900/15 hover:bg-stone-800'
                                                                }`}
                                                        >
                                                            <Plus size={14} strokeWidth={3} className="transition-transform group-hover/btn:rotate-90" />
                                                            ADD
                                                        </button>
                                                    )
                                                ) : (
                                                    <span className={`px-4 py-2.5 rounded-2xl text-xs font-black ${theme === 'dark' ? 'bg-stone-800 text-stone-600' : 'bg-stone-100 text-stone-400'}`}>
                                                        Unavailable
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuPage;
