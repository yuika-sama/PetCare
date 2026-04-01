import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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

const toArray = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.items)) return raw.items;
    if (Array.isArray(raw?.content)) return raw.content;
    if (Array.isArray(raw?.results)) return raw.results;
    return [];
};

const getPriceNumber = (item) => {
    const rawPrice = item?.price
        ?? item?.unitPrice
        ?? item?.sellingPrice
        ?? item?.retailPrice
        ?? item?.cost
        ?? item?.amount;

    if (rawPrice == null || rawPrice === '') return 0;
    if (typeof rawPrice === 'number') return rawPrice;

    const normalized = String(rawPrice).replace(/[^\d.-]/g, '');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
};

const formatVnd = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`;

const mapMedicineToUi = (item) => ({
    id: item?.id || item?.medicineId,
    name: item?.name || item?.medicineName || 'Thuốc/Vật tư',
    desc: item?.description || '',
    price: formatVnd(getPriceNumber(item)),
    unit: item?.unit ? (String(item.unit).startsWith('/') ? item.unit : `/${item.unit}`) : '/đơn vị',
    stock: item?.stock ?? item?.stockQuantity ?? '--',
    image: item?.imageUrl || 'https://placehold.co/80x80/f4f4f5/a1a1aa?text=Med',
    selected: true,
    qty: item?.qty || item?.quantity || 1,
    selectedUnit: item?.unit || 'Đơn vị',
    expanded: false,
    dosage: {
        morning: item?.dosage?.morning || 0,
        noon: item?.dosage?.noon || 0,
        afternoon: item?.dosage?.afternoon || 0,
        evening: item?.dosage?.evening || 0,
        note: item?.dosage?.note || item?.note || '',
    },
});

export const RecordResult = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const treatmentSlipId = location.state?.treatmentSlipId;
    const fileInputRef = useRef(null);
    const [isMedsExpanded, setIsMedsExpanded] = useState(true);
    const [conclusionText, setConclusionText] = useState('Ho có đờm, khò khè. Vòm họng sưng tấy');
    const [selectedConclusion, setSelectedConclusion] = useState(null);
    const [medsList, setMedsList] = useState([]);
    const [showDosageModal, setShowDosageModal] = useState(false);
    const [activeDosageMedId, setActiveDosageMedId] = useState(null);
    const [dosageDraft, setDosageDraft] = useState({
        morning: 0,
        noon: 0,
        afternoon: 0,
        evening: 0,
        note: '',
    });
    const [showFeatureModal, setShowFeatureModal] = useState(false);
    const [receptionDetail, setReceptionDetail] = useState(null);
    const [treatmentDetail, setTreatmentDetail] = useState(null);
    const [selectedParaclinical, setSelectedParaclinical] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const [receptionResponse, treatmentResponse, paraclinicalResponse] = await Promise.allSettled([
                    receptionService.getReceptionById(id),
                    treatmentSlipId ? treatmentService.getTreatmentSlipById(treatmentSlipId) : Promise.resolve(null),
                    id ? receptionService.getSelectedParaclinicalServices(id) : Promise.resolve(null),
                ]);

                if (!isMounted) return;

                const receptionData = receptionResponse.status === 'fulfilled' ? receptionResponse.value?.data?.data : null;
                const treatmentData = treatmentResponse.status === 'fulfilled' ? treatmentResponse.value?.data?.data : null;
                const paraclinicalData = paraclinicalResponse.status === 'fulfilled'
                    ? toArray(paraclinicalResponse.value?.data?.data)
                    : [];
                const medicinesFromApi = toArray(
                    treatmentData?.medicines
                    || treatmentData?.medicineItems
                    || treatmentData?.prescriptions
                ).map(mapMedicineToUi);
                const medicinesFromState = toArray(location.state?.selectedMedicines).map(mapMedicineToUi);

                setReceptionDetail(receptionData || null);
                setTreatmentDetail(treatmentData || null);
                setSelectedParaclinical(paraclinicalData);
                setMedsList(medicinesFromState.length > 0 ? medicinesFromState : medicinesFromApi);

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
    }, [id, treatmentSlipId, location.state?.selectedMedicines]);

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
                conclusionType: RADIO_OPTIONS.find((option) => option.id === selectedConclusion)?.label || 'Điều trị ngoại trú',
                summary: conclusionText,
                medicines: medsList
                    .filter((item) => item?.selected)
                    .map((item) => ({
                        medicineId: item?.id,
                        quantity: item?.qty || 1,
                        unit: item?.selectedUnit,
                        dosage: {
                            ...item?.dosage,
                        },
                    })),
                paraclinicalServices: selectedParaclinical.map((item) => ({
                    serviceId: item?.serviceId || item?.service?.id,
                    technicianId: item?.technicianId || item?.technician?.id,
                    quantity: item?.quantity || 1,
                })),
            };

            if (id) {
                await treatmentService.recordExamResult(id, payload, uploadedFiles);
            } else {
                await treatmentService.createTreatmentSlip({
                    type: payload.conclusionType,
                    plan: payload.summary,
                    medicalRecord: { id: Number(id) || undefined },
                });
            }
        } catch {
            // Keep UX flow while backend contract for this form is being finalized.
        } finally {
            setIsSaving(false);
            setShowFeatureModal(true);
        }
    };

    const handleOpenUpload = () => {
        fileInputRef.current?.click();
    };

    const handleSelectFiles = (event) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;
        setUploadedFiles((prev) => [...prev, ...files]);
        event.target.value = '';
    };

    const openDosageModal = (medicine) => {
        if (!medicine?.id) return;
        setActiveDosageMedId(medicine.id);
        setDosageDraft({
            morning: Number(medicine?.dosage?.morning) || 0,
            noon: Number(medicine?.dosage?.noon) || 0,
            afternoon: Number(medicine?.dosage?.afternoon) || 0,
            evening: Number(medicine?.dosage?.evening) || 0,
            note: medicine?.dosage?.note || medicine?.note || '',
        });
        setShowDosageModal(true);
    };

    const updateDosageValue = (field, delta) => {
        setDosageDraft((prev) => ({
            ...prev,
            [field]: Math.max(0, Number(prev?.[field] || 0) + delta),
        }));
    };

    const saveDosage = () => {
        if (activeDosageMedId == null) return;
        setMedsList((prev) =>
            prev.map((medicine) =>
                medicine.id === activeDosageMedId
                    ? {
                        ...medicine,
                        dosage: {
                            morning: dosageDraft.morning,
                            noon: dosageDraft.noon,
                            afternoon: dosageDraft.afternoon,
                            evening: dosageDraft.evening,
                            note: dosageDraft.note,
                        },
                    }
                    : medicine
            )
        );
        setShowDosageModal(false);
        setActiveDosageMedId(null);
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

                <button className="rr-upload-btn" type="button" onClick={handleOpenUpload}>
                    <Upload size={18} color="#666" />
                    <span>Tải lên file kết quả khám bệnh</span>
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleSelectFiles}
                />
                {uploadedFiles.length > 0 && (
                    <div className="rr-uploaded-files">
                        {uploadedFiles.map((file, index) => (
                            <div key={`${file.name}-${index}`}>{file.name}</div>
                        ))}
                    </div>
                )}

                <div className="rr-accordion">
                    <div className="rr-accordion-header" onClick={() => setIsMedsExpanded(!isMedsExpanded)}>
                        <h3>THUỐC & VẬT TƯ ĐI KÈM</h3>
                        {isMedsExpanded ? <ChevronUp size={20} color="#666" /> : <ChevronDown size={20} color="#666" />}
                    </div>
                    {isMedsExpanded && (
                        <div className={`rr-accordion-content ${medsList.length === 0 ? 'rr-meds-empty' : 'rr-meds-list-container'}`}>
                            {medsList.length > 0 ? (
                                <div className="rr-meds-list-minimal">
                                    {medsList.map((med, index) => {
                                        const quantity = Number(med?.qty ?? med?.quantity ?? 1) || 1;
                                        const quantityUnit = med?.selectedUnit || med?.unit?.replace('/', '') || 'Đơn vị';
                                        return (
                                        <div key={`${med?.id || med?.medicineId || med?.name || 'medicine'}-${index}`} className="rr-med-item-minimal">
                                            <div className="rr-med-row-header">
                                                <h4 className="rr-med-name-min">{med.name}</h4>
                                                <button
                                                    type="button"
                                                    className="rr-med-edit-btn"
                                                    onClick={() => openDosageModal(med)}
                                                    aria-label={`Chỉnh liều dùng cho ${med.name}`}
                                                >
                                                    <PencilLine size={16} color="#209D80" className="rr-med-edit-icon" />
                                                </button>
                                            </div>
                                            <div className="rr-med-row-price">
                                                <div>
                                                    <span className="rr-med-price-min">{med.price}</span>
                                                    <span className="rr-med-unit-min"> {med.unit}</span>
                                                </div>
                                            </div>

                                            <div className="rr-med-row-note">
                                                <span className="rr-note-lbl">Số lượng</span>
                                                <span className="rr-note-val">{quantity} {quantityUnit}</span>
                                            </div>

                                            {[
                                                { label: 'Sáng', value: med?.dosage?.morning || 0 },
                                                { label: 'Trưa', value: med?.dosage?.noon || 0 },
                                                { label: 'Chiều', value: med?.dosage?.afternoon || 0 },
                                                { label: 'Tối', value: med?.dosage?.evening || 0 },
                                            ].filter((dosage) => dosage.value > 0).map((dosage) => (
                                                <div key={`${med.id}-${dosage.label}`} className="rr-med-row-dosage">
                                                    <span className="rr-dosage-lbl">{dosage.label}</span>
                                                    <span className="rr-dosage-val">{dosage.value}</span>
                                                </div>
                                            ))}

                                            <div className="rr-med-row-note">
                                                <span className="rr-note-lbl">Chỉ định khác</span>
                                                <span className="rr-note-val">{med?.dosage?.note || med?.note || '---'}</span>
                                            </div>
                                        </div>
                                    )})}
                                </div>
                            ) : null}

                            <div className="rr-add-btn-wrapper">
                                <button
                                    className="rr-add-btn"
                                    type="button"
                                    aria-label="Thêm thuốc và vật tư"
                                    onClick={() => navigate('/doctors/medicine-selector', {
                                        state: {
                                            receptionId: id,
                                            treatmentSlipId,
                                            selectedMedicines: medsList,
                                            returnPath: `/doctors/record-result/${id ?? 1}`,
                                        },
                                    })}
                                >
                                    <Plus size={24} color="#fff" />
                                </button>
                            </div>
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
                                            <button
                                                className="rr-dosage-step-btn"
                                                type="button"
                                                onClick={() => updateDosageValue(
                                                    idx === 0 ? 'morning' : idx === 1 ? 'noon' : idx === 2 ? 'afternoon' : 'evening',
                                                    -1
                                                )}
                                            >
                                                <Minus size={16} color="#666" />
                                            </button>
                                            <span className="rr-dosage-step-val">
                                                {idx === 0
                                                    ? dosageDraft.morning
                                                    : idx === 1
                                                        ? dosageDraft.noon
                                                        : idx === 2
                                                            ? dosageDraft.afternoon
                                                            : dosageDraft.evening}
                                            </span>
                                            <button
                                                className="rr-dosage-step-btn"
                                                type="button"
                                                onClick={() => updateDosageValue(
                                                    idx === 0 ? 'morning' : idx === 1 ? 'noon' : idx === 2 ? 'afternoon' : 'evening',
                                                    1
                                                )}
                                            >
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
                                    <textarea
                                        className="rr-dosage-textarea"
                                        value={dosageDraft.note}
                                        onChange={(event) => setDosageDraft((prev) => ({ ...prev, note: event.target.value }))}
                                    ></textarea>
                                    <span className="rr-dosage-char-count">2000</span>
                                </div>
                            </div>
                        </div>

                        <div className="rr-dosage-bottom-action">
                            <button className="rr-dosage-btn-confirm-final" onClick={saveDosage}>
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
