import React, { useState } from 'react';
import { ChevronLeft, Search, SlidersHorizontal, Minus, Plus, ChevronDown } from 'lucide-react';
import './MedicineSelector.css';

const MedicineSelector = () => {
    const [showDosageModal, setShowDosageModal] = useState(false);

    // Thêm trường qty (số lượng) và unit (đơn vị)
    const [medsList, setMedsList] = useState([
        {
            id: 1,
            name: 'Đại tràng Trường Phúc',
            desc: 'Điều trị viêm loét đại tràng, rối loạn tiêu hóa (3 vỉ x 10 viên)',
            price: '120.000đ',
            unit: '/hộp',
            stock: '2.000',
            image: 'https://placehold.co/80x80/f4f4f5/a1a1aa?text=Med',
            selected: true, // Item đầu tiên được chọn mẫu
            qty: 0,
            selectedUnit: 'Hộp'
        },
        {
            id: 2,
            name: 'Đại tràng Trường Phúc',
            desc: 'Điều trị viêm loét đại tràng, rối loạn tiêu hóa (3 vỉ x 10 viên)',
            price: '120.000đ',
            unit: '/hộp',
            stock: '2.000',
            image: 'https://placehold.co/80x80/f4f4f5/a1a1aa?text=Med',
            selected: false,
            qty: 0,
            selectedUnit: 'Hộp'
        },
        {
            id: 3,
            name: 'Đại tràng Trường Phúc',
            desc: 'Điều trị viêm loét đại tràng, rối loạn tiêu hóa (3 vỉ x 10 viên)',
            price: '120.000đ',
            unit: '/hộp',
            stock: '2.000',
            image: 'https://placehold.co/80x80/f4f4f5/a1a1aa?text=Med',
            selected: false,
            qty: 0,
            selectedUnit: 'Hộp'
        },
        {
            id: 4,
            name: 'Đại tràng Trường Phúc',
            desc: 'Điều trị viêm loét đại tràng, rối loạn tiêu hóa (3 vỉ x 10 viên)',
            price: '120.000đ',
            unit: '/hộp',
            stock: '2.000',
            image: 'https://placehold.co/80x80/f4f4f5/a1a1aa?text=Med',
            selected: false,
            qty: 0,
            selectedUnit: 'Hộp'
        }
    ]);

    const toggleSelection = (id) => {
        setMedsList(prevList => 
            prevList.map(med => 
                med.id === id ? { ...med, selected: !med.selected } : med
            )
        );
    };

    const updateQty = (id, delta) => {
        setMedsList(prevList => 
            prevList.map(med => {
                if (med.id === id) {
                    const newQty = med.qty + delta;
                    return { ...med, qty: newQty < 0 ? 0 : newQty };
                }
                return med;
            })
        );
    };

    return (
        <div className="med-selector-page">
            {/* Header */}
            <header className="ms-header">
                <button className="ms-btn-icon"><ChevronLeft size={24} color="#1a1a1a" /></button>
                <h1 className="ms-title">Thuốc & Vật tư đi kèm</h1>
                <div style={{ width: 32 }}></div> {/* placeholder to balance the flex space */}
            </header>

            {/* Search Bar */}
            <div className="ms-search-container">
                <div className="ms-search-box">
                    <Search size={20} color="#209D80" className="ms-search-icon" />
                    <input type="text" placeholder="Search" className="ms-search-input" />
                </div>
                <button className="ms-filter-btn">
                    <SlidersHorizontal size={20} color="#209D80" />
                </button>
            </div>

            {/* Meds List */}
            <div className="ms-content">
                <div className="ms-meds-list">
                    {medsList.map(med => (
                        <div key={med.id} className={`ms-med-card ${med.selected ? 'selected' : ''}`}>
                            <div className="ms-med-main-row">
                                <div className="ms-med-checkbox" onClick={() => toggleSelection(med.id)}>
                                    <div className={`ms-checkbox-box ${med.selected ? 'checked' : ''}`}></div>
                                </div>
                                <img src={med.image} alt={med.name} className="ms-med-image-sm" />
                                <div className="ms-med-info-box">
                                    <h4 className="ms-med-name-sm">{med.name}</h4>
                                    <p className="ms-med-desc-sm">{med.desc}</p>
                                    <div className="ms-med-footer-sm">
                                        <div className="ms-med-price-tag">
                                            <span className="ms-price-num">{med.price}</span>
                                            <span className="ms-price-unit"> {med.unit}</span>
                                        </div>
                                        <span className="ms-stock-txt">Tồn: <strong>{med.stock}</strong></span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Expandable Action Area when selected */}
                            {med.selected && (
                                <div className="ms-med-expanded-area">
                                    <div className="ms-qty-row">
                                        <span className="ms-qty-label">Số lượng</span>
                                        <div className="ms-qty-controls-wrapper">
                                            <div className="ms-unit-select">
                                                <span>{med.selectedUnit}</span>
                                                <ChevronDown size={16} color="#444" />
                                            </div>
                                            <div className="ms-qty-stepper">
                                                <button onClick={() => updateQty(med.id, -1)} className="ms-stepper-btn">
                                                    <Minus size={16} color="#666" />
                                                </button>
                                                <span className="ms-qty-val">{med.qty}</span>
                                                <button onClick={() => updateQty(med.id, 1)} className="ms-stepper-btn">
                                                    <Plus size={16} color="#666" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="ms-dosage-row">
                                        <span className="ms-qty-label">Liều dùng</span>
                                        <button className="ms-btn-dosage" onClick={() => setShowDosageModal(true)}>
                                            Thêm liều dùng
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="ms-bottom-actions">
                <button className="ms-btn-skip">Bỏ qua</button>
                <button className="ms-btn-confirm" onClick={() => setShowDosageModal(true)}>Xác nhận</button>
            </div>

            {/* Dosage Modal Bottom Sheet */}
            {showDosageModal && (
                <>
                    <div className="dosage-modal-overlay" onClick={() => setShowDosageModal(false)}></div>
                    <div className="dosage-modal-content">
                        <div className="dosage-modal-handle"></div>
                        <h2 className="dosage-modal-title">Liều dùng</h2>
                        
                        <div className="dosage-main-area">
                            {['Sáng', 'Trưa', 'Chiều', 'Tối'].map((time, idx) => (
                                <div key={time} className="dosage-row">
                                    <span className="dosage-label">{time}</span>
                                    <div className="dosage-controls">
                                        <div className="dosage-stepper">
                                            <button className="dosage-step-btn">
                                                <Minus size={16} color="#666" />
                                            </button>
                                            <span className="dosage-step-val">{idx % 2 === 0 ? 1 : 0}</span>
                                            <button className="dosage-step-btn">
                                                <Plus size={16} color="#666" />
                                            </button>
                                        </div>
                                        <div className="dosage-unit">
                                            <span>Viên</span>
                                            <ChevronDown size={16} color="#888" />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="dosage-note-row">
                                <span className="dosage-label">Chỉ định khác</span>
                                <div className="dosage-textarea-box">
                                    <textarea 
                                        className="dosage-textarea" 
                                        defaultValue="Uống thuốc trước khi ăn"
                                    ></textarea>
                                    <span className="dosage-char-count">2000</span>
                                </div>
                            </div>
                        </div>

                        <div className="dosage-bottom-action">
                            <button className="dosage-btn-confirm-final" onClick={() => setShowDosageModal(false)}>
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MedicineSelector;
