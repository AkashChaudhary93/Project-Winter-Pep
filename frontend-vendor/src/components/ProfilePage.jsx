import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ChefHat, Store, MapPin, Phone, LogOut, Save, X, User, TrendingUp, Star, Clock } from 'lucide-react';
import axios from 'axios';

const BLOCKS = [
    "Block 34 (Main Cafeteria)",
    "Block 33 (Food Court)",
    "Block 34 (Oven Express)",
    "BH 1 (Boys Hostel 1)",
    "BH 2 (Boys Hostel 2)",
    "BH 3 (Boys Hostel 3)",
    "GH 1 (Girls Hostel 1)",
    "GH 2 (Girls Hostel 2)",
    "Uni-Mall (Food Street)",
    "M-Block (Engineering Canteen)"
];

const ProfilePage = () => {
    const { user, login, logout } = useAuth();
    const { theme } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: user.name || '',
        shopName: user.shopName || '',
        block: user.block || '',
        phoneNumber: user.phoneNumber || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:9999'}/users/${user.id}`, {
                name: formData.name,
                shopName: formData.shopName,
                block: formData.block
            });

            if (res.data.success) {
                // Update local auth state with new user object
                login(res.data.user);
                setIsEditing(false);
            } else {
                alert("Failed to update profile");
            }
        } catch (error) {
            console.error("Update failed", error);
            alert("Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div className={`p-4 rounded-2xl border flex items-center gap-4 transition-all hover:scale-[1.02] ${theme === 'dark' ? 'bg-stone-800/50 border-stone-800' : 'bg-white border-stone-100 shadow-sm'}`}>
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon size={20} />
            </div>
            <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>{label}</p>
                <p className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>{value}</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-8">
            {/* Header Section with Cover */}
            <div className="relative mb-20"> {/* Increased margin to 5rem to accommodate the hanging avatar */}
                <div className={`h-48 w-full rounded-3xl overflow-hidden ${theme === 'dark' ? 'bg-stone-800' : 'bg-stone-200'}`}>
                    <div className="w-full h-full bg-gradient-to-r from-brand-600 to-orange-400 opacity-90 relative">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                    </div>
                </div>

                <div className="absolute -bottom-12 left-8 right-8 flex items-end justify-between">
                    <div className="flex items-end gap-6">
                        <div className={`w-36 h-36 rounded-3xl border-4 flex items-center justify-center text-5xl font-black shadow-2xl ${theme === 'dark' ? 'bg-stone-900 border-stone-900 text-white' : 'bg-white border-white text-brand-600'}`}>
                            {user.name ? user.name.charAt(0).toUpperCase() : <ChefHat size={48} />}
                        </div>
                        <div className="mb-4">
                            <h1 className={`text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>{user.shopName}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-sm font-bold opacity-70 ${theme === 'dark' ? 'text-stone-300' : 'text-stone-500'}`}>{user.block}</span>
                                {user.phoneNumber && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-600"></span>
                                        <span className={`text-sm font-bold opacity-70 ${theme === 'dark' ? 'text-stone-300' : 'text-stone-500'}`}>{user.phoneNumber}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className={`px-6 py-3 rounded-xl font-black flex items-center gap-2 shadow-lg transition-all hover:-translate-y-1 active:scale-95 ${theme === 'dark' ? 'bg-white text-stone-900 hover:bg-stone-200' : 'bg-stone-900 text-white hover:bg-stone-800'}`}
                            >
                                <User size={18} /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 px-4">

                {/* Left Column: Stats */}
                <div className="space-y-4">
                    <h3 className={`font-bold text-sm uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Overview</h3>
                    <StatCard icon={TrendingUp} label="Total Orders" value="1,280" color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
                    <StatCard icon={Star} label="Rating" value="4.8/5" color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" />
                    <StatCard icon={Clock} label="Avg Prep Time" value="12m" color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
                </div>

                {/* Right Column: Details Form */}
                <div className="md:col-span-2 space-y-8">
                    <div className={`p-8 rounded-3xl border transition-all ${theme === 'dark' ? 'bg-stone-900/50 border-stone-800' : 'bg-white border-stone-100 shadow-xl shadow-stone-200/50'}`}>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>Restaurant Details</h2>
                            {isEditing && <span className="text-xs font-bold text-brand-500 animate-pulse">EDITING MODE</span>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name Input */}
                            <div className="space-y-2">
                                <label className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Owner Name</label>
                                {isEditing ? (
                                    <div className={`flex items-center gap-3 p-4 rounded-2xl border transition-all focus-within:ring-2 focus-within:ring-brand-500 ${theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
                                        <User size={18} className="text-stone-400" />
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full font-bold text-stone-900 dark:text-white"
                                        />
                                    </div>
                                ) : (
                                    <p className={`text-lg font-bold p-2 ${theme === 'dark' ? 'text-white' : 'text-stone-800'}`}>{user.name}</p>
                                )}
                            </div>

                            {/* Shop Name Input */}
                            <div className="space-y-2">
                                <label className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Shop Name</label>
                                {isEditing ? (
                                    <div className={`flex items-center gap-3 p-4 rounded-2xl border transition-all focus-within:ring-2 focus-within:ring-brand-500 ${theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
                                        <Store size={18} className="text-stone-400" />
                                        <input
                                            name="shopName"
                                            value={formData.shopName}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full font-bold text-stone-900 dark:text-white"
                                        />
                                    </div>
                                ) : (
                                    <p className={`text-lg font-bold p-2 ${theme === 'dark' ? 'text-white' : 'text-stone-800'}`}>{user.shopName}</p>
                                )}
                            </div>

                            {/* Location Input */}
                            <div className="space-y-2 md:col-span-2">
                                <label className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Location</label>
                                {isEditing ? (
                                    <div className={`relative flex items-center gap-3 p-4 rounded-2xl border transition-all focus-within:ring-2 focus-within:ring-brand-500 ${theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
                                        <MapPin size={18} className="text-stone-400" />
                                        <select
                                            name="block"
                                            value={formData.block}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full font-bold appearance-none cursor-pointer text-stone-900 dark:text-white"
                                        >
                                            {BLOCKS.map(b => (
                                                <option key={b} value={b} className="text-stone-900 bg-white dark:text-white dark:bg-stone-800">{b}</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <div className={`flex items-center gap-2 p-2`}>
                                        <MapPin size={18} className="text-brand-500" />
                                        <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-stone-800'}`}>{user.block}</p>
                                    </div>
                                )}
                            </div>

                            {/* Phone (Read Only) */}
                            <div className="space-y-2 md:col-span-2">
                                <label className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Contact Number</label>
                                <div className={`flex items-center gap-3 p-4 rounded-2xl border opacity-60 ${theme === 'dark' ? 'bg-stone-800/50 border-stone-800' : 'bg-stone-50 border-stone-100'}`}>
                                    <Phone size={18} className="text-stone-400" />
                                    <p className={`font-bold ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>{user.phoneNumber}</p>
                                    <span className="ml-auto text-xs font-bold bg-stone-200 text-stone-600 px-2 py-1 rounded dark:bg-stone-700 dark:text-stone-400">Verified</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex gap-4 mt-8 pt-8 border-t dark:border-stone-800">
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex-1 h-12 bg-brand-600 text-white rounded-xl font-black shadow-lg shadow-brand-200 flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-brand-700 dark:shadow-none"
                                >
                                    <Save size={18} /> Save Changes
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            name: user.name,
                                            shopName: user.shopName,
                                            block: user.block,
                                            phoneNumber: user.phoneNumber
                                        });
                                    }}
                                    className={`flex-1 h-12 rounded-xl font-black flex items-center justify-center gap-2 active:scale-95 transition-all ${theme === 'dark' ? 'bg-stone-800 text-stone-400 hover:text-white' : 'bg-stone-100 text-stone-500 hover:text-stone-900'}`}
                                >
                                    <X size={18} /> Cancel
                                </button>
                            </div>
                        )}

                        {!isEditing && (
                            <div className="mt-8 pt-8 border-t dark:border-stone-800">
                                <button
                                    onClick={logout}
                                    className="w-full h-12 border-2 border-red-100 text-red-600 rounded-xl font-black flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20"
                                >
                                    <LogOut size={18} /> Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
