import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Plus, Trash2, Home, Building } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const AddressBookPage = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [addresses, setAddresses] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [newAddr, setNewAddr] = useState({ label: 'Home', block: '', room: '' });

    useEffect(() => {
        const stored = localStorage.getItem('cc_addresses');
        if (stored) {
            setAddresses(JSON.parse(stored));
        } else {
            const mockAddr = [
                { id: 1, label: 'Hostel', block: 'Block 34 (Main Cafeteria)', room: '304' },
                { id: 2, label: 'Department', block: 'Block 38 (CSE)', room: 'Lab 2' },
            ];
            setAddresses(mockAddr);
            localStorage.setItem('cc_addresses', JSON.stringify(mockAddr));
        }
    }, []);

    const handleAdd = (e) => {
        e.preventDefault();
        const addr = { id: Date.now(), ...newAddr };
        const updated = [...addresses, addr];
        setAddresses(updated);
        localStorage.setItem('cc_addresses', JSON.stringify(updated));
        setShowAdd(false);
        setNewAddr({ label: 'Home', block: '', room: '' });
    };

    const removeAddress = (id) => {
        const updated = addresses.filter(a => a.id !== id);
        setAddresses(updated);
        localStorage.setItem('cc_addresses', JSON.stringify(updated));
    };

    return (
        <div className={`min-h-screen relative transition-colors duration-700 overflow-hidden ${theme === 'dark' ? 'bg-[#0c0a09]' : 'bg-[#fafaf9]'}`}>
            <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[130px] opacity-[0.1] bg-gradient-to-tr ${theme === 'dark' ? 'from-emerald-600 to-teal-600' : 'from-emerald-400 to-teal-400'}`}></div>

            <header className="px-6 pt-12 pb-6 relative z-10 max-w-6xl mx-auto flex items-center gap-6">
                <button
                    onClick={() => navigate(-1)}
                    className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all active:scale-95 border backdrop-blur-xl ${theme === 'dark' ? 'bg-stone-900/60 text-white border-stone-800' : 'bg-white text-stone-900 border-white shadow-sm'}`}
                >
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h1 className={`text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>Address Book</h1>
                    <p className={`text-[11px] font-black uppercase tracking-widest mt-1 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>Manage Locations</p>
                </div>
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    className={`ml-auto w-14 h-14 rounded-[22px] flex items-center justify-center transition-all active:scale-95 border ${theme === 'dark' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}
                >
                    <Plus size={24} />
                </button>
            </header>

            <div className="px-6 py-4 max-w-6xl mx-auto relative z-10">
                {showAdd && (
                    <form onSubmit={handleAdd} className={`mb-8 p-6 rounded-[32px] border animate-in slide-in-from-top-4 ${theme === 'dark' ? 'bg-stone-900/60 border-stone-800' : 'bg-white border-stone-100 shadow-lg'}`}>
                        <div className="grid gap-4">
                            <input
                                placeholder="Label (e.g. Hostel, Lab)"
                                value={newAddr.label}
                                onChange={e => setNewAddr({ ...newAddr, label: e.target.value })}
                                className={`w-full p-4 rounded-xl font-bold bg-transparent border-2 ${theme === 'dark' ? 'border-stone-700 text-white focus:border-emerald-500' : 'border-stone-100 text-stone-900 focus:border-emerald-500'} outline-none`}
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="Block / Building"
                                    value={newAddr.block}
                                    onChange={e => setNewAddr({ ...newAddr, block: e.target.value })}
                                    className={`w-full p-4 rounded-xl font-bold bg-transparent border-2 ${theme === 'dark' ? 'border-stone-700 text-white focus:border-emerald-500' : 'border-stone-100 text-stone-900 focus:border-emerald-500'} outline-none`}
                                    required
                                />
                                <input
                                    placeholder="Room / Lab No."
                                    value={newAddr.room}
                                    onChange={e => setNewAddr({ ...newAddr, room: e.target.value })}
                                    className={`w-full p-4 rounded-xl font-bold bg-transparent border-2 ${theme === 'dark' ? 'border-stone-700 text-white focus:border-emerald-500' : 'border-stone-100 text-stone-900 focus:border-emerald-500'} outline-none`}
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full py-4 rounded-xl bg-emerald-500 text-white font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                                Save Address
                            </button>
                        </div>
                    </form>
                )}

                <div className="grid gap-4">
                    {addresses.map(addr => (
                        <div key={addr.id} className={`p-6 rounded-[32px] border flex items-center gap-5 transition-all ${theme === 'dark' ? 'bg-stone-900/40 border-stone-800' : 'bg-white border-white shadow-sm'}`}>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-50 text-emerald-600'}`}>
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h3 className={`font-black text-lg ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>{addr.label}</h3>
                                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>{addr.block}, {addr.room}</p>
                            </div>
                            <button onClick={() => removeAddress(addr.id)} className={`ml-auto p-3 rounded-xl transition-colors ${theme === 'dark' ? 'bg-stone-800 text-stone-500 hover:text-red-400' : 'bg-stone-100 text-stone-400 hover:text-red-500'}`}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AddressBookPage;
