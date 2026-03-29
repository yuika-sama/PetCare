import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import receptionService from '../../api/receptionService';
import treatmentService from '../../api/treatmentService';

const AlertBadgeIcon = () => <TriangleAlert size={24} color="#ef4444" strokeWidth={2} />;

export default function ServiceOrder() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('Dịch vụ');
    const [selectedConclusion, setSelectedConclusion] = useState('');
    const [showFinishModal, setShowFinishModal] = useState(false);
    const MAX_CONCLUSION_LENGTH = 2000;
    const [conclusionText, setConclusionText] = useState('Ho có đờm, khó khè. Vòm họng sung tấy');
    const [receptionDetail, setReceptionDetail] = useState(null);
    const [treatmentDetail, setTreatmentDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setIsLoading(true);
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
                    setSelectedConclusion(treatmentData.type);
                }
            } catch {
                if (!isMounted) return;
                setReceptionDetail(null);
                setTreatmentDetail(null);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        if (id) {
            fetchData();
        }

        return () => {
            isMounted = false;
        };
    }, [id]);

    const petInfo = useMemo(() => {
        const pet = receptionDetail?.pet;
        return {
            name: pet?.name || '---',
            breed: pet?.breed || pet?.species || '---',
            gender: (pet?.gender || '').toLowerCase() === 'female' ? 'female' : 'male',
            age: '-- Tuổi',
            weight: pet?.weight ? `${pet.weight}kg` : '--kg',
            hasAlert: Boolean(receptionDetail?.note)
        };
    }, [receptionDetail]);

    const serviceName = receptionDetail?.examForm?.examType || 'Khám lâm sàng';
    const executorName = treatmentDetail?.createdBy?.fullName || 'Người thực hiện';

    const saveTreatmentConclusion = async () => {
        const payload = {
            type: selectedConclusion || 'Điều trị ngoại trú',
            plan: conclusionText,
            medicalRecord: { id: Number(id) || undefined },
        };

        if (treatmentDetail?.id) {
            return treatmentService.patchTreatmentSlipById(treatmentDetail.id, payload);
        }
        return treatmentService.createTreatmentSlip(payload);
    };

    const handleFinish = async () => {
        try {
            await saveTreatmentConclusion();
        } catch {
            // Keep UX flow by still showing completion modal when backend contract is unavailable.
        }
        setShowFinishModal(true);
    };

    const tabs = ['Dịch vụ', 'Kết luận phiếu khám', 'Lịch sử điều trị'];
    const conclusionOptions = ['Cận lâm sàng', 'Điều trị nội trú', 'Điều trị ngoại trú', 'Kết thúc cho về'];

    return (
        <div className="service-order-page">
            {/* Header */}
            <header className="so-header">
                <button className="so-btn-icon" onClick={() => navigate(`/doctors/tickets/${id ?? 1}`)}><ChevronLeft size={24} color="#1a1a1a" /></button>
                <h1 className="so-title">Đơn dịch vụ</h1>
                {/* <button className="so-btn-icon"><MoreVertical size={24} color="#1a1a1a" /></button> */}
            </header>

            <div className="so-content">
                {/* Customer Info */}
                <div className="so-customer-card">
                    <div className="so-customer-row">
                        <div>
                            <h2 className="so-customer-name">{receptionDetail?.client?.fullName || '---'}</h2>
                            <div className="so-customer-phone">
                                <Phone size={14} className="so-icon-phone" />
                                <span>{receptionDetail?.client?.phoneNumber || '---'}</span>
                            </div>
                        </div>
                        {/* <div className="so-payment-info">
                            <span className="so-paid">0đ</span>
                            <span className="so-total">/1.000.000đ</span>
                        </div> */}
                    </div>

                    <Divider/>
                    
                    <div className="so-created-info">
                        <span>
                            Được tạo từ đơn tiếp đón lúc <span className="so-time">{receptionDetail?.receptionTime ? new Date(receptionDetail.receptionTime).toLocaleString('vi-VN') : '--:-- --/--/----'}</span>
                        </span>
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
                                        <span className="so-service-name">{serviceName}</span>
                                        <span className="so-service-status pending">Chờ thực hiện</span>
                                    </div>
                                    <div className="so-service-price">
                                        <span className="so-price-val">0đ</span>
                                        <span className="so-price-unit"> /lượt x1</span>
                                    </div>
                                    <div className="so-service-executor">
                                        <span className="so-exec-label">Người thực hiện</span>
                                        <span className="so-exec-name">{executorName}</span>
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
                                <button
                                    className="so-result-summary-btn"
                                    type="button"
                                    onClick={() => navigate('/doctors/result-summary', {
                                        state: {
                                            receptionId: id,
                                            treatmentSlipId: treatmentDetail?.id || null,
                                        },
                                    })}
                                >
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
                    <button className="so-btn-finish" onClick={handleFinish}>Kết thúc</button>
                </div>
            ) : (
                <div className="so-bottom-actions">
                    <button className="so-btn-cancel" onClick={() => navigate(`/doctors/tickets/${id ?? 1}`)}>Hủy bỏ</button>
                    <button className="so-btn-execute" onClick={() => navigate(`/doctors/record-result/${id ?? 1}`)}>Thực hiện</button>
                </div>
            )}

            <FeatureDevelopingModal open={showFinishModal} onClose={() => setShowFinishModal(false)} />
        </div>
    );
}
