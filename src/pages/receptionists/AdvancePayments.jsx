import React, { useMemo, useState } from 'react';
import ReceptionistLayout from '../../layouts/ReceptionistLayout';
import './AdvancePayments.css';

const initialRows = [
    { id: 'ADV001', customer: 'Nguyễn Anh Đức', phone: '0912345678', amount: 500000, status: 'Chờ thanh toán', note: 'Nhập viện theo dõi', createdAt: '10:05 20/03/2026' },
    { id: 'ADV002', customer: 'Lê Huyền Linh', phone: '0816278274', amount: 300000, status: 'Đã thu', note: 'Đặt cọc khám tổng quát', createdAt: '09:35 20/03/2026' }
];

const currency = (value) => `${value.toLocaleString('vi-VN')}đ`;

const AdvancePayments = () => {
    const [rows, setRows] = useState(initialRows);
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('all');
    const [draft, setDraft] = useState({ customer: '', phone: '', amount: '', note: '' });

    const filtered = useMemo(() => {
        const key = query.trim().toLowerCase();
        return rows.filter((row) => {
            const matchesKeyword = !key || `${row.id} ${row.customer} ${row.phone}`.toLowerCase().includes(key);
            const matchesStatus = status === 'all' || row.status === status;
            return matchesKeyword && matchesStatus;
        });
    }, [rows, query, status]);

    const createAdvance = () => {
        if (!draft.customer || !draft.phone || !draft.amount) return;
        const id = `ADV${Date.now().toString().slice(-4)}`;
        setRows((prev) => [
            {
                id,
                customer: draft.customer,
                phone: draft.phone,
                amount: Number(draft.amount),
                status: 'Chờ thanh toán',
                note: draft.note || '--',
                createdAt: 'Vừa tạo'
            },
            ...prev
        ]);
        setDraft({ customer: '', phone: '', amount: '', note: '' });
    };

    return (
        <ReceptionistLayout>
            <div className="advance-pay-page">
                <h1>Phiếu tạm ứng</h1>
                <p>Lễ tân tạo phiếu tạm ứng khi bệnh nhân cần đặt cọc trước khám/nhập viện.</p>

                <div className="ap-filters">
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Tìm theo mã phiếu, tên, số điện thoại"
                    />
                    <select value={status} onChange={(event) => setStatus(event.target.value)}>
                        <option value="all">Tất cả</option>
                        <option value="Chờ thanh toán">Chờ thanh toán</option>
                        <option value="Đã thu">Đã thu</option>
                    </select>
                </div>

                <div className="ap-create-box">
                    <h2>Tạo phiếu tạm ứng</h2>
                    <div className="ap-create-grid">
                        <input placeholder="Tên khách hàng" value={draft.customer} onChange={(event) => setDraft({ ...draft, customer: event.target.value })} />
                        <input placeholder="Số điện thoại" value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} />
                        <input placeholder="Số tiền tạm ứng" value={draft.amount} onChange={(event) => setDraft({ ...draft, amount: event.target.value.replace(/[^0-9]/g, '') })} />
                        <input placeholder="Ghi chú" value={draft.note} onChange={(event) => setDraft({ ...draft, note: event.target.value })} />
                    </div>
                    <button type="button" onClick={createAdvance}>Tạo phiếu</button>
                </div>

                <div className="ap-list">
                    {filtered.map((row) => (
                        <article key={row.id} className="ap-card">
                            <div>
                                <strong>{row.id}</strong>
                                <p>{row.customer} - {row.phone}</p>
                                <small>{row.createdAt}</small>
                            </div>
                            <div className="ap-right">
                                <span className={`ap-status ${row.status === 'Đã thu' ? 'done' : ''}`}>{row.status}</span>
                                <b>{currency(row.amount)}</b>
                            </div>
                        </article>
                    ))}
                    {filtered.length === 0 && <div className="ap-empty">Không có phiếu tạm ứng phù hợp.</div>}
                </div>
            </div>
        </ReceptionistLayout>
    );
};

export default AdvancePayments;
