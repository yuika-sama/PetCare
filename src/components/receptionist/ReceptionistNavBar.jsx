import React, { useState } from 'react';
import { CalendarCheck, CreditCard, PlusCircle, Bell, Menu } from 'lucide-react';
import './ReceptionistNavBar.css';

const ReceptionistNavBar = () => {
    const [activeTab, setActiveTab] = useState('donhom');

    return (
        <div className="rc-bottom-nav">
            <div className="rc-nav-content">
                <div
                    className={`rc-nav-item ${activeTab === 'donhom' ? 'active' : ''}`}
                    onClick={() => setActiveTab('donhom')}
                >
                    <CalendarCheck size={26} strokeWidth={1.8} />
                    <span>Đơn hôm nay</span>
                </div>

                <div
                    className={`rc-nav-item ${activeTab === 'thanhtoan' ? 'active' : ''}`}
                    onClick={() => setActiveTab('thanhtoan')}
                >
                    <CreditCard size={26} strokeWidth={1.8} />
                    <span>Thanh toán</span>
                </div>

                <div className="rc-nav-fab-placeholder">
                    <button className="rc-nav-fab">
                        <PlusCircle size={28} color="#fff" strokeWidth={2} />
                    </button>
                    <span className="rc-nav-fab-label">Tạo đơn</span>
                </div>

                <div
                    className={`rc-nav-item ${activeTab === 'thongbao' ? 'active' : ''}`}
                    onClick={() => setActiveTab('thongbao')}
                >
                    <Bell size={26} strokeWidth={1.8} />
                    <span>Thông báo</span>
                </div>

                <div
                    className={`rc-nav-item ${activeTab === 'khac' ? 'active' : ''}`}
                    onClick={() => setActiveTab('khac')}
                >
                    <Menu size={26} strokeWidth={1.8} />
                    <span>Khác</span>
                </div>
            </div>
        </div>
    );
};

export default ReceptionistNavBar;
