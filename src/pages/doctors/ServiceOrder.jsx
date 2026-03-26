import React, { useState } from 'react';
import { ChevronLeft, MoreVertical, Phone, Eye, Mars, Cake, Weight } from 'lucide-react';
import ServiceAccordion from '../../components/doctor/ServiceAccordion';
import TreatmentHistoryTimeline from '../../components/doctor/TreatmentHistoryTimeline';
import './ServiceOrder.css';

const ServiceOrder = () => {
    const [activeTab, setActiveTab] = useState('Dịch vụ');

    const tabs = ['Dịch vụ', 'Lịch sử điều trị'];

    return (
        <div className="service-order-page">
            {/* Header */}
            <header className="so-header">
                <button className="so-btn-icon"><ChevronLeft size={24} color="#1a1a1a" /></button>
                <h1 className="so-title">Đơn dịch vụ</h1>
                <button className="so-btn-icon"><MoreVertical size={24} color="#1a1a1a" /></button>
            </header>

            <div className="so-content">
                {/* Customer Info */}
                <div className="so-customer-card">
                    <div className="so-customer-row">
                        <div>
                            <h2 className="so-customer-name">Nguyễn Anh Đức</h2>
                            <div className="so-customer-phone">
                                <Phone size={14} className="so-icon-phone" />
                                <span>0912345678</span>
                            </div>
                        </div>
                        <div className="so-payment-info">
                            <span className="so-paid">0đ</span>
                            <span className="so-total">/1.000.000đ</span>
                        </div>
                    </div>
                    
                    <div className="so-created-info">
                        <span>Được tạo từ đơn tiếp đón lúc <span className="so-time">10:00 25/05</span></span>
                        <Eye size={16} className="so-icon-eye" />
                    </div>

                    {/* Pet Info Inline */}
                    <div className="so-pet-info-inline">
                        <span className="so-pet-name">Kuro</span>
                        <span className="so-pet-breed">Chó Poodle <Mars size={12} color="#3b82f6" style={{ display: 'inline', marginLeft: '2px' }} /></span>
                        <span className="so-pet-stat"><Cake size={14} color="#888" /> 3 Tuổi</span>
                        <span className="so-pet-stat"><Weight size={14} color="#888" /> 4.5kg</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="so-tabs">
                    {tabs.map(tab => (
                        <div 
                            key={tab} 
                            className={`so-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                {/* Accordions / Sections */}
                <div className="so-sections">
                    {activeTab === 'Dịch vụ' && (
                        <ServiceAccordion title="KHÁM BỆNH" defaultExpanded>
                                <div className="so-service-item">
                                    <div className="so-service-row">
                                        <span className="so-service-name">Khám lâm sàng</span>
                                        <span className="so-service-status pending">Chờ thực hiện</span>
                                    </div>
                                    <div className="so-service-price">
                                        <span className="so-price-val">0đ</span>
                                        <span className="so-price-unit"> /lượt x1</span>
                                    </div>
                                    <div className="so-service-executor">
                                        <span className="so-exec-label">Người thực hiện</span>
                                        <span className="so-exec-name">Nguyễn Văn An</span>
                                    </div>
                                </div>
                        </ServiceAccordion>
                    )}

                    {activeTab === 'Lịch sử điều trị' && <TreatmentHistoryTimeline />}
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="so-bottom-actions">
                <button className="so-btn-cancel">Hủy bỏ</button>
                <button className="so-btn-execute">Thực hiện</button>
            </div>
        </div>
    );
}

export default ServiceOrder;
