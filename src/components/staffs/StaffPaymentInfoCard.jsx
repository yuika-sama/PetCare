import React from 'react';
import './StaffPaymentInfoCard.css';
import { Headset, Printer } from 'lucide-react';

const StaffPaymentInfoCard = ({ 
    orderId = "#25REC215663", 
    time = "10:03 - 20/03/2026", 
    status = "Hoàn thành",
    customer = { 
        name: "Nguyễn Anh Đức", 
        phone: "0912345678" 
    },
    cashier = { 
        name: "Nguyễn Thu Hương", 
        phone: "0912345678" 
    }
}) => {
    return (
        <section className="staff-payment-info-card">
            <div className="staff-payment-qr-box">
                <p className="qr-title">Quét mã để thanh toán</p>
                <div className="qr-circle">
                    <Headset size={32} strokeWidth={1.5} />
                </div>
                <p className="qr-note">
                    Chưa hỗ trợ tạo mã,<br /> 
                    vui lòng chọn hình thức<br /> 
                    thanh toán QR
                </p>
                <button type="button" className="print-btn">
                    <span>In đơn</span>
                    <Printer size={24} strokeWidth={2} />
                </button>
            </div>

            <div className="staff-payment-order-info">
                <p className="created-time">{time}</p>
                <span className="status-pill">{status}</span>
                <h2 className="order-id-title">{orderId}</h2>

                <div className="info-group">
                    <span className="group-label">Khách hàng</span>
                    <strong className="group-value">{customer.name}</strong>
                    <span className="group-sub">{customer.phone}</span>
                </div>

                <div className="info-group">
                    <span className="group-label">Thu ngân</span>
                    <strong className="group-value">{cashier.name}</strong>
                    <span className="group-sub">{cashier.phone}</span>
                </div>
            </div>
        </section>
    );
};

export default StaffPaymentInfoCard;
