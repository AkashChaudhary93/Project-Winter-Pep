import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, User, LogOut, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
    const { cart } = useCart();
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const navItems = [
        { to: '/home', icon: Home, label: 'Home' },
        { to: '/orders', icon: ShoppingBag, label: 'Orders' },
        { to: '/cart', icon: ShoppingCart, label: 'Cart', badge: itemCount },
        { to: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <div className={`hidden md:flex flex-col w-72 h-screen fixed left-0 top-0 border-r transition-colors z-50 ${theme === 'dark' ? 'bg-[#1c1917] border-stone-800' : 'bg-white border-dashed border-stone-200'
            }`}>
            {/* Logo Area */}
            <div className={`p-8 mb-2 flex items-center gap-3 ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 transform -rotate-6">
                    <span className="font-black text-xl">C</span>
                </div>
                <div>
                    <h1 className="text-xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-stone-800 to-stone-600 dark:from-white dark:to-stone-400">
                        Campus<span className="text-brand-500">Crave</span>
                    </h1>
                    <p className="text-[10px] font-bold text-stone-400 tracking-widest uppercase">Student Portal</p>
                </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-6 space-y-3 overflow-y-auto scrollbar-hide py-2">
                <p className={`text-[10px] font-black uppercase tracking-widest mb-4 px-4 ${theme === 'dark' ? 'text-stone-600' : 'text-stone-300'}`}>
                    Menu
                </p>
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group relative border-2
                            ${isActive
                                ? 'bg-brand-500 text-white shadow-xl shadow-brand-500/20 border-brand-500'
                                : (theme === 'dark'
                                    ? 'text-stone-400 border-transparent hover:bg-stone-800 hover:text-white'
                                    : 'text-stone-500 border-transparent hover:bg-stone-50 hover:text-stone-900')
                            }
                        `}
                    >
                        <div className="relative">
                            <item.icon size={20} strokeWidth={2.5} className={`transition-transform duration-300 ${!item.isActive && 'group-hover:scale-110'}`} />
                            {item.badge > 0 && (
                                <span className={`absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold shadow-sm ${theme === 'dark' ? 'bg-red-500 text-white' : 'bg-red-500 text-white'
                                    }`}>
                                    {item.badge}
                                </span>
                            )}
                        </div>
                        <span className="font-bold text-sm tracking-wide">{item.label}</span>

                        {/* Active Indicator Dot */}
                        {/* {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50"></div>} */}
                    </NavLink>
                ))}
            </nav>

            {/* Footer / Logout */}
            <div className="p-6">
                <div className={`p-1 rounded-3xl border ${theme === 'dark' ? 'bg-stone-900 border-stone-800' : 'bg-stone-50 border-stone-100'}`}>
                    <button
                        onClick={toggleTheme}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all mb-1 ${theme === 'dark'
                                ? 'bg-stone-800 text-white shadow-sm'
                                : 'hover:bg-white hover:shadow-sm text-stone-500'
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-stone-700' : 'bg-white shadow-sm text-stone-900'}`}>
                            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                        </div>
                        <span className="font-bold text-xs flex-1 text-left">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>

                    <button
                        onClick={logout}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group ${theme === 'dark'
                                ? 'hover:bg-red-900/20 text-stone-400 hover:text-red-400'
                                : 'hover:bg-red-50 text-stone-500 hover:text-red-500'
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-stone-800 group-hover:bg-red-900/30' : 'bg-white shadow-sm group-hover:bg-red-100 group-hover:text-red-500'}`}>
                            <LogOut size={14} />
                        </div>
                        <span className="font-bold text-xs flex-1 text-left">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
