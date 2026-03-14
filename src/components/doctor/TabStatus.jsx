import React, { useState } from 'react';
import './TabStatus.css';

const tabsConfig = [
    { id: 'pending', label: 'Chờ thực hiện', count: 3 },
    { id: 'waiting_result', label: 'Chờ kết luận', count: 10 },
    { id: 'in_progress', label: 'Đang thực hiện', count: 16 },
    { id: 'completed', label: 'Hoàn thành', count: 14 },
    { id: 'all', label: 'Tất cả', count: 43 }
];

const TabStatus = ({ onTabChange }) => {
    const [activeTab, setActiveTab] = useState(tabsConfig[0].id);

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        if (onTabChange) {
            onTabChange(tabId);
        }
    };

    return (
        <div className="tab-status-wrapper">
            <div className="tab-status-container">
                {tabsConfig.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <div
                            key={tab.id}
                            className={`tab-status-item ${isActive ? 'active' : ''}`}
                            onClick={() => handleTabClick(tab.id)}
                        >
                            <span className="tab-label">{tab.label}</span>
                            <span className="tab-badge">{tab.count}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TabStatus;
