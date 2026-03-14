import React, { useState } from 'react';
import { ChevronLeft, ChevronDown, Phone, PawPrint, Plus, Cake, Weight, Mars, PenSquare } from 'lucide-react';
import './NewReception.css';

const NewReception = () => {
    const [selectedPet, setSelectedPet] = useState('Kuro');
    const [isEmergency, setIsEmergency] = useState(false);
    const [weight, setWeight] = useState('');
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [examType, setExamType] = useState('');
    const [assignee, setAssignee] = useState('');

    const pets = [
        { name: 'Kuro' },
        { name: 'Katy' },
    ];

    const petInfo = {
        name: 'Kuro',
        breed: 'Chó Poodle',
        gender: 'male',
        age: '3 Tuổi',
        weight: '4.5kg',
    };

    return (
        <div className="new-reception-page">
            {/* Header */}
            <header className="nr-header">
                <button className="nr-btn-icon">
                    <ChevronLeft size={24} color="#1a1a1a" />
                </button>
                <h1 className="nr-title">Tiếp đón mới</h1>
                <div className="nr-header-avatar">
                    <img src="https://placehold.co/36x36/e0f2ef/209D80?text=Dr" alt="avatar" />
                </div>
            </header>

            <div className="nr-content">
                {/* Customer Info */}
                <div className="nr-customer-section">
                    <div className="nr-customer-row">
                        <h2 className="nr-customer-name">Nguyễn Anh Đức</h2>
                        <div className="nr-customer-debt">
                            <span className="nr-debt-amount">10.000.000đ</span>
                        </div>
                    </div>
                    <div className="nr-customer-sub-row">
                        <div className="nr-customer-phone">
                            <Phone size={14} color="#209D80" />
                            <span>0912345678</span>
                        </div>
                        <span className="nr-order-count">/35 đơn</span>
                    </div>
                </div>

                {/* Pet Chips */}
                <div className="nr-pet-chips">
                    {pets.map(pet => (
                        <button
                            key={pet.name}
                            className={`nr-pet-chip ${selectedPet === pet.name ? 'active' : ''}`}
                            onClick={() => setSelectedPet(pet.name)}
                        >
                            <PawPrint size={14} />
                            <span>{pet.name}</span>
                        </button>
                    ))}
                    <button className="nr-pet-chip-add">
                        <Plus size={18} color="#209D80" />
                    </button>
                </div>

                {/* Form Section */}
                <div className="nr-form-section">
                    <h3 className="nr-form-title">Thông tin tiếp đón</h3>

                    {/* Pet Info Bar */}
                    <div className="nr-pet-info-bar">
                        <div className="nr-pet-info-details">
                            <span className="nr-pet-info-name">{petInfo.name}</span>
                            <span className="nr-pet-info-breed">
                                {petInfo.breed}
                                <Mars size={12} color="#3b82f6" style={{ marginLeft: '2px' }} />
                            </span>
                            <span className="nr-pet-info-stat">
                                <Cake size={13} color="#888" />
                                {petInfo.age}
                            </span>
                            <span className="nr-pet-info-stat">
                                <Weight size={13} color="#888" />
                                {petInfo.weight}
                            </span>
                        </div>
                        <button className="nr-pet-edit-btn">
                            <PenSquare size={16} color="#209D80" />
                        </button>
                    </div>

                    {/* Weight */}
                    <div className="nr-field">
                        <label className="nr-field-label">Cân nặng <span className="nr-required">*</span></label>
                        <div className="nr-input-with-suffix">
                            <input
                                type="text"
                                className="nr-input"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder=""
                            />
                            <span className="nr-input-suffix">kg</span>
                        </div>
                    </div>

                    {/* Reason */}
                    <div className="nr-field">
                        <label className="nr-field-label">Lý do khám <span className="nr-required">*</span></label>
                        <div className="nr-select-wrapper">
                            <select
                                className="nr-select"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            >
                                <option value="" disabled></option>
                                <option value="behohap">Bệnh hô hấp</option>
                                <option value="tieuhoa">Bệnh tiêu hóa</option>
                                <option value="dalieu">Bệnh da liễu</option>
                                <option value="khac">Khác</option>
                            </select>
                            <ChevronDown size={18} color="#888" className="nr-select-icon" />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="nr-field">
                        <label className="nr-field-label">Mô tả</label>
                        <textarea
                            className="nr-textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder=""
                        />
                    </div>

                    {/* Exam Type - only visible when emergency */}
                    {isEmergency && (
                        <div className="nr-field">
                            <label className="nr-field-label">Hình thức khám</label>
                            <div className="nr-select-wrapper">
                                <select
                                    className="nr-select"
                                    value={examType}
                                    onChange={(e) => setExamType(e.target.value)}
                                >
                                    <option value="" disabled></option>
                                    <option value="khammoi">Khám mới</option>
                                    <option value="taikham">Tái khám</option>
                                </select>
                                <ChevronDown size={18} color="#888" className="nr-select-icon" />
                            </div>
                        </div>
                    )}

                    {/* Assignee - only visible when emergency */}
                    {isEmergency && (
                        <div className="nr-field">
                            <label className="nr-field-label">Người thực hiện <span className="nr-required">*</span></label>
                            <div className="nr-select-wrapper">
                                <select
                                    className="nr-select"
                                    value={assignee}
                                    onChange={(e) => setAssignee(e.target.value)}
                                >
                                    <option value="" disabled></option>
                                    <option value="lehuyanh">Lê Huy Anh</option>
                                    <option value="nguyenvanan">Nguyễn Văn An</option>
                                </select>
                                <ChevronDown size={18} color="#888" className="nr-select-icon" />
                            </div>
                        </div>
                    )}

                    {/* Emergency Toggle */}
                    <div className="nr-toggle-row">
                        <div
                            className={`nr-toggle ${isEmergency ? 'active' : ''}`}
                            onClick={() => setIsEmergency(!isEmergency)}
                        >
                            <div className="nr-toggle-thumb"></div>
                        </div>
                        <span className="nr-toggle-label">Cấp cứu</span>
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="nr-bottom-actions">
                <button className="nr-btn-cancel">Hủy bỏ</button>
                <button className="nr-btn-submit">Tạo phiếu</button>
            </div>
        </div>
    );
};

export default NewReception;
