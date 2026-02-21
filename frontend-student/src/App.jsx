import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import LocationPage from './pages/LocationPage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import OrderTracker from './pages/OrderTracker';
import LoginPage from './pages/LoginPage';
import OtpPage from './pages/OtpPage';
import FavoritesPage from './pages/FavoritesPage';
import AddressBookPage from './pages/AddressBookPage';
import PaymentMethodsPage from './pages/PaymentMethodsPage';
import BottomNav from './components/BottomNav';
import CartDrawer from './components/CartDrawer';
import Sidebar from './components/Sidebar';
import CartConflictModal from './components/CartConflictModal';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

function App() {
    // Moved hooks inside App component to ensure context availability if needed, 
    // but ThemeProvider wrap is outside. 
    // Actually, we need to access context inside App, so we need a wrapper.
    // Let's keep the providers in the return and use a InnerApp component or just use the hooks inside the children.
    // Since we are moving Layout logic into App, we need to be careful about hook usage.

    // Changing App to just return providers, and moving content to MainContent
    return (
        <ThemeProvider>
            <Router>
                <AuthProvider>
                    <CartProvider>
                        <MainContent />
                    </CartProvider>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

const MainContent = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const location = useLocation();
    const hideNavRoutes = ['/login', '/otp'];
    const showNav = user && !hideNavRoutes.includes(location.pathname);



    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#1c1917] text-white' : 'bg-[#fafaf9] text-[#1c1917]'}`}>
            {/* Desktop Sidebar: Visible on md+ */}
            {showNav && <Sidebar />}



            <div className={`min-h-screen w-full transition-all duration-300 overflow-x-hidden ${showNav ? 'md:pl-72' : ''}`}>
                <div className="max-w-7xl mx-auto min-h-screen relative">
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/otp" element={<OtpPage />} />

                        <Route path="/home" element={
                            <PrivateRoute>
                                <HomePage />
                            </PrivateRoute>
                        } />

                        <Route path="/location/:locId" element={
                            <PrivateRoute>
                                <LocationPage />
                            </PrivateRoute>
                        } />

                        <Route path="/menu/:locId/:stallId" element={
                            <PrivateRoute>
                                <MenuPage />
                            </PrivateRoute>
                        } />

                        <Route path="/cart" element={
                            <PrivateRoute>
                                <CartPage />
                            </PrivateRoute>
                        } />

                        <Route path="/profile" element={
                            <PrivateRoute>
                                <ProfilePage />
                            </PrivateRoute>
                        } />

                        <Route path="/orders" element={
                            <PrivateRoute>
                                <OrdersPage />
                            </PrivateRoute>
                        } />

                        <Route path="/favorites" element={
                            <PrivateRoute>
                                <FavoritesPage />
                            </PrivateRoute>
                        } />

                        <Route path="/address" element={
                            <PrivateRoute>
                                <AddressBookPage />
                            </PrivateRoute>
                        } />

                        <Route path="/payment" element={
                            <PrivateRoute>
                                <PaymentMethodsPage />
                            </PrivateRoute>
                        } />

                        <Route path="/track/:orderId" element={
                            <PrivateRoute>
                                <OrderTracker />
                            </PrivateRoute>
                        } />

                        <Route path="/" element={<Navigate to="/home" />} />
                        <Route path="*" element={<Navigate to="/home" />} />
                    </Routes>

                    {/* Mobile Bottom Nav - Only visible on small screens */}
                    {showNav && (
                        <div className="md:hidden">
                            <BottomNav />
                        </div>
                    )}

                    <CartDrawer />
                    <CartConflictModal />
                </div>
            </div>
        </div>
    );
};

export default App;
