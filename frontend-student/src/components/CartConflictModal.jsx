import React from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { AlertTriangle } from 'lucide-react';

const CartConflictModal = () => {
    const { conflictItem, resolveConflict, cancelConflict, cart } = useCart();
    const { theme } = useTheme();

    if (!conflictItem) return null;

    const currentStall = cart.length > 0 ? cart[0].stallName : 'Unknown';
    const newStall = conflictItem.stallName;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div
                className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl transform transition-all scale-100 ${theme === 'dark' ? 'bg-stone-900 border border-stone-800 text-white' : 'bg-white text-stone-900'
                    }`}
            >
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-8 h-8 text-orange-500" />
                    </div>

                    <h3 className="text-xl font-bold mb-2">Start a new order?</h3>

                    <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                        Your cart contains items from <span className="font-semibold text-orange-500">{currentStall}</span>.
                        Starting an order from <span className="font-semibold text-orange-500">{newStall}</span> will clear your current cart.
                    </p>

                    <div className="flex w-full gap-3">
                        <button
                            onClick={cancelConflict}
                            className={`flex-1 py-3 rounded-xl font-medium transition-colors ${theme === 'dark'
                                ? 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                                }`}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={resolveConflict}
                            className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02]"
                        >
                            Start New Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartConflictModal;
