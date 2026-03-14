import React from 'react';
import './StaffPaymentInfoCard.css';
import { Headset, Printer } from 'lucide-react';

const StaffPaymentInfoCard = () => {
    return (
        <section className="staff-payment-info-card">
            <div className="staff-payment-qr-box">
                <p className="qr-title">Quét mã để thanh toán</p>
                <div className="qr-circle">
                    <Headset size={28} />
                </div>
                <p className="qr-note">Chưa hỗ trợ tạo mã, vui lòng chọn hình thức thanh toán QR</p>
                <button type="button" className="print-btn">
                    <span>In đơn</span>
                    <Printer size={20} />
                </button>
            </div>

            <div className="staff-payment-order-info">
                <p className="created-time">10:03 - 20/03/2026</p>
                <span className="status-pill">Hoàn thành</span>
                <h2>#25REC215663</h2>

                <div className="info-group">
                    <span>Khách hàng</span>
                    <strong>Nguyễn Anh Đức</strong>
                    <small>0912345678</small>
                </div>

                <div className="info-group">
                    <span>Thu ngân</span>
                    <strong>Nguyễn Thu Hương</strong>
                    <small>0912345678</small>
                </div>
            </div>
        </section>
    );
};

export default StaffPaymentInfoCard;
