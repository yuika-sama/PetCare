import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronUp } from 'lucide-react';
import './ResultSummary.css';
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/600.css";
import receptionService from '../../api/receptionService';
import treatmentService from '../../api/treatmentService';

const toArray = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.items)) return raw.items;
    if (Array.isArray(raw?.content)) return raw.content;
    if (Array.isArray(raw?.results)) return raw.results;
    return [];
};

const mapUsedItem = (item) => ({
    id: item?.id || item?.serviceId || item?.service?.id,
    name: item?.serviceName || item?.service?.name || 'Dịch vụ cận lâm sàng',
    description: item?.service?.description || item?.description || 'Dịch vụ đã chọn',
    expected: `${item?.quantity || 1} lượt`,
    actual: `${item?.quantity || 1} lượt`,
    image: 'https://placehold.co/80x80/e7f3ef/1a9c82?text=Svc',
});

const ResultSummary = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const receptionId = location.state?.receptionId;
    const treatmentSlipId = location.state?.treatmentSlipId;

    const [receptionDetail, setReceptionDetail] = useState(null);
    const [treatmentDetail, setTreatmentDetail] = useState(null);
    const [usedServices, setUsedServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [receptionResponse, treatmentResponse, selectedServicesResponse] = await Promise.allSettled([
                    receptionId ? receptionService.getReceptionById(receptionId) : Promise.resolve(null),
                    treatmentSlipId ? treatmentService.getTreatmentSlipById(treatmentSlipId) : Promise.resolve(null),
                    receptionId ? receptionService.getSelectedParaclinicalServices(receptionId) : Promise.resolve(null),
                ]);

                if (!isMounted) return;

                const receptionData = receptionResponse.status === 'fulfilled'
                    ? receptionResponse.value?.data?.data || null
                    : null;
                const treatmentData = treatmentResponse.status === 'fulfilled'
                    ? treatmentResponse.value?.data?.data || null
                    : null;
                const selectedServicesData = selectedServicesResponse.status === 'fulfilled'
                    ? toArray(selectedServicesResponse.value?.data?.data)
                    : [];

                setReceptionDetail(receptionData);
                setTreatmentDetail(treatmentData);
                setUsedServices(selectedServicesData.map(mapUsedItem));
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();
        return () => {
            isMounted = false;
        };
    }, [receptionId, treatmentSlipId]);

    const detailSections = useMemo(() => {
        const examType = receptionDetail?.examForm?.examType || 'Khám lâm sàng';
        const hasSummaryData = Boolean(
            treatmentDetail?.plan || receptionDetail?.symptomDescription || usedServices.length > 0
        );

        return [
            {
                id: 1,
                title: examType,
                subtitle: '',
                summary: treatmentDetail?.plan || receptionDetail?.symptomDescription || 'Chưa có dữ liệu kết quả.',
                hasUploads: false,
            },
            {
                id: 2,
                title: 'Kết luận điều trị',
                subtitle: treatmentDetail?.type || 'Điều trị ngoại trú',
                summary: treatmentDetail?.plan || 'Chưa có dữ liệu kết luận.',
                hasUploads: hasSummaryData,
            },
        ];
    }, [receptionDetail, treatmentDetail, usedServices]);

    return (
        <div className="rs-page">
            <header className="rs-header">
                <button className="rs-icon-btn" type="button" onClick={() => navigate(-1)} aria-label="Quay lại">
                    <ChevronLeft size={24} />
                </button>
                <h1>Tổng hợp kết quả</h1>
            </header>

            <main className="rs-content">
                {isLoading && <article className="rs-card"><p>Đang tải dữ liệu tổng hợp...</p></article>}

                {!isLoading && detailSections.map((section) => (
                    <article className="rs-card" key={section.id}>
                        <div className="rs-card-title-row">
                            <div>
                                <h3>{section.title}</h3>
                                {section.subtitle && <p className="rs-subtitle">{section.subtitle}</p>}
                            </div>
                            <ChevronUp size={18} color="#606b67" />
                        </div>

                        <div className="rs-divider" />

                        <div className="rs-block">
                            <h4>Kết quả chung</h4>
                            <p>{section.summary}</p>
                        </div>

                        {section.hasUploads && (
                            <>
                                <div className="rs-block">
                                    <h4 className="rs-block-files-title">File và ảnh tải lên</h4>
                                    <div className="rs-images">
                                        <div className="rs-image-card">
                                            <strong>Ảnh kết quả 1</strong>
                                            <img src="https://images.unsplash.com/photo-1583512603806-077998240c7a?w=600&auto=format&fit=crop&q=60" alt="Ảnh kết quả 1" />
                                        </div>
                                        <div className="rs-image-card">
                                            <strong>Ảnh kết quả 2</strong>
                                            <img src="https://images.unsplash.com/photo-1583512603806-077998240c7a?w=600&auto=format&fit=crop&q=60" alt="Ảnh kết quả 2" />
                                        </div>
                                    </div>
                                    {usedServices.length === 0 && (
                                        <div className="rs-files">
                                            <div>Chưa có file đính kèm</div>
                                        </div>
                                    )}
                                </div>

                                <div className="rs-block">
                                    <h4 className="rs-block-title">Danh sách thuốc và vật tư thực tế sử dụng</h4>
                                    <div className="rs-med-list">
                                        {usedServices.map((item, index) => (
                                            <div className="rs-med-item" key={`${section.id}-${item.id || item.name}-${index}`}>
                                                <img src={item.image} alt={item.name} />
                                                <div className="rs-med-info">
                                                    <strong>{item.name}</strong>
                                                    <p>{item.description}</p>
                                                    <div className="rs-med-stats">
                                                        <span>Dự kiến: <b>{item.expected}</b></span>
                                                        <span>Thực tế: <b>{item.actual}</b></span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {usedServices.length === 0 && (
                                            <p>Chưa có dữ liệu dịch vụ/thuốc sử dụng.</p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </article>
                ))}
            </main>

            <footer className="rs-footer">
                <button type="button" onClick={() => navigate(-1)}>Xác nhận</button>
            </footer>
        </div>
    );
};

export default ResultSummary;
