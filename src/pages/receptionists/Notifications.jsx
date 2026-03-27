import React from 'react';
import { Bell } from 'lucide-react';
import './Notifications.css';

const notifications = [
    {
        id: 1,
        title: 'Thực hiện thanh toán!',
        time: '3 phút',
        orderCode: '25REC573275',
        customerName: 'Nguyễn Anh Đức'
    },
    {
        id: 2,
        title: 'Thực hiện thanh toán!',
        time: '3 phút',
        orderCode: '25REC573275',
        customerName: 'Nguyễn Anh Đức'
    },
    {
        id: 3,
        title: 'Thực hiện thanh toán!',
        time: '3 phút',
        orderCode: '25REC573275',
        customerName: 'Nguyễn Anh Đức'
    },
    {
        id: 4,
        title: 'Thực hiện thanh toán!',
        time: '3 phút',
        orderCode: '25REC573275',
        customerName: 'Nguyễn Anh Đức'
    }
];

const Notifications = () => {
    return (
        <div className="rnotif-page">
            <header className="rnotif-header">
                <h1 className="rnotif-title">Thông báo</h1>
            </header>

            <div className="rnotif-list">
                {notifications.map((item) => (
                    <div key={item.id} className="rnotif-card">
                        <div className="rnotif-icon-wrap">
                            <Bell size={18} color="#24C7A9" fill="#24C7A9" />
                        </div>
                        <div className="rnotif-body">
                            <div className="rnotif-head-row">
                                <h3 className="rnotif-card-title">{item.title}</h3>
                                <span className="rnotif-time">{item.time}</span>
                            </div>
                            <p className="rnotif-desc">
                                Phiếu tiếp đón <strong>{item.orderCode}</strong> của khách hàng <strong>{item.customerName}</strong> đã hoàn thành. Hãy tiến hành thanh toán ngay!
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
