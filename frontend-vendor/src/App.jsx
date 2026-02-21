import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import OrderCard from './components/OrderCard';
import MenuManager from './components/MenuManager';
import OrderHistory from './components/OrderHistory';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import Reviews from './components/Reviews';
import { ChefHat, List, History, BarChart3, ClipboardList, Coffee, ShoppingBag, LayoutGrid, MessageSquare } from 'lucide-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:9999'}/orders`;
const SHOP_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:9999'}/shop`;

const AppContent = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [prevOrderCount, setPrevOrderCount] = useState(0);
    const [activeTab, setActiveTab] = useState('live'); // live, menu, history, stats
    const [viewMode, setViewMode] = useState('board'); // 'board', 'list'
    const [isShopOpen, setIsShopOpen] = useState(true);
    const { theme } = useTheme();
    const [selectedSection, setSelectedSection] = useState(null); // 'NEW', 'PROGRESS', 'READY'

    const [notifications, setNotifications] = useState([]);
    const { user } = useAuth();

    // Sound alert logic
    const audioCtxRef = React.useRef(null);

    const initAudio = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
    };

    const playOrderSound = () => {
        try {
            if (!audioCtxRef.current) initAudio();
            const ctx = audioCtxRef.current;

            // Nice "Ding-Dong" sound
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();

            osc1.connect(gain1);
            gain1.connect(ctx.destination);

            // First tone (Ding)
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(880, ctx.currentTime);
            osc1.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);

            gain1.gain.setValueAtTime(0.3, ctx.currentTime);
            gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

            osc1.start();
            osc1.stop(ctx.currentTime + 0.5);

            // Second tone (Dong) - slightly delayed
            setTimeout(() => {
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.connect(gain2);
                gain2.connect(ctx.destination);

                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(660, ctx.currentTime);
                osc2.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.1);

                gain2.gain.setValueAtTime(0.3, ctx.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

                osc2.start();
                osc2.stop(ctx.currentTime + 0.6);
            }, 100);

        } catch (e) {
            console.error("Audio play failed", e);
        }
    };

    // Fetch Shop Status
    useEffect(() => {
        if (user?.shopName) {
            axios.get(`${SHOP_URL}/status?stallName=${encodeURIComponent(user.shopName)}`)
                .then(res => setIsShopOpen(res.data.isOpen))
                .catch(err => console.error("Error fetching shop status:", err));
        }
    }, [user]);

    const toggleShop = async () => {
        try {
            if (!user?.shopName) return;
            const res = await axios.post(`${SHOP_URL}/toggle`, { stallName: user.shopName });
            setIsShopOpen(res.data.isOpen);
        } catch (error) {
            console.error("Error toggling shop status:", error);
            alert("Failed to toggle shop status");
        }
    };

    // Poll for live orders every 5 seconds
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Fetch orders for the specific logged-in shop
                const shopName = user?.shopName;

                if (!shopName) {
                    console.warn("DEBUG: User object:", user);
                    console.warn("DEBUG: No shopName found in user object. Aborting fetch.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${API_URL}/live?stallName=${encodeURIComponent(shopName)}`);
                const sortedOrders = response.data.sort((a, b) => b.id - a.id);


                // If count increased, play sound
                if (sortedOrders.length > prevOrderCount) {
                    playOrderSound();

                    // Add notification if not initial load (assuming initial load sets count from 0)
                    // We check if prevOrderCount is 0, which implies first load. 
                    // However, to be safe, we can check if loading is false (which it is after first run)
                    // But loading state is set inside this function.
                    // Let's use a simple check: if prevOrderCount > 0, it's definitely an update.
                    // If prevOrderCount is 0, it might be first load OR it might be 0 orders becoming 1.
                    // A better way is to rely on 'loading' state which we toggle off after first fetch.

                    // Actually, let's just add it if it's not the very first fetch.
                    // We can use the fact that prevOrderCount is 0 initially.
                    // But if we start with 0 orders and get 1, notification should notify.
                    // If we start with 5 orders, we don't want 5 notifications.

                    // Let's rely on `loading` state which is initialized to true.
                    // Inside this useEffect, `loading` will be true on the very first execution of `fetchOrders` (before setLoading(false)).
                    // Wait, `loading` state from closure is `true` initially.
                    // So if `loading` is true, we skip notification.
                    // But `loading` is set to false at line 109.
                    // So subsequent intervals will see `loading` as false (if we added it to deps, but we didn't).

                    // Actually, since `fetchOrders` is defined INSIDE useEffect, it captures the initial `loading` state (true) and never updates?
                    // No, `loading` is not in dependency array, so `fetchOrders` is recreated? 
                    // No, `fetchOrders` is inside useEffect. `useEffect` depends on `[prevOrderCount, activeTab]`.
                    // So when `prevOrderCount` updates, `useEffect` re-runs, and `fetchOrders` is recreated with new closure.
                    // So `loading` will be the CURRENT state value.

                    if (!loading) {
                        const diff = sortedOrders.length - prevOrderCount;
                        const newNotifs = Array.from({ length: diff }, (_, i) => ({
                            id: Date.now() + i,
                            text: `New order received! Order #${sortedOrders[i].id}`,
                            time: new Date(),
                            read: false
                        }));
                        setNotifications(prev => [...newNotifs, ...prev]);
                    }
                }

                setOrders(sortedOrders);
                setPrevOrderCount(sortedOrders.length);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setLoading(false);
            }
        };

        if (activeTab === 'live') {
            fetchOrders();
            const interval = setInterval(fetchOrders, 2000);
            return () => clearInterval(interval);
        }
    }, [prevOrderCount, activeTab, loading]); // Added loading to deps

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
            await axios.patch(`${API_URL}/${id}/status?status=${newStatus}`);
            if (newStatus === 'COMPLETED' || newStatus === 'REJECTED') {
                setOrders(prev => prev.filter(o => o.id !== id));
                setPrevOrderCount(prev => prev - 1);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    // Called after verify-pickup succeeds (order already completed on backend)
    const handlePickupVerified = (id) => {
        setOrders(prev => prev.filter(o => o.id !== id));
        setPrevOrderCount(prev => prev - 1);
    };

    return (
        <div
            onClick={initAudio}
            onTouchStart={initAudio}
            className="min-h-screen font-sans antialiased pb-28 md:pb-20 transition-colors duration-300 relative selection:bg-brand-500/30"
            style={{ backgroundColor: theme === 'dark' ? '#1c1917' : '#fafaf9', color: theme === 'dark' ? '#ffffff' : '#1c1917' }}
        >
            {/* Background Atmosphere */}
            {/* ── Dynamic Mesh Gradient Background ── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-20 animate-blob mix-blend-screen ${theme === 'dark' ? 'bg-brand-600' : 'bg-brand-400'}`}></div>
                <div className={`absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 animate-blob-reverse mix-blend-screen ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-400'}`} style={{ animationDelay: '2s' }}></div>
                <div className={`absolute top-[30%] left-[40%] w-[400px] h-[400px] rounded-full blur-[80px] opacity-10 animate-pulse mix-blend-screen ${theme === 'dark' ? 'bg-purple-600' : 'bg-purple-400'}`} style={{ animationDelay: '4s' }}></div>
            </div>
            <Header
                activeOrderCount={orders.length}
                isShopOpen={isShopOpen}
                onToggleShop={toggleShop}
                onNavigate={setActiveTab}
                notifications={notifications}
                setNotifications={setNotifications}
            />

            {/* ── Floating Glass Dock Navigation ── */}
            <div className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md animate-in slide-in-from-bottom-10 fade-in duration-700">
                <div className={`flex items-center justify-between gap-1 p-1.5 md:p-2 rounded-[24px] shadow-2xl transition-all duration-300 backdrop-blur-xl border overflow-x-auto no-scrollbar ${theme === 'dark' ? 'bg-stone-900/80 border-stone-800/50 shadow-black/50' : 'bg-white/80 border-white/50 shadow-stone-200/50'}`}>
                    {[
                        { id: 'live', icon: ChefHat, label: 'Kitchen', color: 'text-orange-500', activeBg: 'bg-orange-500', activeShadow: 'shadow-orange-500/30' },
                        { id: 'menu', icon: List, label: 'Menu', color: 'text-blue-500', activeBg: 'bg-blue-500', activeShadow: 'shadow-blue-500/30' },
                        { id: 'history', icon: History, label: 'History', color: 'text-purple-500', activeBg: 'bg-purple-500', activeShadow: 'shadow-purple-500/30' },
                        { id: 'stats', icon: BarChart3, label: 'Insights', color: 'text-green-500', activeBg: 'bg-green-500', activeShadow: 'shadow-green-500/30' },
                        { id: 'reviews', icon: MessageSquare, label: 'Feedback', color: 'text-yellow-500', activeBg: 'bg-yellow-500', activeShadow: 'shadow-yellow-500/30' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative flex-1 group flex flex-col items-center justify-center min-w-[60px] md:min-w-[72px] h-14 md:h-16 rounded-[18px] transition-all duration-300 ${activeTab === tab.id
                                ? `${tab.activeBg} text-white shadow-lg ${tab.activeShadow} scale-105 -translate-y-1`
                                : 'text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-600 dark:hover:text-stone-300'
                                }`}
                        >
                            <tab.icon size={20} className={`mb-1 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                            <span className="text-[9px] font-black uppercase tracking-wider opacity-90">{tab.label}</span>

                            {/* Active Indicator Dot (Only shown on hover for non-active) */}
                            {activeTab !== tab.id && (
                                <span className={`absolute bottom-[-4px] w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'dark' ? 'bg-white' : 'bg-stone-900'}`}></span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <main className="px-4 md:px-6 max-w-7xl mx-auto pt-8">
                {activeTab === 'live' && (
                    loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-brand-500"></div>
                        </div>
                    ) : (
                        <>
                            {/* ── Elite Quick Stats ── */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-6 pt-4 md:pt-0 mb-6 md:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className={`px-5 py-4 md:p-6 rounded-[28px] md:rounded-[32px] border relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-500 ${theme === 'dark' ? 'bg-stone-900/40 border-stone-800/80 hover:shadow-[0_8px_30px_rgb(249,115,22,0.1)]' : 'bg-white/60 backdrop-blur-md border-white/80 hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] shadow-[0_2px_10px_rgb(0,0,0,0.02)]'}`}>
                                    <div className={`absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-orange-500 to-amber-400 opacity-80 group-hover:opacity-100 transition-opacity`}></div>
                                    <div className="flex justify-between items-start relative z-10 pt-1 md:pt-2 gap-2">
                                        <div className="min-w-0">
                                            <p className={`text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] mb-0.5 md:mb-2 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Pending</p>
                                            <h3 className={`text-3xl md:text-4xl font-black tabular-nums tracking-tight leading-none ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>{orders.filter(o => o.status === 'PENDING').length}</h3>
                                        </div>
                                        <div className={`p-2.5 md:p-3.5 rounded-2xl flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 ${theme === 'dark' ? 'bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20' : 'bg-orange-50 text-orange-500 ring-1 ring-orange-100'}`}>
                                            <ClipboardList size={22} strokeWidth={2.5} className="w-5 h-5 md:w-[22px] md:h-[22px]" />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                                </div>

                                <div className={`px-5 py-4 md:p-6 rounded-[28px] md:rounded-[32px] border relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-500 ${theme === 'dark' ? 'bg-stone-900/40 border-stone-800/80 hover:shadow-[0_8px_30px_rgb(59,130,246,0.1)]' : 'bg-white/60 backdrop-blur-md border-white/80 hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] shadow-[0_2px_10px_rgb(0,0,0,0.02)]'}`}>
                                    <div className={`absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-blue-500 to-indigo-400 opacity-80 group-hover:opacity-100 transition-opacity`}></div>
                                    <div className="flex justify-between items-start relative z-10 pt-1 md:pt-2 gap-2">
                                        <div className="min-w-0">
                                            <p className={`text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] mb-0.5 md:mb-2 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Cooking</p>
                                            <h3 className={`text-3xl md:text-4xl font-black tabular-nums tracking-tight leading-none ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>{orders.filter(o => ['ACCEPTED', 'COOKING'].includes(o.status)).length}</h3>
                                        </div>
                                        <div className={`p-2.5 md:p-3.5 rounded-2xl flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 ${theme === 'dark' ? 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20' : 'bg-blue-50 text-blue-500 ring-1 ring-blue-100'}`}>
                                            <ChefHat size={22} strokeWidth={2.5} className="w-5 h-5 md:w-[22px] md:h-[22px]" />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                                </div>

                                <div className={`px-5 py-4 md:p-6 rounded-[28px] md:rounded-[32px] border relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-500 ${theme === 'dark' ? 'bg-stone-900/40 border-stone-800/80 hover:shadow-[0_8px_30px_rgb(34,197,94,0.1)]' : 'bg-white/60 backdrop-blur-md border-white/80 hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] shadow-[0_2px_10px_rgb(0,0,0,0.02)]'}`}>
                                    <div className={`absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-green-500 to-emerald-400 opacity-80 group-hover:opacity-100 transition-opacity`}></div>
                                    <div className="flex justify-between items-start relative z-10 pt-1 md:pt-2 gap-2">
                                        <div className="min-w-0">
                                            <p className={`text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] mb-0.5 md:mb-2 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Ready</p>
                                            <h3 className={`text-3xl md:text-4xl font-black tabular-nums tracking-tight leading-none ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>{orders.filter(o => o.status === 'READY').length}</h3>
                                        </div>
                                        <div className={`p-2.5 md:p-3.5 rounded-2xl flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 ${theme === 'dark' ? 'bg-green-500/10 text-green-400 ring-1 ring-green-500/20' : 'bg-green-50 text-green-500 ring-1 ring-green-100'}`}>
                                            <ShoppingBag size={22} strokeWidth={2.5} className="w-5 h-5 md:w-[22px] md:h-[22px]" />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                                </div>

                                <div className={`p-1.5 md:p-2 rounded-[28px] md:rounded-[32px] border ${theme === 'dark' ? 'bg-stone-900/40 border-stone-800/80 shadow-[0_4px_20px_rgb(0,0,0,0.1)]' : 'bg-white/60 backdrop-blur-md border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'} flex items-stretch gap-1.5 md:gap-2`}>
                                    <button
                                        onClick={() => setViewMode('board')}
                                        className={`flex-1 rounded-[24px] flex py-3 md:py-0 flex-col items-center justify-center gap-1.5 md:gap-2 transition-all duration-500 ${viewMode === 'board'
                                            ? (theme === 'dark' ? 'bg-stone-800 text-white shadow-md ring-1 ring-stone-700' : 'bg-white text-stone-900 shadow-[0_4px_20px_rgb(0,0,0,0.06)] ring-1 ring-stone-100/50')
                                            : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-black/5 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        <LayoutGrid size={22} strokeWidth={viewMode === 'board' ? 2.5 : 2} className="w-5 h-5 md:w-[22px] md:h-[22px]" />
                                        <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest">Board</span>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`flex-1 rounded-[24px] flex py-3 md:py-0 flex-col items-center justify-center gap-1.5 md:gap-2 transition-all duration-500 ${viewMode === 'list'
                                            ? (theme === 'dark' ? 'bg-stone-800 text-white shadow-md ring-1 ring-stone-700' : 'bg-white text-stone-900 shadow-[0_4px_20px_rgb(0,0,0,0.06)] ring-1 ring-stone-100/50')
                                            : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-black/5 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        <List size={22} strokeWidth={viewMode === 'list' ? 2.5 : 2} className="w-5 h-5 md:w-[22px] md:h-[22px]" />
                                        <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest">List</span>
                                    </button>
                                </div>
                            </div>

                            {viewMode === 'board' ? (
                                <div className={`grid gap-8 transition-all duration-500 ease-in-out ${selectedSection ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>

                                    {/* ── New Orders Column ── */}
                                    {(!selectedSection || selectedSection === 'NEW') && (
                                        <div className="flex flex-col gap-6 h-full">
                                            <div
                                                onClick={() => setSelectedSection(selectedSection === 'NEW' ? null : 'NEW')}
                                                className={`relative overflow-hidden flex items-center justify-between p-5 rounded-[28px] cursor-pointer transition-all duration-500 group
                                                ${theme === 'dark' ? 'bg-stone-900/40 border border-stone-800 hover:bg-stone-800/50' : 'bg-white/50 border border-white hover:bg-white/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]'} backdrop-blur-xl
                                                ${selectedSection === 'NEW' ? 'ring-2 ring-orange-400/50 shadow-[0_0_30px_rgba(249,115,22,0.1)]' : ''}`}
                                            >
                                                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-400 opacity-80`}></div>
                                                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                                                <div className="flex items-center gap-4 z-10">
                                                    <div className={`p-3.5 rounded-[18px] transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 ${theme === 'dark' ? 'bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20' : 'bg-orange-50 text-orange-500 ring-1 ring-orange-100'}`}>
                                                        <ClipboardList size={20} strokeWidth={2.5} />
                                                    </div>
                                                    <div>
                                                        <h2 className={`font-black text-xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>New Orders</h2>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                                                            <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Awaiting Action</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl tabular-nums transition-all group-hover:scale-110 ${theme === 'dark' ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20' : 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200'}`}>
                                                    {orders.filter(o => o.status === 'PENDING').length}
                                                </div>
                                            </div>

                                            <div className="space-y-4 min-h-[250px] md:min-h-[400px]">
                                                {orders.filter(o => o.status === 'PENDING').map(order => (
                                                    <OrderCard key={order.id} order={order} onStatusUpdate={handleStatusUpdate} onPickupVerified={handlePickupVerified} />
                                                ))}
                                                {orders.filter(o => o.status === 'PENDING').length === 0 && (
                                                    <div className={`flex flex-col items-center justify-center p-6 md:p-8 min-h-[200px] md:min-h-[300px] rounded-[32px] border transition-all duration-500 ${theme === 'dark' ? 'border-stone-800/30 bg-stone-900/10' : 'border-stone-100/50 bg-stone-50/20 backdrop-blur-sm'}`}>
                                                        <div className={`relative p-5 rounded-[24px] mb-4 ${theme === 'dark' ? 'bg-stone-800/30' : 'bg-white shadow-[0_4px_20px_rgb(0,0,0,0.02)]'}`}>
                                                            <div className="absolute inset-0 bg-orange-500/5 rounded-[24px] blur-md"></div>
                                                            <ClipboardList size={32} className={`relative z-10 w-8 h-8 md:w-10 md:h-10 ${theme === 'dark' ? 'text-stone-600' : 'text-stone-300'}`} />
                                                        </div>
                                                        <p className={`font-black text-xs md:text-sm tracking-wide ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>No new orders</p>
                                                        <p className={`text-[10px] md:text-[11px] mt-1.5 font-medium tracking-wider uppercase ${theme === 'dark' ? 'text-stone-700' : 'text-stone-400/70'}`}>Orders will appear here</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* ── In Progress Column ── */}
                                    {(!selectedSection || selectedSection === 'PROGRESS') && (
                                        <div className="flex flex-col gap-6 h-full">
                                            <div
                                                onClick={() => setSelectedSection(selectedSection === 'PROGRESS' ? null : 'PROGRESS')}
                                                className={`relative overflow-hidden flex items-center justify-between p-5 rounded-[28px] cursor-pointer transition-all duration-500 group
                                                ${theme === 'dark' ? 'bg-stone-900/40 border border-stone-800 hover:bg-stone-800/50' : 'bg-white/50 border border-white hover:bg-white/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]'} backdrop-blur-xl
                                                ${selectedSection === 'PROGRESS' ? 'ring-2 ring-blue-400/50 shadow-[0_0_30px_rgba(59,130,246,0.1)]' : ''}`}
                                            >
                                                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-400 opacity-80`}></div>
                                                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                                                <div className="flex items-center gap-4 z-10">
                                                    <div className={`p-3.5 rounded-[18px] transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 ${theme === 'dark' ? 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20' : 'bg-blue-50 text-blue-500 ring-1 ring-blue-100'}`}>
                                                        <ChefHat size={20} strokeWidth={2.5} />
                                                    </div>
                                                    <div>
                                                        <h2 className={`font-black text-xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>In Kitchen</h2>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                                            <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Cooking Now</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl tabular-nums transition-all group-hover:scale-110 ${theme === 'dark' ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20' : 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-200'}`}>
                                                    {orders.filter(o => ['ACCEPTED', 'COOKING'].includes(o.status)).length}
                                                </div>
                                            </div>

                                            <div className="space-y-4 min-h-[250px] md:min-h-[400px]">
                                                {orders.filter(o => ['ACCEPTED', 'COOKING'].includes(o.status)).map(order => (
                                                    <OrderCard key={order.id} order={order} onStatusUpdate={handleStatusUpdate} onPickupVerified={handlePickupVerified} />
                                                ))}
                                                {orders.filter(o => ['ACCEPTED', 'COOKING'].includes(o.status)).length === 0 && (
                                                    <div className={`flex flex-col items-center justify-center p-6 md:p-8 min-h-[200px] md:min-h-[300px] rounded-[32px] border transition-all duration-500 ${theme === 'dark' ? 'border-stone-800/30 bg-stone-900/10' : 'border-stone-100/50 bg-stone-50/20 backdrop-blur-sm'}`}>
                                                        <div className={`relative p-5 rounded-[24px] mb-4 ${theme === 'dark' ? 'bg-stone-800/30' : 'bg-white shadow-[0_4px_20px_rgb(0,0,0,0.02)]'}`}>
                                                            <div className="absolute inset-0 bg-blue-500/5 rounded-[24px] blur-md"></div>
                                                            <ChefHat size={32} className={`relative z-10 w-8 h-8 md:w-10 md:h-10 ${theme === 'dark' ? 'text-stone-600' : 'text-stone-300'}`} />
                                                        </div>
                                                        <p className={`font-black text-xs md:text-sm tracking-wide ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Kitchen idle</p>
                                                        <p className={`text-[10px] md:text-[11px] mt-1.5 font-medium tracking-wider uppercase ${theme === 'dark' ? 'text-stone-700' : 'text-stone-400/70'}`}>Cooking orders appear here</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* ── Ready Column ── */}
                                    {(!selectedSection || selectedSection === 'READY') && (
                                        <div className="flex flex-col gap-6 h-full">
                                            <div
                                                onClick={() => setSelectedSection(selectedSection === 'READY' ? null : 'READY')}
                                                className={`relative overflow-hidden flex items-center justify-between p-5 rounded-[28px] cursor-pointer transition-all duration-500 group
                                                ${theme === 'dark' ? 'bg-stone-900/40 border border-stone-800 hover:bg-stone-800/50' : 'bg-white/50 border border-white hover:bg-white/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]'} backdrop-blur-xl
                                                ${selectedSection === 'READY' ? 'ring-2 ring-green-400/50 shadow-[0_0_30px_rgba(34,197,94,0.1)]' : ''}`}
                                            >
                                                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400 opacity-80`}></div>
                                                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                                                <div className="flex items-center gap-4 z-10">
                                                    <div className={`p-3.5 rounded-[18px] transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 ${theme === 'dark' ? 'bg-green-500/10 text-green-400 ring-1 ring-green-500/20' : 'bg-green-50 text-green-500 ring-1 ring-green-100'}`}>
                                                        <ShoppingBag size={20} strokeWidth={2.5} />
                                                    </div>
                                                    <div>
                                                        <h2 className={`font-black text-xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>Ready</h2>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                                            <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>For Pickup</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl tabular-nums transition-all group-hover:scale-110 ${theme === 'dark' ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20' : 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200'}`}>
                                                    {orders.filter(o => o.status === 'READY').length}
                                                </div>
                                            </div>

                                            <div className="space-y-4 min-h-[250px] md:min-h-[400px]">
                                                {orders.filter(o => o.status === 'READY').map(order => (
                                                    <OrderCard key={order.id} order={order} onStatusUpdate={handleStatusUpdate} onPickupVerified={handlePickupVerified} />
                                                ))}
                                                {orders.filter(o => o.status === 'READY').length === 0 && (
                                                    <div className={`flex flex-col items-center justify-center p-6 md:p-8 min-h-[200px] md:min-h-[300px] rounded-[32px] border transition-all duration-500 ${theme === 'dark' ? 'border-stone-800/30 bg-stone-900/10' : 'border-stone-100/50 bg-stone-50/20 backdrop-blur-sm'}`}>
                                                        <div className={`relative p-5 rounded-[24px] mb-4 ${theme === 'dark' ? 'bg-stone-800/30' : 'bg-white shadow-[0_4px_20px_rgb(0,0,0,0.02)]'}`}>
                                                            <div className="absolute inset-0 bg-green-500/5 rounded-[24px] blur-md"></div>
                                                            <ShoppingBag size={32} className={`relative z-10 w-8 h-8 md:w-10 md:h-10 ${theme === 'dark' ? 'text-stone-600' : 'text-stone-300'}`} />
                                                        </div>
                                                        <p className={`font-black text-xs md:text-sm tracking-wide ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>All picked up</p>
                                                        <p className={`text-[10px] md:text-[11px] mt-1.5 font-medium tracking-wider uppercase ${theme === 'dark' ? 'text-stone-700' : 'text-stone-400/70'}`}>Ready orders appear here</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className={`rounded-3xl border overflow-hidden ${theme === 'dark' ? 'bg-stone-900/50 border-stone-800' : 'bg-white border-stone-100 shadow-xl'}`}>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className={`border-b ${theme === 'dark' ? 'border-stone-800 bg-stone-900' : 'border-stone-100 bg-gradient-to-r from-stone-50 to-stone-50/50'}`}>
                                                <tr>
                                                    <th className={`px-6 py-4 text-left text-[11px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Order</th>
                                                    <th className={`px-6 py-4 text-left text-[11px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Items</th>
                                                    <th className={`px-6 py-4 text-left text-[11px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Total</th>
                                                    <th className={`px-6 py-4 text-left text-[11px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Status</th>
                                                    <th className={`px-6 py-4 text-right text-[11px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className={`divide-y ${theme === 'dark' ? 'divide-stone-800/50' : 'divide-stone-100'}`}>
                                                {orders.filter(o => ['PENDING', 'ACCEPTED', 'COOKING', 'READY'].includes(o.status)).length === 0 ? (
                                                    <tr>
                                                        <td colSpan="5" className="px-6 py-16 text-center">
                                                            <div className="flex flex-col items-center">
                                                                <div className={`p-4 rounded-2xl mb-3 ${theme === 'dark' ? 'bg-stone-800 text-stone-600' : 'bg-stone-50 text-stone-300'}`}>
                                                                    <List size={28} />
                                                                </div>
                                                                <p className={`font-black text-sm ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>No active orders</p>
                                                                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-stone-600' : 'text-stone-400'}`}>Orders will appear here</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    orders.filter(o => ['PENDING', 'ACCEPTED', 'COOKING', 'READY'].includes(o.status)).map(order => (
                                                        <tr key={order.id} className={`group ${theme === 'dark' ? 'hover:bg-stone-800/50' : 'hover:bg-stone-50/80'} transition-all duration-200`}>
                                                            <td className={`px-6 py-4`}>
                                                                <span className={`inline-flex items-center gap-1.5 font-mono font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                                                    <span className={`w-2 h-2 rounded-full ${order.status === 'PENDING' ? 'bg-orange-500' : order.status === 'READY' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                                                                    #{order.id}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex flex-col gap-0.5">
                                                                    {order.items.map((item, idx) => (
                                                                        <span key={idx} className={`text-sm font-medium ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'}`}>
                                                                            <span className={`font-black ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>{item.quantity}×</span> {item.name}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </td>
                                                            <td className={`px-6 py-4 font-black ${theme === 'dark' ? 'text-brand-400' : 'text-brand-600'}`}>
                                                                ₹{order.totalAmount}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 ${order.status === 'PENDING' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                                                                    order.status === 'READY' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                                                        'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                                                    }`}>
                                                                    {order.status === 'PENDING' && <ClipboardList size={12} />}
                                                                    {order.status === 'ACCEPTED' && <ChefHat size={12} />}
                                                                    {order.status === 'COOKING' && <ChefHat size={12} />}
                                                                    {order.status === 'READY' && <ShoppingBag size={12} />}
                                                                    {order.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    {order.status === 'PENDING' && (
                                                                        <>
                                                                            <button onClick={() => handleStatusUpdate(order.id, 'ACCEPTED')} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-black hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95">Accept</button>
                                                                            <button onClick={() => handleStatusUpdate(order.id, 'REJECTED')} className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-black hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors">Reject</button>
                                                                        </>
                                                                    )}
                                                                    {order.status === 'ACCEPTED' && (
                                                                        <button onClick={() => handleStatusUpdate(order.id, 'COOKING')} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-black hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95">🔥 Start Cooking</button>
                                                                    )}
                                                                    {order.status === 'COOKING' && (
                                                                        <button onClick={() => handleStatusUpdate(order.id, 'READY')} className="px-4 py-2 rounded-xl bg-green-600 text-white text-xs font-black hover:bg-green-700 shadow-lg shadow-green-500/20 transition-all active:scale-95">✅ Mark Ready</button>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )
                )}

                {activeTab === 'menu' && <MenuManager />}
                {activeTab === 'history' && <OrderHistory />}
                {activeTab === 'stats' && <AnalyticsDashboard />}
                {activeTab === 'reviews' && <Reviews />}
                {activeTab === 'profile' && <ProfilePage />}
            </main>
        </div>
    );
};



const ProtectedApp = () => {
    const { user, loading } = useAuth();

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#fafaf9] dark:bg-[#1c1917]"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-brand-500"></div></div>;

    if (!user) return <LoginPage />;

    return <AppContent />;
};

const App = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <ProtectedApp />
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App;
