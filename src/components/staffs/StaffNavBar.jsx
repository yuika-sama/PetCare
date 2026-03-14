import React, { useState } from 'react';
import './StaffNavBar.css';
import { Calendar, Warehouse, Plus, PhoneCall, Menu } from 'lucide-react';

const navItems = [
    { id: 'calendar', label: 'Lịch hẹn', icon: Calendar },
    { id: 'warehouse', label: 'Kho', icon: Warehouse },
    { id: 'plus', label: 'Tạo đơn', icon: Plus, isCenter: true },
    { id: 'reception', label: 'Tiếp đón', icon: PhoneCall },
    { id: 'menu', label: 'Khác', icon: Menu }
];

const StaffNavBar = () => {
    const [active, setActive] = useState('reception');
    const [pressed, setPressed] = useState(null);

    const handleClick = (id) => {
        setActive(id);
        setPressed(id);
        window.setTimeout(() => setPressed(null), 140);
    };

    return (
        <div className="staff-nav">
            <div className="staff-nav-content">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = active === item.id;
                    const isPressed = pressed === item.id;

                    if (item.isCenter) {
                        return (
                            <button
                                key={item.id}
                                className={`staff-nav-fab ${isPressed ? 'is-pressed' : ''}`}
                                onClick={() => handleClick(item.id)}
                                type="button"
                                aria-label={item.label}
                            >
                                <Icon size={24} strokeWidth={2} />
                            </button>
                        );
                    }

                    return (
                        <button
                            key={item.id}
                            className={`staff-nav-item ${isActive ? 'active' : ''} ${isPressed ? 'is-pressed' : ''}`}
                            onClick={() => handleClick(item.id)}
                            type="button"
                        >
                            <Icon size={22} strokeWidth={1.8} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default StaffNavBar;
