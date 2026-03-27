import React from 'react';
import { Phone, Mars, Venus, Calendar, Weight } from 'lucide-react';
import './ReceivedCard.css';

const ReceivedCard = ({
    customerName,
    phone,
    status,
    createdAt,
    pets,
    sourceOrder,
    onPayment,
    paymentEnabled = true,
    hideSource = false,
    totalAmount,
    paymentButtonLabel = 'Thanh toán',
}) => {

    return (
        <div className="received-card">
            <div className="rc-card-header">
                <h3 className="rc-card-name">{customerName}</h3>
                <div className="rc-card-status-group">
                    <span className="rc-card-status">{status}</span>
                </div>
            </div>

            <div className="rc-card-sub-header">
                <div className="rc-card-phone">
                    <Phone size={16} color="#209D80" strokeWidth={2.5} />
                    <span>{phone}</span>
                </div>
            </div>

            <p className="rc-card-created">{createdAt}</p>
            <hr className="rc-divider" />

            <div className="rc-card-pets">
                {pets.map((pet, idx) => (
                    <div key={idx} className="rc-card-pet-info-box">
                        <span className="rc-card-pet-details">
                            <span className="rc-card-pet-name">{pet.name}</span>
                            <span className="rc-card-pet-breed">
                                {pet.breed}
                                {pet.gender === 'male' && (
                                    <Mars size={12} color="#3b82f6" style={{ marginLeft: '4px' }} />
                                )}
                                {pet.gender === 'female' && (
                                    <Venus size={12} color="#ec4899" style={{ marginLeft: '4px' }} />
                                )}
                            </span>
                            <span className="rc-card-pet-stat">
                                <Calendar size={14} color="#888" />
                                {pet.age}
                            </span>
                            <span className="rc-card-pet-stat">
                                <Weight size={14} color="#888" />
                                {pet.weight}
                            </span>
                        </span>
                    </div>
                ))}
            </div>

            <hr className="rc-divider" />

            <div className={`rc-card-footer ${hideSource ? 'full-btn' : ''}`}>
                {!!totalAmount && (
                    <div className="rc-card-amount">{totalAmount}</div>
                )}

                {!hideSource && !totalAmount && (
                    <div className="rc-card-source">
                        {sourceOrder ? (
                            <span>
                                Tiếp đón từ đơn <span className="rc-card-source-id">#{sourceOrder}</span>
                            </span>
                        ) : (
                            <span>Tiếp đón trực tiếp</span>
                        )}
                    </div>
                )}

                <button
                    className={`rc-card-pay-btn ${paymentEnabled ? '' : 'disabled'} ${hideSource ? 'full-width' : ''}`}
                    onClick={paymentEnabled ? onPayment : undefined}
                >
                    {paymentButtonLabel}
                </button>
            </div>
        </div>
    );
};

export default ReceivedCard;
