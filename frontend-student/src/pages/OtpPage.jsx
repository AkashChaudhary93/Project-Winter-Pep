import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';

const OtpPage = () => {
    const [otp, setOtp] = useState('');
    const { state } = useLocation();
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:9999/auth/verify-otp', {
                phoneNumber: state.phoneNumber,
                otp,
                name: state.name,
                registrationNumber: state.registrationNumber
            });

            if (res.data.success) {
                login(res.data.user);
                navigate('/home');
            } else {
                alert(res.data.message || 'Invalid OTP');
                if (res.data.message?.includes('Sign Up')) {
                    navigate('/login'); // Redirect to allow signup
                }
            }
        } catch (error) {
            alert('Verification failed');
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6">
            <div className="bg-white p-8 rounded-[40px] shadow-xl w-full max-w-sm text-center">
                <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-600">
                    <Lock size={40} />
                </div>
                <h1 className="text-2xl font-black text-stone-900 mb-2">Verify OTP</h1>
                <p className="text-stone-400 font-medium mb-8">Check your backend console for the code</p>

                <form onSubmit={handleVerify} className="space-y-4">
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 4-digit code"
                        maxLength="4"
                        className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl px-6 py-4 font-black text-2xl text-center tracking-[0.5em] focus:outline-none focus:border-brand-500 transition-colors"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="w-full bg-brand-600 text-white rounded-2xl py-4 font-black text-lg shadow-lg shadow-brand-200 active:scale-95 transition-all"
                    >
                        Verify & Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OtpPage;
