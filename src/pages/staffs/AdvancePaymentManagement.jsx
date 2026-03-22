import React, { useMemo, useState } from 'react';
import StaffNavBar from '../../components/staffs/StaffNavBar';
import './AdvancePaymentManagement.css';

const initialRows = [
    { id: 'ADV001', customer: 'Nguyễn Anh Đức', amount: 500000, status: 'Đã thu', source: 'Nhập viện' },
    { id: 'ADV002', customer: 'Lê Huyền Linh', amount: 300000, status: 'Chờ thu', source: 'Đặt cọc khám tổng quát' }
];

const AdvancePaymentManagement = () => {
    const [rows, setRows] = useState(initialRows);
    const [keyword, setKeyword] = useState('');

    const filtered = useMemo(() => {
        const key = keyword.trim().toLowerCase();
        return rows.filter((item) => !key || `${item.id} ${item.customer} ${item.source}`.toLowerCase().includes(key));
    }, [rows, keyword]);

    return (
        <div className="staff-advance-page">
            <div className="staff-advance-content">
                <h1>Quản lý phiếu tạm ứng</h1>
                <input
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    placeholder="Tìm theo mã, tên khách hàng, nguồn tạm ứng"
                />

                <div className="sap-list">
                    {filtered.map((row) => (
                        <article key={row.id} className="sap-card">
                            <div>
                                <strong>{row.id} - {row.customer}</strong>
                                <p>{row.source}</p>
                            </div>
                            <div className="sap-right">
                                <span className={`sap-status ${row.status === 'Đã thu' ? 'done' : ''}`}>{row.status}</span>
                                <b>{row.amount.toLocaleString('vi-VN')}đ</b>
                            </div>
                        </article>
                    ))}
                </div>

                <button
                    type="button"
                    className="sap-create"
                    onClick={() => {
                        const id = `ADV${Date.now().toString().slice(-4)}`;
                        setRows((prev) => [
                            { id, customer: 'Khách mới', amount: 200000, status: 'Chờ thu', source: 'Tạm ứng mới' },
                            ...prev
                        ]);
                    }}
                >
                    Tạo phiếu tạm ứng
                </button>
            </div>
            <StaffNavBar />
        </div>
    );
};

export default AdvancePaymentManagement;
