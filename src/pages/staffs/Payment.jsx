import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';
import StaffTopHeader from '../../components/staffs/StaffTopHeader';
import StaffPaymentInfoCard from '../../components/staffs/StaffPaymentInfoCard';
import StaffCostSummaryCard from '../../components/staffs/StaffCostSummaryCard';
import StaffPaymentFooterBar from '../../components/staffs/StaffPaymentFooterBar';

const Payment = () => {
    const navigate = useNavigate();

    return (
        <div className="staff-payment-page">
            <div className="staff-payment-shell">
                <StaffTopHeader
                    title="Thanh toán"
                    onBack={() => navigate(-1)}
                    size="normal"
                    rightNode={<div className="staff-payment-avatar" aria-label="Nhân viên" />}
                />

                <div className="staff-payment-content">
                    <StaffPaymentInfoCard />
                    <StaffCostSummaryCard />
                </div>
            </div>

            <StaffPaymentFooterBar />
        </div>
    );
};

export default Payment;
