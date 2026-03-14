import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';
import StaffTopHeader from '../../components/staffs/StaffTopHeader';
import StaffNotificationCard from '../../components/staffs/StaffNotificationCard';

const notifications = [
    {
        id: 1,
        title: 'Thuc hien thanh toan!',
        time: '3 phut',
        orderCode: '25REC573275',
        customerName: 'Nguyen Anh Duc'
    },
    {
        id: 2,
        title: 'Thuc hien thanh toan!',
        time: '3 phut',
        orderCode: '25REC573275',
        customerName: 'Nguyen Anh Duc'
    },
    {
        id: 3,
        title: 'Thuc hien thanh toan!',
        time: '3 phut',
        orderCode: '25REC573275',
        customerName: 'Nguyen Anh Duc'
    },
    {
        id: 4,
        title: 'Thuc hien thanh toan!',
        time: '3 phut',
        orderCode: '25REC573275',
        customerName: 'Nguyen Anh Duc'
    }
];

const Notifications = () => {
    const navigate = useNavigate();

    return (
        <div className="staff-notifications-page">
            <div className="staff-notifications-shell">
                <StaffTopHeader title="Thong bao" onBack={() => navigate(-1)} />

                <section className="staff-notifications-list">
                    {notifications.map((item) => (
                        <StaffNotificationCard
                            key={item.id}
                            title={item.title}
                            time={item.time}
                            message={(
                                <>
                                    Phieu tiep don <span className="accent">{item.orderCode}</span> cua khach hang{' '}
                                    <span className="accent">{item.customerName}</span> da hoan thanh. Hay tien hanh thanh toan ngay!
                                </>
                            )}
                        />
                    ))}
                </section>
            </div>
        </div>
    );
};

export default Notifications;
