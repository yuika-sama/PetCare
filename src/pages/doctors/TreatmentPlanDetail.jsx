import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import DoctorLayout from '../../layouts/DoctorLayout';
import './TreatmentPlanDetail.css';

const TreatmentPlanDetail = () => {
    const { id } = useParams();
    const [editable, setEditable] = useState(true);
    const [form, setForm] = useState({
        diagnosis: 'Theo dõi hô hấp cấp',
        protocol: 'Khí dung 5 ngày, tái khám sau 48h',
        instruction: 'Giữ ấm cơ thể, không tắm trong 5 ngày'
    });

    const canEdit = useMemo(() => editable, [editable]);

    return (
        <DoctorLayout>
            <div className="treatment-detail-page">
                <h1>Chi tiết phiếu điều trị {id}</h1>
                <p>Bạn có thể sửa phiếu trong phạm vi phiên làm việc hiện tại.</p>

                <label>
                    Chẩn đoán
                    <textarea
                        value={form.diagnosis}
                        onChange={(event) => setForm({ ...form, diagnosis: event.target.value })}
                        disabled={!canEdit}
                    />
                </label>

                <label>
                    Phác đồ điều trị
                    <textarea
                        value={form.protocol}
                        onChange={(event) => setForm({ ...form, protocol: event.target.value })}
                        disabled={!canEdit}
                    />
                </label>

                <label>
                    Hướng dẫn tại nhà
                    <textarea
                        value={form.instruction}
                        onChange={(event) => setForm({ ...form, instruction: event.target.value })}
                        disabled={!canEdit}
                    />
                </label>

                <div className="td-actions">
                    <button type="button" onClick={() => setEditable((prev) => !prev)}>
                        {canEdit ? 'Khóa chỉnh sửa' : 'Mở chỉnh sửa'}
                    </button>
                    <button type="button" className="primary">Lưu phiếu điều trị</button>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default TreatmentPlanDetail;
