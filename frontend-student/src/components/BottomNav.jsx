import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const BottomNav = () => {
    const { cart } = useCart();
    const { theme } = useTheme();
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div
            className="fixed bottom-0 left-0 right-0 border-t border-stone-100 px-6 py-4 flex justify-between items-center z-50 max-w-md mx-auto shadow-[0_-4px_20px_rgb(0,0,0,0.02)] transition-colors"
            style={{
                backgroundColor: theme === 'dark' ? '#1c1917' : '#ffffff',
                borderColor: theme === 'dark' ? '#292524' : '#f5f5f4'
            }}
        >
            <NavLink to="/home" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-brand-600' : (theme === 'dark' ? 'text-white' : 'text-black')}`}>
                {({ isActive }) => (
                    <>
                        <Home size={24} strokeWidth={isActive ? 3 : 2} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
                    </>
                )}
            </NavLink>

            <NavLink to="/orders" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-brand-600' : (theme === 'dark' ? 'text-white' : 'text-black')}`}>
                {({ isActive }) => (
                    <>
                        <ShoppingBag size={24} strokeWidth={isActive ? 3 : 2} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Orders</span>
                    </>
                )}
            </NavLink>

            <NavLink to="/cart" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors relative ${isActive ? 'text-brand-600' : (theme === 'dark' ? 'text-white' : 'text-black')}`}>
                {({ isActive }) => (
                    <>
                        <div className="relative">
                            <ShoppingCart size={24} strokeWidth={isActive ? 3 : 2} />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm">
                                    {itemCount}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Cart</span>
                    </>
                )}
            </NavLink>

            <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-brand-600' : (theme === 'dark' ? 'text-white' : 'text-black')}`}>
                {({ isActive }) => (
                    <>
                        <User size={24} strokeWidth={isActive ? 3 : 2} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
                    </>
                )}
            </NavLink>
        </div>
    );
};

export default BottomNav;
