import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ChefHat,
    ToggleLeft,
    ToggleRight,
    Plus,
    X,
    Search,
    Trash2,
    MoreVertical,
    Utensils,
    Coffee,
    Cookie,
    IceCream,
    Sun,
    Info,
    AlertCircle,
    SquareSlash
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:9999/menu';

const MenuManager = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    // New Item Form State
    const [newItem, setNewItem] = useState({
        name: '',
        price: '',
        category: 'Main Course',
        veg: true,
        image: ''
    });

    useEffect(() => {
        if (user?.shopName) {
            fetchMenu();
        }
    }, [user]);

    const fetchMenu = async () => {
        try {
            const res = await axios.get(`${API_URL}?stallName=${encodeURIComponent(user.shopName)}`);
            setMenuItems(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching menu:", error);
            setLoading(false);
        }
    };

    const toggleStock = async (id) => {
        setMenuItems(prev => prev.map(item =>
            item.id === id ? { ...item, available: !item.available } : item
        ));

        try {
            await axios.put(`${API_URL}/${id}/toggle-stock`);
        } catch (error) {
            console.error("Error toggling stock:", error);
            fetchMenu();
        }
    };

    const deleteItem = async (id) => {
        if (!window.confirm("Delete this dish forever?")) return;

        try {
            await axios.delete(`${API_URL}/${id}`);
            setMenuItems(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error("Error deleting item:", error);
            alert("Failed to delete item");
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.price) return;

        const payload = {
            ...newItem,
            price: parseFloat(newItem.price),
            available: true,
            location: user.block,
            stallName: user.shopName,
            category: newItem.category
        };

        try {
            await axios.post(API_URL, payload);
            setIsModalOpen(false);
            setNewItem({ name: '', price: '', category: 'Main Course', veg: true, image: '' });
            fetchMenu();
        } catch (error) {
            console.error("Error adding item:", error);
            alert("Failed to add item");
        }
    };

    const categories = ['All', 'Main Course', 'Snacks', 'Beverages', 'Dessert', 'Breakfast'];

    const filteredItems = menuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'All' ||
            (item.category && item.category.toLowerCase() === activeFilter.toLowerCase());
        return matchesSearch && matchesFilter;
    });

    const getCategoryIcon = (cat) => {
        switch (cat) {
            case 'Main Course': return <Utensils size={18} />;
            case 'Snacks': return <Cookie size={18} />;
            case 'Beverages': return <Coffee size={18} />;
            case 'Dessert': return <IceCream size={18} />;
            case 'Breakfast': return <Sun size={18} />;
            default: return <ChefHat size={18} />;
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20">
            <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-stone-500 font-bold animate-pulse">Prepping your menu...</p>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ── Header & Action Bar ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h2 className={`text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                        My Menu
                    </h2>
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                        Manage products, prices and stock availability
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-4 rounded-2xl font-black shadow-xl shadow-brand-500/20 transition-all active:scale-95 group"
                >
                    <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>Create New Dish</span>
                </button>
            </div>

            {/* ── Filters & Search Bar ── */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <div className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-stone-900/50 border-stone-800' : 'bg-white border-stone-100 shadow-sm'
                    }`}>
                    <Search size={20} className="text-stone-400" />
                    <input
                        type="text"
                        placeholder="Search your items..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="bg-transparent outline-none w-full font-bold text-sm placeholder:text-stone-400"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === cat
                                ? (theme === 'dark' ? 'bg-stone-700 text-white shadow-lg' : 'bg-stone-900 text-white shadow-lg')
                                : (theme === 'dark' ? 'bg-stone-900/50 text-stone-500 border border-stone-800 hover:text-stone-300' : 'bg-white text-stone-400 border border-stone-50 shadow-sm hover:text-stone-600')
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Menu Grid ── */}
            {filteredItems.length === 0 ? (
                <div className={`p-20 text-center rounded-[40px] border-2 border-dashed transition-all ${theme === 'dark' ? 'border-stone-800 bg-stone-900/20' : 'border-stone-100 bg-stone-50'
                    }`}>
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 ${theme === 'dark' ? 'bg-stone-800 text-stone-600' : 'bg-white text-stone-200 shadow-xl shadow-stone-200/50'
                        }`}>
                        <SquareSlash size={40} />
                    </div>
                    <h3 className={`text-xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                        {searchTerm ? 'No matches found' : 'Menu is empty'}
                    </h3>
                    <p className={`text-sm font-medium max-w-xs mx-auto ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                        {searchTerm ? "Couldn't find any dishes with that name." : "Start by adding your first signature dish to the menu."}
                    </p>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="mt-6 text-brand-500 font-black text-sm uppercase tracking-widest hover:underline"
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className={`group relative p-6 rounded-[36px] border transition-all duration-500 overflow-hidden hover:-translate-y-2 ${theme === 'dark'
                                ? 'bg-stone-900/60 backdrop-blur-xl border-stone-800 hover:border-brand-500/50 hover:bg-stone-800/80 shadow-lg shadow-black/20'
                                : 'bg-white/80 backdrop-blur-xl border-white/50 shadow-lg shadow-stone-200/50 hover:shadow-2xl hover:shadow-brand-500/10 hover:border-brand-200'
                                } ${!item.available ? 'opacity-60 grayscale-[0.8]' : ''}`}
                        >
                            {/* Card Background Decoration */}
                            <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[60px] opacity-20 transition-all group-hover:opacity-40 group-hover:scale-125 ${item.category === 'Dessert' ? 'bg-pink-500' :
                                item.category === 'Beverages' ? 'bg-blue-500' :
                                    item.veg ? 'bg-green-500' : 'bg-orange-500'
                                }`}></div>

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-transform duration-500 group-hover:rotate-6 ${theme === 'dark' ? 'bg-stone-800 text-white shadow-inner border border-stone-700' : 'bg-white text-brand-600 shadow-xl shadow-stone-200/50'
                                    }`}>
                                    {getCategoryIcon(item.category)}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleStock(item.id)}
                                        className={`transition-all duration-300 hover:scale-110 active:scale-90 ${item.available ? 'text-brand-500 drop-shadow-lg' : 'text-stone-300 dark:text-stone-700'}`}
                                        title={item.available ? "Mark Out of Stock" : "Mark In Stock"}
                                    >
                                        {item.available ? <ToggleRight size={48} className="drop-shadow-md" /> : <ToggleLeft size={48} />}
                                    </button>
                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        className={`p-3 rounded-2xl transition-all duration-300 ${theme === 'dark'
                                            ? 'bg-stone-800/50 text-stone-600 hover:bg-red-500/20 hover:text-red-400'
                                            : 'bg-stone-50 text-stone-400 hover:bg-red-50 hover:text-red-500'
                                            }`}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="relative z-10">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${item.veg
                                        ? 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400'
                                        : 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400'
                                        }`}>
                                        {item.veg ? 'Pure Veg' : 'Non-Veg'}
                                    </span>
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${theme === 'dark'
                                        ? 'bg-stone-800 text-stone-400 border-stone-700'
                                        : 'bg-stone-100 text-stone-500 border-stone-200'
                                        }`}>
                                        {item.category}
                                    </span>
                                </div>

                                <h3 className={`text-2xl font-black mb-1 truncate leading-tight group-hover:text-brand-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                    {item.name}
                                </h3>
                                <div className={`h-1 w-12 rounded-full mb-6 transition-all duration-500 group-hover:w-full ${theme === 'dark' ? 'bg-stone-800 group-hover:bg-brand-500' : 'bg-stone-100 group-hover:bg-brand-500'}`}></div>

                                <div className={`flex items-center justify-between p-4 rounded-[20px] transition-colors ${theme === 'dark' ? 'bg-stone-900 border border-stone-800 group-hover:border-brand-500/30' : 'bg-stone-50 border border-stone-100 group-hover:bg-white group-hover:shadow-lg'}`}>
                                    <div className="flex flex-col">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Price</span>
                                        <span className={`text-2xl font-black tracking-tighter ${theme === 'dark' ? 'text-brand-400' : 'text-brand-600'}`}>
                                            ₹{item.price}
                                        </span>
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${item.available
                                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                        : 'bg-stone-200 text-stone-500 dark:bg-stone-800 dark:text-stone-600'
                                        }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-white animate-pulse' : 'bg-stone-400'}`}></div>
                                        {item.available ? 'In Stock' : 'sold out'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Add Item Modal Redesigned ── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className={`w-full max-w-lg rounded-[48px] p-8 shadow-2xl relative overflow-hidden transition-all scale-100 animate-in zoom-in-95 duration-300 ${theme === 'dark' ? 'bg-stone-900 border border-stone-800' : 'bg-white'
                        }`}>
                        {/* Modal Background Decor */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-brand-500/10 to-transparent pointer-events-none"></div>

                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <div>
                                <h3 className={`text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>Create Dish</h3>
                                <p className="text-xs font-bold text-brand-500 uppercase tracking-widest mt-1">Add to your shop menu</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className={`p-4 rounded-[20px] transition-all duration-300 hover:rotate-90 active:scale-90 ${theme === 'dark' ? 'bg-stone-800 text-stone-500 hover:text-white' : 'bg-stone-100 text-stone-400 hover:text-stone-900'
                                    }`}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAddItem} className="space-y-6 relative z-10">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className={`block text-[10px] font-black uppercase tracking-widest mb-3 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                                        Dish Name
                                    </label>
                                    <div className={`flex items-center gap-3 p-1.5 rounded-[24px] border-2 transition-all duration-300 group ${theme === 'dark'
                                        ? 'bg-stone-800/50 border-stone-800 focus-within:border-brand-500 focus-within:bg-stone-800'
                                        : 'bg-stone-50 border-stone-100 focus-within:bg-white focus-within:border-brand-500 focus-within:shadow-xl focus-within:shadow-brand-500/10'
                                        }`}>
                                        <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center ml-1 transition-colors ${theme === 'dark' ? 'bg-stone-700 group-focus-within:bg-brand-500 text-white' : 'bg-white group-focus-within:bg-brand-500 text-stone-400 group-focus-within:text-white shadow-sm'}`}>
                                            <Utensils size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Special Grilled Sandwich"
                                            value={newItem.name}
                                            onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                            className="w-full bg-transparent px-2 py-3 font-bold text-sm outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-[10px] font-black uppercase tracking-widest mb-3 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                                        Price (₹)
                                    </label>
                                    <div className={`flex items-center gap-2 p-1.5 rounded-[24px] border-2 transition-all duration-300 group ${theme === 'dark'
                                        ? 'bg-stone-800/50 border-stone-800 focus-within:border-brand-500 focus-within:bg-stone-800'
                                        : 'bg-stone-50 border-stone-100 focus-within:bg-white focus-within:border-brand-500 focus-within:shadow-xl focus-within:shadow-brand-500/10'
                                        }`}>
                                        <div className="pl-4 font-black text-brand-500">₹</div>
                                        <input
                                            type="number"
                                            required
                                            placeholder="99"
                                            value={newItem.price}
                                            onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                            className="w-full bg-transparent p-3 font-black text-lg outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-[10px] font-black uppercase tracking-widest mb-3 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                                        Dietary Type
                                    </label>
                                    <div className={`flex items-center rounded-[24px] border-2 transition-all overflow-hidden p-1 ${theme === 'dark' ? 'bg-stone-800 border-stone-800' : 'bg-stone-50 border-stone-100'
                                        }`}>
                                        <button
                                            type="button"
                                            onClick={() => setNewItem({ ...newItem, veg: true })}
                                            className={`flex-1 py-3.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${newItem.veg
                                                ? 'bg-green-500 text-white shadow-lg'
                                                : (theme === 'dark' ? 'text-stone-500 hover:text-stone-300' : 'text-stone-400 hover:text-stone-600')
                                                }`}
                                        >
                                            Veg
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setNewItem({ ...newItem, veg: false })}
                                            className={`flex-1 py-3.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${!newItem.veg
                                                ? 'bg-red-500 text-white shadow-lg'
                                                : (theme === 'dark' ? 'text-stone-500 hover:text-stone-300' : 'text-stone-400 hover:text-stone-600')
                                                }`}
                                        >
                                            Non-Veg
                                        </button>
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <label className={`block text-[10px] font-black uppercase tracking-widest mb-3 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                                        Category
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.filter(c => c !== 'All').map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setNewItem({ ...newItem, category: cat })}
                                                className={`px-4 py-3 rounded-[16px] text-[10px] font-black uppercase tracking-wider transition-all duration-300 border-2 active:scale-95 ${newItem.category === cat
                                                    ? 'bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/30'
                                                    : (theme === 'dark' ? 'bg-stone-800 border-stone-800 text-stone-500 hover:border-stone-600 hover:text-stone-300' : 'bg-white border-stone-100 text-stone-400 hover:border-brand-200 hover:text-brand-600')
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-brand-500 hover:bg-brand-600 text-white p-5 rounded-[28px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-brand-500/30 transition-all active:scale-[0.98] hover:shadow-brand-500/50 mt-4 flex items-center justify-center gap-2 group"
                            >
                                <Plus size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                                Publish to Menu
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuManager;
