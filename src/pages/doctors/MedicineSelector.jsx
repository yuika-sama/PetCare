import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, SlidersHorizontal, Minus, Plus, ChevronDown } from 'lucide-react';
import MedicineCard from '../../components/doctor/MedicineCard';
import './MedicineSelector.css';
import medicineService from '../../api/medicineService';

const MedicineSelector = () => {
    const navigate = useNavigate();
    const [showDosageModal, setShowDosageModal] = useState(false);
    const [activeDosageMedId, setActiveDosageMedId] = useState(null);
    const [dosageDraft, setDosageDraft] = useState({
        morning: 0,
        noon: 0,
        afternoon: 0,
        evening: 0,
        note: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [medsList, setMedsList] = useState([]);

    useEffect(() => {
        let isMounted = true;
        const fetchMedicines = async () => {
            const response = await medicineService.listMedicines();
            if (!isMounted) return;
            setMedsList(response?.data || []);
        };
        fetchMedicines();
        return () => {
            isMounted = false;
        };
    }, []);

    const toggleSelection = (id) => {
        setMedsList(prevList => 
            prevList.map(med => 
                med.id === id
                    ? {
                        ...med,
                        selected: !med.selected,
                        expanded: med.selected ? false : med.expanded
                    }
                    : med
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

    const toggleExpand = (id) => {
        setMedsList((prevList) =>
            prevList.map((med) => {
                if (med.id === id) {
                    return { ...med, expanded: !med.expanded, selected: true };
                }
                return { ...med, expanded: false };
            })
        );
    };

    const openDosageModal = (id) => {
        const target = medsList.find((med) => med.id === id);
        if (!target) return;
        setActiveDosageMedId(id);
        setDosageDraft({ ...target.dosage });
        setShowDosageModal(true);
    };

    const updateDosageValue = (field, delta) => {
        setDosageDraft((prev) => ({
            ...prev,
            [field]: Math.max(0, prev[field] + delta)
        }));
    };

    const saveDosage = () => {
        if (!activeDosageMedId) return;
        setMedsList((prevList) =>
            prevList.map((med) =>
                med.id === activeDosageMedId
                    ? { ...med, dosage: { ...dosageDraft }, expanded: true, selected: true }
                    : med
            )
        );
        setShowDosageModal(false);
        setActiveDosageMedId(null);
    };

    const filteredMeds = medsList.filter((med) => {
        const keyword = searchTerm.trim().toLowerCase();
        if (!keyword) return true;
        return `${med.name} ${med.desc}`.toLowerCase().includes(keyword);
    });

    const handleConfirm = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const selectedMedicines = medsList.filter((med) => med.selected);
            await medicineService.saveSelection(selectedMedicines);
            navigate(-1);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="med-selector-page">
            {/* Header */}
            <header className="ms-header">
                <button className="ms-btn-icon" onClick={() => navigate(-1)}><ChevronLeft size={24} color="#1a1a1a" /></button>
                <h1 className="ms-title">Thuốc & Vật tư đi kèm</h1>
                <div style={{ width: 32 }}></div>
            </header>

            {/* Search Bar */}
            <div className="ms-search-container">
                <div className="ms-search-box">
                    <Search size={20} color="#209D80" className="ms-search-icon" />
                    <input type="text" placeholder="Search" className="ms-search-input" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
                </div>
                {/* <button className="ms-filter-btn">
                    <SlidersHorizontal size={20} color="#209D80" />
                </button> */}
            </div>

            {/* Meds List */}
            <div className="ms-content">
                <div className="ms-meds-list">
                    {filteredMeds.map(med => (
                        <MedicineCard
                            key={med.id}
                            med={med}
                            onToggleSelection={toggleSelection}
                            onToggleExpand={toggleExpand}
                            onUpdateQty={updateQty}
                            onOpenDosageModal={openDosageModal}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="ms-bottom-actions">
                <button className="ms-btn-skip" onClick={() => navigate(-1)}>Bỏ qua</button>
                <button className="ms-btn-confirm" onClick={handleConfirm}>{isSubmitting ? 'Đang lưu...' : 'Xác nhận'}</button>
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
                                            <button
                                                className="dosage-step-btn"
                                                type="button"
                                                onClick={() => updateDosageValue(
                                                    idx === 0 ? 'morning' : idx === 1 ? 'noon' : idx === 2 ? 'afternoon' : 'evening',
                                                    -1
                                                )}
                                            >
                                                <Minus size={16} color="#666" />
                                            </button>
                                            <span className="dosage-step-val">
                                                {idx === 0
                                                    ? dosageDraft.morning
                                                    : idx === 1
                                                        ? dosageDraft.noon
                                                        : idx === 2
                                                            ? dosageDraft.afternoon
                                                            : dosageDraft.evening}
                                            </span>
                                            <button
                                                className="dosage-step-btn"
                                                type="button"
                                                onClick={() => updateDosageValue(
                                                    idx === 0 ? 'morning' : idx === 1 ? 'noon' : idx === 2 ? 'afternoon' : 'evening',
                                                    1
                                                )}
                                            >
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
                                        value={dosageDraft.note}
                                        onChange={(event) => setDosageDraft((prev) => ({ ...prev, note: event.target.value }))}
                                    ></textarea>
                                    <span className="dosage-char-count">2000</span>
                                </div>
                            </div>
                        </div>

                        <div className="dosage-bottom-action">
                            <button className="dosage-btn-confirm-final" onClick={saveDosage}>
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
