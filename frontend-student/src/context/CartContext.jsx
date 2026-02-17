import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cc_cart');
        return saved ? JSON.parse(saved) : [];
    });

    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('cc_favorites');
        return saved ? JSON.parse(saved) : [];
    });
    const [conflictItem, setConflictItem] = useState(null);

    useEffect(() => {
        localStorage.setItem('cc_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('cc_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const resolveConflict = () => {
        if (conflictItem) {
            setCart([{ ...conflictItem, quantity: 1 }]);
            setConflictItem(null);
        }
    };

    const cancelConflict = () => {
        setConflictItem(null);
    };

    const addToCart = (item) => {
        setCart(prev => {
            // 1. Check if cart has items from a different stall
            if (prev.length > 0) {
                const currentStall = prev[0].stallName;
                // Use optional chaining and fallback to handle potential missing data, though backend should provide it
                const newStall = item.stallName;

                if (currentStall && newStall && currentStall !== newStall) {
                    // 2. Trigger Modal instead of window.confirm
                    setConflictItem(item);
                    return prev; // Cancel immediate add
                }
            }

            // Normal add logic
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId) => {
        setCart(prev => prev.filter(i => i.id !== itemId).map(i =>
            i.id === itemId ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i
        ).filter(i => i.quantity > 0));
    };

    const updateCartItem = (itemId, updates) => {
        setCart(prev => prev.map(i => i.id === itemId ? { ...i, ...updates } : i));
    };

    const clearCart = () => setCart([]);

    const toggleFavorite = (itemId) => {
        setFavorites(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateCartItem, clearCart,
            totalItems, totalPrice, favorites, toggleFavorite,
            conflictItem, resolveConflict, cancelConflict
        }}>
            {children}
        </CartContext.Provider>
    );
};
