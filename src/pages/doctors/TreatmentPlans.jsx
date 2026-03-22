import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorLayout from '../../layouts/DoctorLayout';
import './TreatmentPlans.css';

const plans = [
    { id: 'DT001', patient: 'Nguyễn Anh Đức', pet: 'Kuro', type: 'Nội trú', status: 'Đang điều trị', updatedAt: '20/03/2026 10:15' },
    { id: 'DT002', patient: 'Lê Huyền Linh', pet: 'Mike', type: 'Ngoại trú', status: 'Chờ cấp thuốc', updatedAt: '20/03/2026 09:40' }
];

const TreatmentPlans = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [type, setType] = useState('all');

    const filtered = useMemo(() => {
        const key = query.trim().toLowerCase();
        return plans.filter((plan) => {
            const matchesKeyword = !key || `${plan.id} ${plan.patient} ${plan.pet} ${plan.status}`.toLowerCase().includes(key);
            const matchesType = type === 'all' || plan.type === type;
            return matchesKeyword && matchesType;
        });
    }, [query, type]);

    return (
        <DoctorLayout>
            <div className="treatment-plans-page">
                <div className="tp-header">
                    <h1>Phiếu điều trị</h1>
                    <button type="button" onClick={() => navigate('/doctors/treatment-plans/new')}>Tạo phiếu</button>
                </div>

                <div className="tp-filters">
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Tìm theo mã phiếu, bệnh nhân, trạng thái"
                    />
                    <select value={type} onChange={(event) => setType(event.target.value)}>
                        <option value="all">Tất cả loại</option>
                        <option value="Nội trú">Nội trú</option>
                        <option value="Ngoại trú">Ngoại trú</option>
                    </select>
                </div>

                <div className="tp-list">
                    {filtered.map((plan) => (
                        <article key={plan.id} className="tp-card" onClick={() => navigate(`/doctors/treatment-plans/${plan.id}`)}>
                            <div>
                                <strong>{plan.patient} - {plan.pet}</strong>
                                <p>{plan.type} | {plan.status}</p>
                                <small>Cập nhật: {plan.updatedAt}</small>
                            </div>
                            <span>{plan.id}</span>
                        </article>
                    ))}
                    {filtered.length === 0 && <div className="tp-empty">Không tìm thấy phiếu điều trị.</div>}
                </div>
            </div>
        </DoctorLayout>
    );
};

export default TreatmentPlans;
