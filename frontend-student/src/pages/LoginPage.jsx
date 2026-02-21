import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChefHat, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true); // Toggle state
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:9999/auth/send-otp', { phoneNumber });
            // Pass the mode (isLogin) implicitly by what data we send? 
            // Actually AuthController just checks if name is present.
            // If isLogin is true, we send ONLY phone (name is empty string).
            // If isLogin is false, we send ALL details.
            const stateData = isLogin
                ? { phoneNumber }
                : { phoneNumber, name, registrationNumber };

            navigate('/otp', { state: stateData });
        } catch (error) {
            alert('Failed to send OTP. Is the backend running?');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex flex-col items-center justify-center p-6 transition-colors duration-300">
            <div className="bg-white dark:bg-stone-800 p-8 rounded-[40px] shadow-xl w-full max-w-sm text-center transition-colors duration-300">
                <div className="w-20 h-20 bg-brand-50 dark:bg-stone-700/50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-600 dark:text-brand-400">
                    <ChefHat size={40} />
                </div>

                {/* Toggle Tabs */}
                <div className="flex bg-stone-100 dark:bg-stone-700/50 rounded-2xl p-1 mb-8 transition-colors duration-300">
                    <button
                        className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${isLogin ? 'bg-white dark:bg-stone-600 shadow-sm text-stone-900 dark:text-white' : 'text-stone-400 dark:text-stone-500'}`}
                        onClick={() => setIsLogin(true)}
                    >
                        LOGIN
                    </button>
                    <button
                        className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${!isLogin ? 'bg-white dark:bg-stone-600 shadow-sm text-stone-900 dark:text-white' : 'text-stone-400 dark:text-stone-500'}`}
                        onClick={() => setIsLogin(false)}
                    >
                        SIGN UP
                    </button>
                </div>

                <h1 className="text-2xl font-black text-stone-900 dark:text-white mb-2 transition-colors duration-300">
                    {isLogin ? 'Welcome Back!' : 'Join Campus Crave'}
                </h1>
                <p className="text-stone-400 dark:text-stone-500 font-medium mb-8 transition-colors duration-300">
                    {isLogin ? 'Enter your mobile number to login' : 'Create your student account'}
                </p>

                <form onSubmit={handleSendOtp} className="space-y-4">
                    {!isLogin && (
                        <>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Full Name"
                                className="w-full bg-stone-50 dark:bg-stone-900 border-2 border-stone-100 dark:border-stone-700 rounded-2xl px-6 py-4 font-bold text-lg text-center dark:text-white focus:outline-none focus:border-brand-500 dark:focus:border-brand-500 placeholder:text-stone-400 dark:placeholder:text-stone-600 transition-colors"
                                required
                            />
                            <input
                                type="text"
                                value={registrationNumber}
                                onChange={(e) => setRegistrationNumber(e.target.value)}
                                placeholder="Registration Number"
                                className="w-full bg-stone-50 dark:bg-stone-900 border-2 border-stone-100 dark:border-stone-700 rounded-2xl px-6 py-4 font-bold text-lg text-center dark:text-white focus:outline-none focus:border-brand-500 dark:focus:border-brand-500 placeholder:text-stone-400 dark:placeholder:text-stone-600 transition-colors"
                                required
                            />
                        </>
                    )}
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Mobile Number"
                        className="w-full bg-stone-50 dark:bg-stone-900 border-2 border-stone-100 dark:border-stone-700 rounded-2xl px-6 py-4 font-bold text-lg text-center dark:text-white focus:outline-none focus:border-brand-500 dark:focus:border-brand-500 placeholder:text-stone-400 dark:placeholder:text-stone-600 transition-colors"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-600 dark:bg-brand-500 text-white rounded-2xl py-4 font-black text-lg shadow-lg shadow-brand-200 dark:shadow-none active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? 'Sending...' : <>Get OTP <ArrowRight size={20} /></>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
