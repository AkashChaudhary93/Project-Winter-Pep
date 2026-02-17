import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { Star, MessageSquare, ThumbsUp, Calendar, User } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:9999/orders/history';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const { user } = useAuth();

    useEffect(() => {
        if (user?.shopName) {
            fetchReviews();
        }
    }, [user]);

    const fetchReviews = async () => {
        try {
            const shopName = user?.shopName;
            if (!shopName) return;

            const res = await axios.get(`${API_URL}?stallName=${encodeURIComponent(shopName)}`);
            // Filter only orders that have a rating
            const ratedOrders = res.data.filter(order => order.rating && order.rating > 0);
            setReviews(ratedOrders.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)));
            setLoading(false);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setLoading(false);
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : 0;

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20">
            <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-stone-500 font-bold animate-pulse uppercase tracking-widest text-xs">Loading feedback...</p>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            {/* ── Header & Summary ── */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className={`flex-1 p-8 rounded-[40px] border relative overflow-hidden ${theme === 'dark' ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-100 shadow-sm'
                    }`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full translate-x-10 -translate-y-10 blur-2xl"></div>

                    <div className="relative z-10 flex items-center gap-6">
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl font-black ${theme === 'dark' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-500'
                            }`}>
                            {averageRating}
                        </div>
                        <div>
                            <h2 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                Customer Rating
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={16}
                                            fill={star <= Math.round(averageRating) ? "currentColor" : "none"}
                                            className={star <= Math.round(averageRating) ? "text-yellow-400" : "text-stone-300 dark:text-stone-700"}
                                        />
                                    ))}
                                </div>
                                <span className={`text-sm font-bold ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                                    Based on {reviews.length} reviews
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`p-8 rounded-[40px] border flex-1 flex items-center justify-between ${theme === 'dark' ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-100 shadow-sm'
                    }`}>
                    <div>
                        <p className={`text-xs font-black uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                            Feedback Volume
                        </p>
                        <h3 className={`text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                            {reviews.length}
                        </h3>
                        <p className={`text-xs font-bold mt-2 text-green-500 flex items-center gap-1`}>
                            <ThumbsUp size={12} /> Positive Sentiment
                        </p>
                    </div>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-stone-800 text-stone-600' : 'bg-stone-50 text-stone-300'
                        }`}>
                        <MessageSquare size={32} />
                    </div>
                </div>
            </div>

            {/* ── Reviews Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.length === 0 ? (
                    <div className="col-span-2 py-20 text-center">
                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 ${theme === 'dark' ? 'bg-stone-800 text-stone-700' : 'bg-stone-50 text-stone-200'
                            }`}>
                            <Star size={32} />
                        </div>
                        <h3 className={`text-lg font-black ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                            No reviews yet
                        </h3>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-stone-600' : 'text-stone-500'}`}>
                            Wait for customers to rate their orders!
                        </p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className={`p-6 rounded-[32px] border transition-all hover:-translate-y-1 ${theme === 'dark' ? 'bg-stone-900/60 border-stone-800 hover:border-stone-700' : 'bg-white border-stone-100 shadow-sm hover:shadow-md'
                            }`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${theme === 'dark' ? 'bg-stone-800 text-stone-400' : 'bg-stone-100 text-stone-600'
                                        }`}>
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <h4 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                            Order #{review.id}
                                        </h4>
                                        <p className={`text-xs font-medium flex items-center gap-1.5 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>
                                            <Calendar size={10} />
                                            {new Date(review.completedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-black ${review.rating >= 4 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    review.rating >= 3 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                    <Star size={10} fill="currentColor" />
                                    {review.rating}.0
                                </div>
                            </div>

                            {review.review && (
                                <div className={`p-4 rounded-2xl mb-4 text-sm font-medium leading-relaxed italic ${theme === 'dark' ? 'bg-stone-950/50 text-stone-300' : 'bg-stone-50 text-stone-600'
                                    }`}>
                                    "{review.review}"
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                                {review.items.map((item, idx) => (
                                    <span key={idx} className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${theme === 'dark' ? 'bg-stone-800 text-stone-400' : 'bg-stone-100 text-stone-500'
                                        }`}>
                                        {item.quantity}x {item.menuItem.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Reviews;
