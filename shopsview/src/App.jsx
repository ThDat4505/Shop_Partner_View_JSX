import React, { useState, useEffect } from 'react';
import AddItem from './pages/AddItem/AddItem';
import ListItem from './pages/ListItem/ListItem';
import Orders from './pages/Orders/Orders';
import SignIn from './pages/SignIn/SignIn';
import Sidebar from './components/Sidebar/Sidebar';
import Menubar from './components/Menubar/Menubar';
import { Routes, Route, Navigate } from 'react-router-dom';

const App = () => {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [currentShopId, setCurrentShopId] = useState(null);

    useEffect(() => {
        const savedShop = localStorage.getItem('currentShopId');
        if (savedShop) setCurrentShopId(savedShop);
    }, []);

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const handleLogout = () => {
        localStorage.removeItem('currentShopId');
        setCurrentShopId(null);
    };

    if (!currentShopId) {
        return <SignIn onLoginSuccess={(id) => setCurrentShopId(id)} />;
    }

    return (
        <div className="d-flex" id="wrapper">
            <Sidebar sidebarVisible={sidebarVisible}/>

            <div id="page-content-wrapper" className="w-100">
                <Menubar
                    toggleSidebar={toggleSidebar}
                    shopId={currentShopId}
                    onLogout={handleLogout}
                />

                <div className="container-fluid">
                    <Routes>
                        <Route path='/add' element={<AddItem shopId={currentShopId} />} />
                        <Route path='/list' element={<ListItem shopId={currentShopId} />} />
                        <Route path='/orders' element={<Orders shopId={currentShopId} />} />
                        <Route path='/' element={<Navigate to="/list" />} />
                        <Route path='*' element={<Navigate to="/list" />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default App;