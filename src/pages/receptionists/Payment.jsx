import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css';
import StaffTopHeader from '../../components/receptionist/StaffTopHeader';
import StaffPaymentInfoCard from '../../components/receptionist/StaffPaymentInfoCard';
import StaffCostSummaryCard from '../../components/receptionist/StaffCostSummaryCard';
import StaffPaymentFooterBar from '../../components/receptionist/StaffPaymentFooterBar';
import StaffPaymentModal from '../../components/receptionist/StaffPaymentModal';
import ReceptionistLayout from '../../layouts/ReceptionistLayout';
import { RECEPTIONIST_PATHS } from '../../routes/receptionistPaths';
import paymentService from '../../api/paymentService';
import userService from '../../api/userService';

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentError, setPaymentError] = useState('');
    const [invoicePreview, setInvoicePreview] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [prepayments, setPrepayments] = useState([]);
    const [cashierInfo, setCashierInfo] = useState({ name: 'Thu ngân', phone: '--' });

    const receptionId = location.state?.receptionId;

    useEffect(() => {
        let isMounted = true;

        const fetchPaymentData = async () => {
            setIsLoading(true);
            setPaymentError('');

            try {
                const [previewRes, methodsRes, prepaymentsRes, userRes] = await Promise.allSettled([
                    receptionId ? paymentService.getInvoicePreview(receptionId) : Promise.resolve(null),
                    paymentService.getPaymentMethods(),
                    receptionId ? paymentService.getPrePayments({ receptionSlipId: receptionId }) : Promise.resolve(null),
                    userService.getUsers(),
                ]);

                if (!isMounted) return;

                setInvoicePreview(previewRes.status === 'fulfilled' ? previewRes.value?.data?.data || null : null);
                setPaymentMethods(methodsRes.status === 'fulfilled' ? methodsRes.value?.data?.data || [] : []);
                setPrepayments(prepaymentsRes.status === 'fulfilled' ? prepaymentsRes.value?.data?.data || [] : []);

                const user = userRes.status === 'fulfilled' ? userRes.value?.data?.data : null;
                if (user) {
                    setCashierInfo({
                        name: user?.fullName || 'Thu ngân',
                        phone: user?.phoneNumber || '--',
                    });
                }
            } catch {
                if (!isMounted) return;
                setPaymentError('Không thể tải thông tin thanh toán.');
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchPaymentData();

        return () => {
            isMounted = false;
        };
    }, [receptionId]);

    const goToTodayOrders = () => {
        navigate(RECEPTIONIST_PATHS.TODAY_ORDERS);
    };

    const formatCurrency = (amount) => `${Number(amount || 0).toLocaleString('vi-VN')}đ`;

    const paymentSummary = useMemo(() => {
        const subtotal = Number(invoicePreview?.totalAmount || 0);
        const paidAmount = prepayments.reduce((sum, item) => sum + Number(item?.amount || 0), 0);
        const remain = Math.max(subtotal - paidAmount, 0);
        return {
            subtotal,
            discount: 0,
            insurance: 0,
            total: remain,
            paidAmount,
        };
    }, [invoicePreview, prepayments]);

    const feeRows = useMemo(() => [
        {
            name: 'Chi phí khám và điều trị',
            unit: '01/lượt',
            price: Number(invoicePreview?.totalAmount || 0).toLocaleString('vi-VN'),
            discount: '0',
            amount: Number(invoicePreview?.totalAmount || 0).toLocaleString('vi-VN'),
        },
    ], [invoicePreview]);

    const handleConfirmPayment = async ({ amount, note, paymentMethodId }) => {
        if (isSubmitting) return;

        const amountValue = Number(String(amount || '').replace(/\D/g, ''));
        if (!paymentMethodId) {
            setPaymentError('Vui lòng chọn phương thức thanh toán.');
            return;
        }
        if (!amountValue || amountValue <= 0) {
            setPaymentError('Vui lòng nhập số tiền hợp lệ.');
            return;
        }

        setIsSubmitting(true);
        setPaymentError('');
        try {
            if (invoicePreview?.medicalRecord?.id) {
                await paymentService.createInvoice({
                    medicalRecord: { id: invoicePreview.medicalRecord.id },
                    paymentMethod: { id: Number(paymentMethodId) },
                    totalAmount: amountValue,
                    note: note || 'Thanh toán tại quầy',
                    status: 'PAID',
                });
            } else {
                await paymentService.createPrePayment({
                    receptionRecord: { id: receptionId },
                    paymentMethod: { id: Number(paymentMethodId) },
                    amount: amountValue,
                });
            }

            setIsModalOpen(false);
            goToTodayOrders();
        } catch {
            setPaymentError('Không thể ghi nhận thanh toán. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ReceptionistLayout>
        <div className="staff-payment-page">
            <div className="staff-payment-shell">
                <StaffTopHeader
                    title="Thanh toán"
                    onBack={goToTodayOrders}
                    size="normal"
                    rightNode={<div className="staff-payment-avatar" aria-label="Nhân viên" />}
                />

                {paymentError && <p className="staff-payment-error">{paymentError}</p>}
                {isLoading && <p className="staff-payment-error">Đang tải dữ liệu thanh toán...</p>}

                <div className="staff-payment-content">
                    <StaffPaymentInfoCard
                        time={invoicePreview?.createdAt || 'Chưa có thời gian lập hóa đơn'}
                        customer={{
                            name: location.state?.customerName || 'Khách hàng',
                            phone: location.state?.customerPhone || '--',
                        }}
                        cashier={cashierInfo}
                    />
                    <StaffCostSummaryCard
                        petInfo={{
                            name: 'Thú cưng',
                            breed: '--',
                            age: '--',
                            weight: '--',
                        }}
                        feeRows={feeRows}
                        paymentSummary={paymentSummary}
                        paymentHistoryAmount={paymentSummary.paidAmount}
                    />
                </div>
            </div>

            <StaffPaymentFooterBar
                onPayClick={() => setIsModalOpen(true)}
                onBackClick={goToTodayOrders}
                remainAmount={formatCurrency(paymentSummary.total)}
            />

            <StaffPaymentModal 
                open={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmPayment}
                remainAmount={formatCurrency(paymentSummary.total)}
                paymentMethods={paymentMethods}
                isSubmitting={isSubmitting}
            />
        </div>
        </ReceptionistLayout>
    );
};

export default Payment;
