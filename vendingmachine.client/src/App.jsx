import './app.css';
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import Header from './components/header';
import { Home } from './pages/home';
import { Login } from './pages/login';
import { Logout } from './pages/logout';
import { AdminMain } from './pages/admin/main';
import { AdminBrands } from './pages/admin/brands';
import { AdminProducts } from './pages/admin/products';
import { AdminCoins } from './pages/admin/coins';
import { AdminOrders } from './pages/admin/orders';
import { Shop } from './pages/shop';

const App = () => {
    //
    return (
        <Router>            
            <div className="App">
                <CssBaseline />      
                <Header title="Автомат по продаже напитков" />
                <Container maxWidth={false}>                 
                    <main>
                        <Routes>
                            <Route index element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/logout" element={<Logout />} />
                            <Route path="/admin/main" element={<AdminMain />} />
                            <Route path="/admin/brands" element={<AdminBrands />} />
                            <Route path="/admin/products" element={<AdminProducts />} />
                            <Route path="/admin/coins" element={<AdminCoins />} />
                            <Route path="/admin/orders" element={<AdminOrders />} />
                            <Route path="/shop" element={<Shop />} />
                        </Routes>
                    </main>
                </Container>
            </div>
        </Router>
    );
};

export default App;
