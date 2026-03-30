import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronDown, Phone, PawPrint, CirclePlus, Cake, Weight, Mars, PenSquare } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReceptionistLayout from '../../layouts/ReceptionistLayout';
import { RECEPTIONIST_PATHS } from '../../routes/receptionistPaths';
import customerService from '../../api/customerService';
import petService from '../../api/petService';
import receptionService from '../../api/receptionService';
import './NewReception.css';

const NewReception = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedPet, setSelectedPet] = useState('');
    const [pets, setPets] = useState([]);
    const [customerId, setCustomerId] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [showAddPetModal, setShowAddPetModal] = useState(false);
    const [newPetName, setNewPetName] = useState('');
    const [newPetSpecies, setNewPetSpecies] = useState('');
    const [newPetBreed, setNewPetBreed] = useState('');
    const [isEmergency, setIsEmergency] = useState(false);
    const [weight, setWeight] = useState('');
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [examType, setExamType] = useState('');
    const [assignee, setAssignee] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [assignedDoctor, setAssignedDoctor] = useState('');
    const [assignedCases, setAssignedCases] = useState('--');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        const customer = location.state?.customer;
        if (!customer) return;

        setCustomerId(customer?.id || null);
        setCustomerName(customer?.name || '');
        setCustomerPhone(customer?.phone || '');

        const incomingPets = (customer?.pets || []).map((pet, index) => ({
            id: pet?.id || `temp-${index}`,
            name: pet?.name || 'Thú cưng',
            species: pet?.species || '',
            breed: pet?.breed || '',
        }));

        setPets(incomingPets);
        if (incomingPets.length > 0) {
            setSelectedPet(incomingPets[0].id);
        }
    }, [location.state]);

    const hydrateCustomerPets = async (id) => {
        const petsResponse = await customerService.getCustomerPets(id);
        const petItems = petsResponse?.data?.data || [];
        const mappedPets = petItems.map((pet) => ({
            id: pet?.id,
            name: pet?.name || 'Thú cưng',
            species: pet?.species || '',
            breed: pet?.breed || '',
        }));
        setPets(mappedPets);
        if (mappedPets.length > 0) {
            setSelectedPet(mappedPets[0].id);
        }
    };

    const goToTodayOrders = () => {
        navigate(RECEPTIONIST_PATHS.TODAY_ORDERS);
    };

    const handleCreatePet = async () => {
        if (!newPetName.trim() || !newPetSpecies || !newPetBreed.trim()) {
            return;
        }

        let createdPet = {
            id: `tmp-${Date.now()}`,
            name: newPetName.trim(),
            species: newPetSpecies,
            breed: newPetBreed.trim(),
        };

        if (customerId) {
            try {
                const response = await petService.createPet({
                    client: { id: customerId },
                    name: createdPet.name,
                    species: createdPet.species,
                    breed: createdPet.breed,
                    gender: 'male',
                    dateOfBirth: birthDate || undefined,
                    weight: weight ? Number(weight) : undefined,
                });
                const pet = response?.data?.data;
                if (pet?.id) {
                    createdPet = {
                        id: pet.id,
                        name: pet.name || createdPet.name,
                        species: pet.species || createdPet.species,
                        breed: pet.breed || createdPet.breed,
                    };
                }
            } catch {
                setSubmitError('Không thể tạo thú cưng mới. Vui lòng thử lại.');
                return;
            }
        }

        setPets((prev) => [...prev, createdPet]);
        setSelectedPet(createdPet.id);
        setShowAddPetModal(false);
        setNewPetName('');
        setNewPetSpecies('');
        setNewPetBreed('');
    };

    const resolveCustomer = async () => {
        const phone = customerPhone.trim();
        const name = customerName.trim();

        if (!phone || !name) {
            throw new Error('Vui lòng nhập họ tên và số điện thoại khách hàng.');
        }

        const foundResponse = await customerService.findCustomerByPhone(phone);
        const foundCustomer = foundResponse?.data?.data;

        if (foundCustomer?.id) {
            setCustomerId(foundCustomer.id);
            setCustomerName(foundCustomer.fullName || name);
            setCustomerPhone(foundCustomer.phoneNumber || phone);
            await hydrateCustomerPets(foundCustomer.id);
            return foundCustomer.id;
        }

        const createResponse = await customerService.createCustomer({
            fullName: name,
            phoneNumber: phone,
            pet: null,
        });
        const createdCustomer = createResponse?.data?.data;
        if (!createdCustomer?.id) {
            throw new Error('Không thể tạo mới khách hàng.');
        }

        setCustomerId(createdCustomer.id);
        return createdCustomer.id;
    };

    const handleCreateReception = async () => {
        if (isSubmitting) return;

        setSubmitError('');
        setIsSubmitting(true);
        try {
            const resolvedCustomerId = customerId || await resolveCustomer();

            let finalPetId = selectedPet;
            if (!finalPetId) {
                if (!newPetName.trim() || !newPetSpecies || !newPetBreed.trim()) {
                    throw new Error('Vui lòng thêm thông tin thú cưng trước khi tạo phiếu.');
                }
                const petResponse = await petService.createPet({
                    client: { id: resolvedCustomerId },
                    name: newPetName.trim(),
                    species: newPetSpecies,
                    breed: newPetBreed.trim(),
                    gender: 'male',
                    dateOfBirth: birthDate || undefined,
                    weight: weight ? Number(weight) : undefined,
                });
                finalPetId = petResponse?.data?.data?.id;
            }

            if (!finalPetId) {
                throw new Error('Không tìm thấy thú cưng hợp lệ để tạo phiếu tiếp đón.');
            }

            await receptionService.createReception({
                client: { id: resolvedCustomerId },
                pet: { id: finalPetId },
                examForm: {
                    examType: examType || 'khammoi',
                    emergency: isEmergency,
                },
                examReason: reason || '',
                symptomDescription: description || '',
                note: notes || '',
                status: 'da_tiep_don',
            });

            navigate(RECEPTIONIST_PATHS.TODAY_ORDERS);
        } catch (error) {
            setSubmitError(error?.message || 'Không thể tạo phiếu tiếp đón. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ReceptionistLayout>
        <div className="new-reception-page">
            {/* Header */}
            <header className="nr-header">
                <button className="nr-btn-icon" type="button" onClick={goToTodayOrders}>
                    <ChevronLeft size={24} color="#1a1a1a" />
                </button>
                <h1 className="nr-title">Tiếp đón mới</h1>
                {/* <div className="nr-header-avatar">
                    <img src="https://placehold.co/36x36/e0f2ef/209D80?text=Dr" alt="avatar" />
                </div> */}
            </header>

            <div className="nr-content">
                {/* Customer Info */}
                <div className="nr-customer-section">
                    <div className="nr-customer-row">
                        <h2 className="nr-customer-name">Khách hàng</h2>
                        {/* <div className="nr-customer-debt">
                            <span className="nr-debt-amount">10.000.000đ</span>
                        </div> */}
                    </div>
                    <div className="nr-customer-sub-row">
                        <div className="nr-customer-phone">
                            <Phone size={14} color="#209D80" />
                            <input
                                type="text"
                                className="nr-customer-input"
                                placeholder="Số điện thoại"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="nr-customer-sub-row">
                        <input
                            type="text"
                            className="nr-customer-input"
                            placeholder="Họ tên khách hàng"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                    </div>
                </div>

                {/* Pet Chips */}
                <div className="nr-pet-chips">
                    {pets.map(pet => (
                        <button
                            key={pet.id || pet.name}
                            className={`nr-pet-chip ${selectedPet === (pet.id || pet.name) ? 'active' : ''}`}
                            onClick={() => setSelectedPet(pet.id || pet.name)}
                        >
                            <PawPrint size={14} />
                            <span>{pet.name}</span>
                        </button>
                    ))}
                    <button type="button" className="nr-pet-chip-add" onClick={() => setShowAddPetModal(true)}>
                        <CirclePlus size={36} color="#209D80" />
                    </button>
                </div>

                {/* Form Section */}
                <div className="nr-form-section">
                    <h3 className="nr-form-title">Thông tin tiếp đón</h3>

                    {/* Pet Info Bar */}
                    {/* <div className="nr-pet-info-bar">
                        <div className="nr-pet-info-details">
                            <span className="nr-pet-info-name">{petInfo.name}</span>
                            <span className="nr-pet-info-breed">
                                {petInfo.breed}
                                <Mars size={12} color="#3b82f6" style={{ marginLeft: '2px' }} />
                            </span>
                            <span className="nr-pet-info-stat">
                                <Cake size={13} color="#888" />
                                {petInfo.age}
                            </span>
                            <span className="nr-pet-info-stat">
                                <Weight size={13} color="#888" />
                                {petInfo.weight}
                            </span>
                        </div>
                        <button className="nr-pet-edit-btn">
                            <PenSquare size={16} color="#209D80" />
                        </button>
                    </div> */}

                    {/* Weight */}
                    <div className="nr-field">
                        <label className="nr-field-label">Cân nặng <span className="nr-required">*</span></label>
                        <div className="nr-input-with-suffix">
                            <input
                                type="text"
                                className="nr-input"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder=""
                            />
                            <span className="nr-input-suffix">kg</span>
                        </div>
                    </div>

                    {/* Birth Date */}
                    <div className="nr-field">
                        <label className="nr-field-label">Ngày sinh</label>
                        <div className="nr-input-wrapper">
                            <input
                                type="date"
                                className="nr-input"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Reason */}
                    <div className="nr-field">
                        <label className="nr-field-label">Lý do khám <span className="nr-required">*</span></label>
                        <div className="nr-select-wrapper">
                            <select
                                className="nr-select"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            >
                                <option value="" disabled></option>
                                <option value="behohap">Bệnh hô hấp</option>
                                <option value="tieuhoa">Bệnh tiêu hóa</option>
                                <option value="dalieu">Bệnh da liễu</option>
                                <option value="khac">Khác</option>
                            </select>
                            <ChevronDown size={18} color="#888" className="nr-select-icon" />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="nr-field">
                        <label className="nr-field-label">Mô tả</label>
                        <textarea
                            className="nr-textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder=""
                        />
                    </div>

                    {/* Exam Type */}
                    <div className="nr-field">
                        <label className="nr-field-label">Hình thức khám</label>
                        <div className="nr-select-wrapper">
                            <select
                                className="nr-select"
                                value={examType}
                                onChange={(e) => setExamType(e.target.value)}
                            >
                                <option value="" disabled></option>
                                <option value="khammoi">Khám mới</option>
                                <option value="taikham">Tái khám</option>
                            </select>
                            <ChevronDown size={18} color="#888" className="nr-select-icon" />
                        </div>
                    </div>

                    {/* Assigned Doctor */}
                    <div className="nr-assigned-row">
                        <div className="nr-field nr-assigned-field">
                            <label className="nr-field-label">Bác sĩ phụ trách <span className="nr-required">*</span></label>
                            <div className="nr-select-wrapper">
                                <select
                                    className="nr-select"
                                    value={assignedDoctor}
                                    onChange={(e) => {
                                        const selectedDoctor = e.target.value;
                                        setAssignedDoctor(selectedDoctor);
                                        if (!selectedDoctor) {
                                            setAssignedCases('--');
                                        }
                                    }}
                                >
                                    <option value="" disabled></option>
                                    <option value="bshauyan">Bs. Hà Huy An</option>
                                    <option value="bsbinh">Bs. Bình</option>
                                </select>
                                <ChevronDown size={18} color="#888" className="nr-select-icon" />
                            </div>
                        </div>
                        <div className={`nr-shift-select-wrapper ${assignedDoctor ? 'active' : ''} ${assignedCases === '--' ? 'is-empty' : 'has-value'}`}>
                            <select
                                className="nr-shift-select"
                                value={assignedCases}
                                onChange={(e) => setAssignedCases(e.target.value)}
                                disabled={!assignedDoctor}
                            >
                                <option value="--">--</option>
                                <option value="01">01 ca</option>
                                <option value="02">02 ca</option>
                                <option value="03">03 ca</option>
                                <option value="04">04 ca</option>
                                <option value="05">05 ca</option>
                            </select>
                            <ChevronDown size={16} className="nr-shift-select-icon" />
                        </div>
                    </div>

                    {/* Assignee */}
                    <div className="nr-field">
                        <label className="nr-field-label">Người thực hiện <span className="nr-required">*</span></label>
                        <div className="nr-select-wrapper">
                            <select
                                className="nr-select"
                                value={assignee}
                                onChange={(e) => setAssignee(e.target.value)}
                            >
                                <option value="" disabled></option>
                                <option value="lehuyanh">Lê Huy Anh</option>
                                <option value="nguyenvanan">Nguyễn Văn An</option>
                            </select>
                            <ChevronDown size={18} color="#888" className="nr-select-icon" />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="nr-field">
                        <label className="nr-field-label">Lưu ý</label>
                        <textarea
                            className="nr-textarea"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            placeholder=""
                        />
                    </div>

                    {/* Emergency Toggle */}
                    <div className="nr-toggle-row">
                        <div
                            className={`nr-toggle ${isEmergency ? 'active' : ''}`}
                            onClick={() => setIsEmergency(!isEmergency)}
                        >
                            <div className="nr-toggle-thumb"></div>
                        </div>
                        <span className="nr-toggle-label">Cấp cứu</span>
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="nr-bottom-actions">
                <button className="nr-btn-cancel" type="button" onClick={goToTodayOrders}>Hủy bỏ</button>
                <button className="nr-btn-submit" type="button" onClick={handleCreateReception} disabled={isSubmitting}>
                    {isSubmitting ? 'Đang tạo...' : 'Tạo phiếu'}
                </button>
            </div>

            {submitError && <p className="nr-submit-error">{submitError}</p>}

            {showAddPetModal && (
                <>
                    <div className="nr-pet-modal-overlay" onClick={() => setShowAddPetModal(false)}></div>
                    <div className="nr-pet-modal">
                        <div className="nr-pet-modal-handle"></div>
                        <h3 className="nr-pet-modal-title">Tạo mới thú cưng</h3>

                        <div className="nr-pet-modal-form-row">
                            <div className="nr-pet-modal-field nr-pet-modal-field-half">
                                <label className="nr-pet-modal-label">Thú cưng <span className="nr-required">*</span></label>
                                <input
                                    type="text"
                                    className="nr-pet-modal-input"
                                    value={newPetName}
                                    onChange={(e) => setNewPetName(e.target.value)}
                                />
                            </div>

                            <div className="nr-pet-modal-field nr-pet-modal-field-half">
                                <label className="nr-pet-modal-label">Loài <span className="nr-required">*</span></label>
                                <div className="nr-pet-modal-select-wrapper">
                                    <select
                                        className="nr-pet-modal-select"
                                        value={newPetSpecies}
                                        onChange={(e) => setNewPetSpecies(e.target.value)}
                                    >
                                        <option value="" disabled></option>
                                        <option value="cho">Chó</option>
                                        <option value="meo">Mèo</option>
                                        <option value="khac">Khác</option>
                                    </select>
                                    <ChevronDown size={16} color="#666" className="nr-pet-modal-select-icon" />
                                </div>
                            </div>
                        </div>

                        <div className="nr-pet-modal-field">
                            <label className="nr-pet-modal-label">Giống <span className="nr-required">*</span></label>
                            <div className="nr-pet-modal-select-wrapper">
                                <select
                                    className="nr-pet-modal-select"
                                    value={newPetBreed}
                                    onChange={(e) => setNewPetBreed(e.target.value)}
                                >
                                    <option value="" disabled></option>
                                    <option value="poodle">Poodle</option>
                                    <option value="corgi">Corgi</option>
                                    <option value="husky">Husky</option>
                                    <option value="golden">Golden Retriever</option>
                                </select>
                                <ChevronDown size={16} color="#666" className="nr-pet-modal-select-icon" />
                            </div>
                        </div>

                        <div className="nr-pet-modal-actions">
                            <button type="button" className="nr-pet-modal-btn-cancel" onClick={() => setShowAddPetModal(false)}>Hủy bỏ</button>
                            <button type="button" className="nr-pet-modal-btn-submit" onClick={handleCreatePet}>Tạo mới</button>
                        </div>
                    </div>
                </>
            )}
        </div>
        </ReceptionistLayout>
    );
};

export default NewReception;
