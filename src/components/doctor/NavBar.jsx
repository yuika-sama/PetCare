import React, { useState } from 'react';
import './NavBar.css';
import { ClipboardList, Package, Scan, Bell, Menu } from 'lucide-react';

const NavBar = () => {
    // Default active tab is 'phieu'
    const [activeTab, setActiveTab] = useState('phieu');

    return (
        <div className="bottom-nav">
            <div className="nav-content">
                <div
                    className={`nav-item ${activeTab === 'phieu' ? 'active' : ''}`}
                    onClick={() => setActiveTab('phieu')}
                >
                    <ClipboardList size={28} strokeWidth={1.8} />
                    <span>Phiếu</span>
                </div>

                <div
                    className={`nav-item ${activeTab === 'kho' ? 'active' : ''}`}
                    onClick={() => setActiveTab('kho')}
                >
                    <Package size={28} strokeWidth={1.8} />
                    <span>Kho</span>
                </div>

                <div className="nav-fab-placeholder">
                    <button className="nav-fab">
                        <Scan size={28} color="#fff" strokeWidth={2} />
                    </button>
                </div>

                <div
                    className={`nav-item ${activeTab === 'thongbao' ? 'active' : ''}`}
                    onClick={() => setActiveTab('thongbao')}
                >
                    <Bell size={28} strokeWidth={1.8} />
                    <span>Thông báo</span>
                </div>

                <div
                    className={`nav-item ${activeTab === 'khac' ? 'active' : ''}`}
                    onClick={() => setActiveTab('khac')}
                >
                    <Menu size={28} strokeWidth={1.8} />
                    <span>Khác</span>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
