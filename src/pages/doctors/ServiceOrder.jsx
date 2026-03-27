import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreVertical, Phone, Eye, Mars, Calendar, Weight, Plus, TriangleAlert } from 'lucide-react';
import ServiceAccordion from '../../components/doctor/ServiceAccordion';
import TreatmentHistoryTimeline from '../../components/doctor/TreatmentHistoryTimeline';
import FeatureDevelopingModal from '../../components/common/FeatureDevelopingModal';
import './ServiceOrder.css';
import '../../components/doctor/TicketCard.css';
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/600.css";
import {Divider} from "semantic-ui-react";

const AlertBadgeIcon = () => <TriangleAlert size={24} color="#ef4444" strokeWidth={2} />;

const ServiceOrder = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Dịch vụ');
    const [selectedConclusion, setSelectedConclusion] = useState('');
    const [showFinishModal, setShowFinishModal] = useState(false);
    const MAX_CONCLUSION_LENGTH = 2000;
    const [conclusionText, setConclusionText] = useState('Ho có đờm, khó khè. Vòm họng sung tấy');

    // Two supported cases for pet info box:
    // 1) hasAlert = true  -> show alert icon on the right
    // 2) hasAlert = false -> no alert icon
    const petInfo = {
        name: 'Kuro',
        breed: 'Chó Poodle',
        gender: 'male',
        age: '3 Tuổi',
        weight: '4.5kg',
        hasAlert: true
    };

    const tabs = ['Dịch vụ', 'Kết luận phiếu khám', 'Lịch sử điều trị'];
    const conclusionOptions = ['Cận lâm sàng', 'Điều trị nội trú', 'Điều trị ngoại trú', 'Kết thúc cho về'];

    return (
        <div className="service-order-page">
            {/* Header */}
            <header className="so-header">
                <button className="so-btn-icon"><ChevronLeft size={24} color="#1a1a1a" /></button>
                <h1 className="so-title">Đơn dịch vụ</h1>
                {/* <button className="so-btn-icon"><MoreVertical size={24} color="#1a1a1a" /></button> */}
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
                        {/* <div className="so-payment-info">
                            <span className="so-paid">0đ</span>
                            <span className="so-total">/1.000.000đ</span>
                        </div> */}
                    </div>

                    <Divider/>
                    
                    <div className="so-created-info">
                        <span>Được tạo từ đơn tiếp đón lúc <span className="so-time">10:00 25/05</span></span>
                        <Eye size={16} className="so-icon-eye" />
                    </div>

                    {/* Pet Info Box - TicketCard design with 2 cases */}
                    {petInfo.hasAlert ? (
                        <div className="ticket-pet-info-box has-alert">
                            <div className="ticket-pet-details">
                                <span className="ticket-pet-name">{petInfo.name}</span>
                                <span className="ticket-pet-breed">
                                    {petInfo.breed}
                                    {petInfo.gender === 'male' ? <Mars size={12} color="#3b82f6" style={{ display: 'inline', marginLeft: '4px' }} /> : null}
                                </span>
                                <span className="ticket-pet-stat"><Calendar size={14} color="#888" style={{ marginRight: '4px' }} /> {petInfo.age}</span>
                                <span className="ticket-pet-stat"><Weight size={14} color="#888" style={{ marginRight: '4px' }} /> {petInfo.weight}</span>
                            </div>
                            <div className="ticket-pet-alert-icon">
                                <AlertBadgeIcon />
                            </div>
                        </div>
                    ) : (
                        <div className="ticket-pet-info-box">
                            <div className="ticket-pet-details">
                                <span className="ticket-pet-name">{petInfo.name}</span>
                                <span className="ticket-pet-breed">
                                    {petInfo.breed}
                                    {petInfo.gender === 'male' ? <Mars size={12} color="#3b82f6" style={{ display: 'inline', marginLeft: '4px' }} /> : null}
                                </span>
                                <span className="ticket-pet-stat"><Calendar size={14} color="#888" style={{ marginRight: '4px' }} /> {petInfo.age}</span>
                                <span className="ticket-pet-stat"><Weight size={14} color="#888" style={{ marginRight: '4px' }} /> {petInfo.weight}</span>
                            </div>
                        </div>
                    )}
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
                        <>
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

                            <button
                                className="so-add-service-card"
                                type="button"
                                aria-label="Thêm dịch vụ"
                                onClick={() => navigate('/doctors/clinical-services')}
                            >
                                <span className="so-add-service-icon"><Plus size={40} strokeWidth={1.6} /></span>
                            </button>
                        </>
                    )}

                    {activeTab === 'Lịch sử điều trị' && <TreatmentHistoryTimeline />}

                    {activeTab === 'Kết luận phiếu khám' && (
                        <div className="so-conclusion-wrap">
                            <div className="so-result-summary-card">
                                <span className="so-result-summary-label">Tổng hợp kết quả</span>
                                <button className="so-result-summary-btn" type="button" onClick={() => navigate('/doctors/result-summary')}>
                                    <span>Kết quả</span>
                                    <Eye size={18} />
                                </button>
                            </div>

                            <div className="so-conclusion-block">
                                <h3 className="so-conclusion-title">Kết luận</h3>
                                <div className="so-conclusion-box">
                                    <textarea
                                        className="so-conclusion-input"
                                        value={conclusionText}
                                        onChange={(event) => setConclusionText(event.target.value.slice(0, MAX_CONCLUSION_LENGTH))}
                                        maxLength={MAX_CONCLUSION_LENGTH}
                                    />
                                    <span className="so-conclusion-count">{MAX_CONCLUSION_LENGTH - conclusionText.length}</span>
                                </div>
                            </div>

                            <div className="so-conclusion-block">
                                <h3 className="so-conclusion-title">Lựa chọn <span>*</span></h3>
                                <div className="so-conclusion-options">
                                    {conclusionOptions.map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            className={`so-option-item ${selectedConclusion === option ? 'active' : ''}`}
                                            onClick={() => setSelectedConclusion(option)}
                                        >
                                            <span className="so-option-dot" />
                                            <span>{option}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Actions */}
            {activeTab === 'Kết luận phiếu khám' ? (
                <div className="so-bottom-actions so-bottom-actions-single">
                    <button className="so-btn-finish" onClick={() => setShowFinishModal(true)}>Kết thúc</button>
                </div>
            ) : (
                <div className="so-bottom-actions">
                    <button className="so-btn-cancel">Hủy bỏ</button>
                    <button className="so-btn-execute">Thực hiện</button>
                </div>
            )}

            <FeatureDevelopingModal open={showFinishModal} onClose={() => setShowFinishModal(false)} />
        </div>
    );
}

export default ServiceOrder;
