import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Toast = ({ message, type = 'error', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!message) return null;

    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';

    return (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
            <div className={`flex items-center gap-3 px-6 py-3 rounded-full text-white font-bold shadow-xl ${bgColor}`}>
                <span>{message}</span>
                <button onClick={onClose} className="hover:text-red-200 transition-colors">
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

export default Toast;