import React from 'react';
import { Phone, Mars, Cake, Weight } from 'lucide-react';
import './ReceivedCard.css';

const ReceivedCard = ({ customerName, phone, ticketId, status, createdAt, pets, sourceOrder, onPayment, paymentEnabled = true }) => {
    return (
        <div className="received-card">
            {/* Header */}
            <div className="rc-card-header">
                <h3 className="rc-card-name">{customerName}</h3>
                <span className="rc-card-ticket-id">#{ticketId}</span>
            </div>
            <div className="rc-card-sub-header">
                <div className="rc-card-phone">
                    <Phone size={14} color="#209D80" />
                    <span>{phone}</span>
                </div>
                <span className="rc-card-status">{status}</span>
            </div>
            <p className="rc-card-created">{createdAt}</p>

            {/* Pets */}
            <div className="rc-card-pets">
                {pets.map((pet, idx) => (
                    <div key={idx} className="rc-card-pet-row">
                        <span className="rc-card-pet-name">{pet.name}</span>
                        <span className="rc-card-pet-detail">
                            {pet.breed}
                            {pet.gender === 'male' && <Mars size={12} color="#3b82f6" style={{ marginLeft: '2px' }} />}
                        </span>
                        <span className="rc-card-pet-detail">
                            <Cake size={13} color="#888" />
                            {pet.age}
                        </span>
                        <span className="rc-card-pet-detail">
                            <Weight size={13} color="#888" />
                            {pet.weight}
                        </span>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="rc-card-footer">
                <div className="rc-card-source">
                    {sourceOrder ? (
                        <span>Tiếp đón từ đơn <span className="rc-card-source-id">#{sourceOrder}</span></span>
                    ) : (
                        <span>Tiếp đón trực tiếp</span>
                    )}
                </div>
                <button
                    className={`rc-card-pay-btn ${paymentEnabled ? '' : 'disabled'}`}
                    onClick={paymentEnabled ? onPayment : undefined}
                >
                    Thanh toán
                </button>
            </div>
        </div>
    );
};

export default ReceivedCard;
