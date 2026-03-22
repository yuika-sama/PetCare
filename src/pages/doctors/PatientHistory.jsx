import React, { useMemo, useState } from 'react';
import DoctorLayout from '../../layouts/DoctorLayout';
import './PatientHistory.css';

const historyRows = [
    { id: 'H001', patient: 'Nguyễn Anh Đức', pet: 'Kuro', diagnosis: 'Viêm hô hấp', date: '18/03/2026', doctor: 'BS. Hà Huy An' },
    { id: 'H002', patient: 'Nguyễn Anh Đức', pet: 'Kuro', diagnosis: 'Tái khám sau điều trị', date: '20/02/2026', doctor: 'BS. Bình' },
    { id: 'H003', patient: 'Lê Huyền Linh', pet: 'Mike', diagnosis: 'Rối loạn tiêu hóa', date: '10/03/2026', doctor: 'BS. Hà Huy An' }
];

const PatientHistory = () => {
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const keyword = query.trim().toLowerCase();
        return historyRows.filter((row) => !keyword || `${row.id} ${row.patient} ${row.pet} ${row.diagnosis}`.toLowerCase().includes(keyword));
    }, [query]);

    return (
        <DoctorLayout>
            <div className="patient-history-page">
                <h1>Lịch sử khám</h1>
                <p>Tra cứu lịch sử hồ sơ bệnh nhân để hỗ trợ chẩn đoán.</p>

                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Tìm theo mã hồ sơ, khách hàng, thú cưng, chẩn đoán"
                />

                <div className="ph-list">
                    {filtered.map((row) => (
                        <article key={row.id} className="ph-card">
                            <div>
                                <strong>{row.patient} - {row.pet}</strong>
                                <p>{row.diagnosis}</p>
                                <small>{row.date} | {row.doctor}</small>
                            </div>
                            <span>{row.id}</span>
                        </article>
                    ))}
                    {filtered.length === 0 && <div className="ph-empty">Không tìm thấy lịch sử phù hợp.</div>}
                </div>
            </div>
        </DoctorLayout>
    );
};

export default PatientHistory;
