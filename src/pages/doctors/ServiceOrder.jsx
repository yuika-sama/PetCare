import React, { useState } from 'react';
import { ChevronLeft, MoreVertical, Phone, Eye, Mars, Cake, Weight, ChevronUp, ChevronDown } from 'lucide-react';
import './ServiceOrder.css';

// SVG tuỳ chỉnh cho hình ảnh trạng thái rỗng đặc thù
const EmptyDocGraphic = () => (
    <svg width="80" height="90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Bìa tài liệu nghiêng ở sau */}
        <g transform="rotate(-12 50 50)">
            <rect x="30" y="25" width="40" height="55" rx="3" fill="#f8f9fa" stroke="#e9ecef" strokeWidth="2" />
            <rect x="40" y="20" width="20" height="8" rx="2" fill="#88dec7" />
        </g>
        {/* Bìa tài liệu thẳng ở trước */}
        <rect x="40" y="30" width="40" height="55" rx="3" fill="#f5f5f5" stroke="#e9ecef" strokeWidth="2" />
        <rect x="50" y="25" width="20" height="8" rx="2" fill="#66cdaa" />
    </svg>
);

const ServiceOrder = () => {
    const [activeTab, setActiveTab] = useState('Dịch vụ');
    const [isExamExpanded, setIsExamExpanded] = useState(true);
    const [isMedsExpanded, setIsMedsExpanded] = useState(true);

    const tabs = ['Dịch vụ', 'Kết quả', 'Hàng hóa', 'Lịch sử điều trị'];

    const medsList = [
        {
            id: 1,
            name: 'Đại tràng Trường Phúc',
            desc: 'Điều trị viêm loét đại tràng, rối loạn tiêu hóa (3 vỉ x 10 viên)',
            price: '120.000đ',
            unit: '/hộp',
            stock: '2.000',
            image: 'https://placehold.co/80x80/f4f4f5/a1a1aa?text=Med',
            selected: false
        }
    ];

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
                    {/* KHÁM BỆNH */}
                    <div className="so-accordion">
                        <div className="so-accordion-header" onClick={() => setIsExamExpanded(!isExamExpanded)}>
                            <h3>KHÁM BỆNH</h3>
                            {isExamExpanded ? <ChevronUp size={20} color="#666" /> : <ChevronDown size={20} color="#666" />}
                        </div>
                        {isExamExpanded && (
                            <div className="so-accordion-content">
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
                            </div>
                        )}
                    </div>

                    {/* THUỐC & VẬT TƯ ĐI KÈM */}
                    <div className="so-accordion">
                        <div className="so-accordion-header" onClick={() => setIsMedsExpanded(!isMedsExpanded)}>
                            <h3>THUỐC & VẬT TƯ ĐI KÈM</h3>
                            {isMedsExpanded ? <ChevronUp size={20} color="#666" /> : <ChevronDown size={20} color="#666" />}
                        </div>
                        {isMedsExpanded && (
                            <div className={`so-accordion-content ${medsList.length === 0 ? 'empty-state' : 'meds-list-container'}`}>
                                {medsList.length === 0 ? (
                                    <EmptyDocGraphic />
                                ) : (
                                    <div className="so-meds-list">
                                        {medsList.map(med => (
                                            <div key={med.id} className="so-med-item">
                                                <div className="so-med-checkbox">
                                                    <input type="checkbox" id={`med-${med.id}`} defaultChecked={med.selected} />
                                                    <label htmlFor={`med-${med.id}`}></label>
                                                </div>
                                                <img src={med.image} alt={med.name} className="so-med-image" />
                                                <div className="so-med-details">
                                                    <h4 className="so-med-name">{med.name}</h4>
                                                    <p className="so-med-desc">{med.desc}</p>
                                                    <div className="so-med-footer">
                                                        <div className="so-med-price-box">
                                                            <span className="so-med-price">{med.price}</span>
                                                            <span className="so-med-unit"> {med.unit}</span>
                                                        </div>
                                                        <span className="so-med-stock">Tồn: <strong>{med.stock}</strong></span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
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
