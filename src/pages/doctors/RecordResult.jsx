import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Phone, Mars, Cake, Weight, ChevronUp, ChevronDown, Plus, Upload, Minus, PencilLine } from 'lucide-react';
import FeatureDevelopingModal from '../../components/common/FeatureDevelopingModal';
import receptionService from '../../api/receptionService';
import treatmentService from '../../api/treatmentService';
import './RecordResult.css';

const RADIO_OPTIONS = [
    { id: 1, label: 'Cận lâm sàng' },
    { id: 2, label: 'Điều trị nội trú' },
    { id: 3, label: 'Điều trị ngoại trú' },
    { id: 4, label: 'Kết thúc cho về' },
];

const RecordResult = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isMedsExpanded, setIsMedsExpanded] = useState(true);
    const [conclusionText, setConclusionText] = useState('Ho có đờm, khò khè. Vòm họng sưng tấy');
    const [selectedConclusion, setSelectedConclusion] = useState(null);
    const [medsList] = useState([]);
    const [showDosageModal, setShowDosageModal] = useState(false);
    const [showFeatureModal, setShowFeatureModal] = useState(false);
    const [receptionDetail, setReceptionDetail] = useState(null);
    const [treatmentDetail, setTreatmentDetail] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const [receptionResponse, treatmentResponse] = await Promise.allSettled([
                    receptionService.getReceptionById(id),
                    treatmentService.getTreatmentDetailFlexible(id),
                ]);

                if (!isMounted) return;

                const receptionData = receptionResponse.status === 'fulfilled' ? receptionResponse.value?.data?.data : null;
                const treatmentData = treatmentResponse.status === 'fulfilled' ? treatmentResponse.value?.data?.data : null;

                setReceptionDetail(receptionData || null);
                setTreatmentDetail(treatmentData || null);

                if (typeof treatmentData?.plan === 'string' && treatmentData.plan.trim()) {
                    setConclusionText(treatmentData.plan);
                }
                if (typeof treatmentData?.type === 'string' && treatmentData.type.trim()) {
                    const found = RADIO_OPTIONS.find((option) => option.label === treatmentData.type);
                    if (found) {
                        setSelectedConclusion(found.id);
                    }
                }
            } catch {
                if (!isMounted) return;
                setReceptionDetail(null);
                setTreatmentDetail(null);
            }
        };

        if (id) {
            fetchData();
        }

        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleCloseFeatureModal = () => {
        setShowFeatureModal(false);
        navigate('/doctors/tickets');
    };

    const petInfo = useMemo(() => {
        const pet = receptionDetail?.pet;
        return {
            name: pet?.name || '---',
            breed: pet?.breed || pet?.species || '---',
            age: '-- Tuổi',
            weight: pet?.weight ? `${pet.weight}kg` : '--kg',
        };
    }, [receptionDetail]);

    const handleConfirm = async () => {
        if (isSaving) return;
        setIsSaving(true);
        try {
            const payload = {
                type: RADIO_OPTIONS.find((option) => option.id === selectedConclusion)?.label || 'Điều trị ngoại trú',
                plan: conclusionText,
                medicalRecord: { id: Number(id) || undefined },
            };

            if (treatmentDetail?.id) {
                await treatmentService.patchTreatmentSlipById(treatmentDetail.id, payload);
            } else {
                await treatmentService.createTreatmentSlip(payload);
            }
        } catch {
            // Keep UX flow while backend contract for this form is being finalized.
        } finally {
            setIsSaving(false);
            setShowFeatureModal(true);
        }
    };

    return (
        <div className="record-result-page">
            <header className="rr-header">
                <button className="rr-btn-icon" onClick={() => navigate(`/doctors/service-order/${id ?? 1}`)}><ChevronLeft size={24} color="#1a1a1a" /></button>
                <h1 className="rr-title">Ghi nhận kết quả</h1>
            </header>

            <div className="rr-content">
                <div className="rr-customer-card">
                    <div className="rr-customer-row">
                        <div>
                            <h2 className="rr-customer-name">{receptionDetail?.client?.fullName || '---'}</h2>
                            <div className="rr-customer-phone">
                                <Phone size={14} className="rr-icon-phone" />
                                <span>{receptionDetail?.client?.phoneNumber || '---'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rr-ticket-type-row">
                        <span className="rr-ticket-type">{receptionDetail?.examForm?.examType || 'Phiếu khám lâm sàng'}</span>
                    </div>

                    <div className="rr-pet-info-inline">
                        <span className="rr-pet-name">{petInfo.name}</span>
                        <span className="rr-pet-breed">{petInfo.breed} <Mars size={12} color="#3b82f6" style={{ display: 'inline', marginLeft: '2px' }} /></span>
                        <span className="rr-pet-stat"><Cake size={14} color="#888" /> {petInfo.age}</span>
                        <span className="rr-pet-stat"><Weight size={14} color="#888" /> {petInfo.weight}</span>
                    </div>
                </div>

                <div className="rr-exam-details-card">
                    <div className="rr-exam-row">
                        <div>
                            <span className="rr-exam-title">Khám lâm sàng</span>
                            <div className="rr-exam-id">#{receptionDetail?.id || id || '--'}</div>
                        </div>
                        <div className="rr-exam-status-box">
                            <span className="rr-exam-status">{receptionDetail?.status || 'Đang thực hiện'}</span>
                            <span className="rr-exam-time">{receptionDetail?.receptionTime ? new Date(receptionDetail.receptionTime).toLocaleString('vi-VN') : '--:-- - --/--/----'}</span>
                        </div>
                    </div>

                    <div className="rr-exam-info-row">
                        <span className="rr-exam-label">Người thực hiện</span>
                        <span className="rr-exam-value">{treatmentDetail?.createdBy?.fullName || '---'}</span>
                    </div>
                    <div className="rr-exam-info-row">
                        <span className="rr-exam-label">Thời gian bắt đầu</span>
                        <span className="rr-exam-value">{treatmentDetail?.createdAt ? new Date(treatmentDetail.createdAt).toLocaleString('vi-VN') : '--:-- - --/--/----'}</span>
                    </div>
                </div>

                <div className="rr-section-block">
                    <h3 className="rr-section-title">Kết quả chung <span className="rr-required">*</span></h3>
                    <div className="rr-textarea-wrapper">
                        <textarea
                            className="rr-textarea"
                            value={conclusionText}
                            onChange={(event) => setConclusionText(event.target.value)}
                            rows={4}
                        />
                        <span className="rr-char-count">2000</span>
                    </div>
                </div>

                <button className="rr-upload-btn">
                    <Upload size={18} color="#666" />
                    <span>Tải lên file kết quả khám bệnh</span>
                </button>

                <div className="rr-accordion">
                    <div className="rr-accordion-header" onClick={() => setIsMedsExpanded(!isMedsExpanded)}>
                        <h3>THUỐC & VẬT TƯ ĐI KÈM</h3>
                        {isMedsExpanded ? <ChevronUp size={20} color="#666" /> : <ChevronDown size={20} color="#666" />}
                    </div>
                    {isMedsExpanded && (
                        <div className={`rr-accordion-content ${medsList.length === 0 ? 'rr-meds-empty' : 'rr-meds-list-container'}`}>
                            <button
                                className="rr-add-btn"
                                type="button"
                                aria-label="Thêm thuốc và vật tư"
                                onClick={() => navigate('/doctors/medicine-selector')}
                            >
                                <Plus size={24} color="#fff" />
                            </button>

                            {medsList.length > 0 && (
                                <div className="rr-meds-list-minimal">
                                    {medsList.map((med) => (
                                        <div key={med.id} className="rr-med-item-minimal">
                                            <div className="rr-med-row-header">
                                                <h4 className="rr-med-name-min">{med.name}</h4>
                                                <PencilLine size={16} color="#209D80" className="rr-med-edit-icon" />
                                            </div>
                                            <div className="rr-med-row-price">
                                                <div>
                                                    <span className="rr-med-price-min">{med.price}</span>
                                                    <span className="rr-med-unit-min"> {med.unit}</span>
                                                </div>
                                                <span className="rr-med-qty-min">{med.qty} {med.selectedUnit}</span>
                                            </div>

                                            {med.dosage.map((dosage, index) => (
                                                <div key={index} className="rr-med-row-dosage">
                                                    <span className="rr-dosage-lbl">{dosage.time}</span>
                                                    <span className="rr-dosage-val">{dosage.count}</span>
                                                </div>
                                            ))}

                                            <div className="rr-med-row-note">
                                                <span className="rr-note-lbl">Chỉ định khác</span>
                                                <span className="rr-note-val">{med.note}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="rr-section-block rr-mb-extra">
                    <h3 className="rr-section-title">Kết luận <span className="rr-required">*</span></h3>
                    <div className="rr-radio-grid">
                        {RADIO_OPTIONS.map((option) => (
                            <label key={option.id} className="rr-radio-label">
                                <input
                                    type="radio"
                                    name="conclusion"
                                    value={option.id}
                                    checked={selectedConclusion === option.id}
                                    onChange={() => setSelectedConclusion(option.id)}
                                />
                                <span className="rr-radio-custom"></span>
                                {option.label}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="rr-bottom-actions">
                <button className="rr-btn-cancel" onClick={() => navigate(`/doctors/service-order/${id ?? 1}`)}>Hủy bỏ</button>
                <button className="rr-btn-confirm" onClick={handleConfirm}>{isSaving ? 'Đang lưu...' : 'Xác nhận'}</button>
            </div>

            {showDosageModal && (
                <>
                    <div className="rr-dosage-modal-overlay" onClick={() => setShowDosageModal(false)}></div>
                    <div className="rr-dosage-modal-content">
                        <div className="rr-dosage-modal-handle"></div>
                        <h2 className="rr-dosage-modal-title">Liều dùng</h2>

                        <div className="rr-dosage-main-area">
                            {['Sáng', 'Trưa', 'Chiều', 'Tối'].map((time, idx) => (
                                <div key={time} className="rr-dosage-row">
                                    <span className="rr-dosage-label">{time}</span>
                                    <div className="rr-dosage-controls">
                                        <div className="rr-dosage-stepper">
                                            <button className="rr-dosage-step-btn">
                                                <Minus size={16} color="#666" />
                                            </button>
                                            <span className="rr-dosage-step-val">{idx % 2 === 0 ? 1 : 0}</span>
                                            <button className="rr-dosage-step-btn">
                                                <Plus size={16} color="#666" />
                                            </button>
                                        </div>
                                        <div className="rr-dosage-unit">
                                            <span>Viên</span>
                                            <ChevronDown size={16} color="#888" />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="rr-dosage-note-row">
                                <span className="rr-dosage-label">Chỉ định khác</span>
                                <div className="rr-dosage-textarea-box">
                                    <textarea className="rr-dosage-textarea" defaultValue="Uống thuốc trước khi ăn"></textarea>
                                    <span className="rr-dosage-char-count">2000</span>
                                </div>
                            </div>
                        </div>

                        <div className="rr-dosage-bottom-action">
                            <button className="rr-dosage-btn-confirm-final" onClick={() => setShowDosageModal(false)}>
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </>
            )}

            <FeatureDevelopingModal open={showFeatureModal} onClose={handleCloseFeatureModal} />
        </div>
    );
};

export default RecordResult;
